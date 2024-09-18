"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Article } from "../../types";

interface TagsFilterProps {
  onFilterChange: (filteredArticles: Article[]) => void;
}

const TagsFilter: React.FC<TagsFilterProps> = ({ onFilterChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // Fetching tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/tags');
        setTags(response.data.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Fetching filtered articles when selectedTags change
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/articles', {
          params: {
            'filters[Tags][id][$in]': selectedTags,
          },
        });

        onFilterChange(response.data.data); 
      } catch (error) {
        console.error('Error fetching filtered articles:', error);
      }
    };

    if (selectedTags.length > 0) {
      fetchFilteredArticles();
    } else {
      // Reset the filter if no tags are selected
      onFilterChange([]);
    }
  }, [selectedTags, onFilterChange]);

  // Handling tag checkbox change
  const handleTagChange = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <div className="tags-filter">
      <h2 className='top-6 mt-10 mb-4'>Filter by Tags</h2>
      <div className="tags-list">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-item flex items-center mb-2">
            <input
              type="checkbox"
              id={`tag-${tag.id}`}
              checked={selectedTags.includes(tag.id)}
              onChange={() => handleTagChange(tag.id)}
              className="mr-2"
            />
            <label htmlFor={`tag-${tag.id}`}>{tag.attributes.Name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsFilter;
