import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles, setSearch, setSelectedTags, setPagination, fetchTags } from '../../redux/slices/articlesSlice';

const SearchModal = ({ searchModal, setSearchModal }) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  // const [tags, setTags] = useState([]); // Tags array
  // const [selectedTags, setSelectedTags] = useState([]); // Selected tags
  const [suggestions, setSuggestions] = useState([]); // Keyword suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // Show suggestions

  const dispatch = useDispatch();

  // Redux state
  const { items, tags, search, selectedTags, status } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchTags()); // Fetch all available tags on mount
    dispatch(fetchArticles({ search, tags: selectedTags }));
  }, [searchModal]);


  useEffect(() => {
    if (searchModal) {
      
      document.getElementById("searchModalInput").focus();

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          router.push({
            pathname: "/search",
            query: { key: input, tags: selectedTags.join(",") },
          });
          setSearchModal(false);
        }
        if (e.key === "Escape") {
          setSearchModal(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup event listener on unmount
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [input, selectedTags, router, searchModal, setSearchModal]);

  // const handleTagClick = (tag) => {
  //   setSelectedTags(
  //     selectedTags.includes(tag)
  //       ? selectedTags.filter((t) => t !== tag)
  //       : [...selectedTags, tag]
  //   );
  // };
  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(updatedTags)); // Update Redux state
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Show suggestions based on input (mock suggestions)
    if (value.length > 2) {
      setSuggestions([
        `${value} article`,
        `${value} news`,
        `Latest on ${value}`,
        `Trending in ${value}`,
      ]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`search-modal ${searchModal ? "open" : ""}`}>
      {/* Close Button */}
      <button onClick={() => setSearchModal(false)} className="search-close">
        <IoCloseCircleOutline />
      </button>

      {/* Input field */}
      <input
        type="text"
        className="search-input"
        id="searchModalInput"
        placeholder="Search by keyword..."
        value={input}
        onChange={handleInputChange}
      />

      {/* Suggestions */}
      {/* {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => {
                setInput(suggestion);
                setShowSuggestions(false); // Hide suggestions when selected
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )} */}

      {/* Tags Filter */}
      <div className="tags-filter">
        {tags && tags?.data?.map((tag, index) => (
          <button
            key={index}
            className={`tag-btn ${
              selectedTags.includes(tag?.attributes?.Slug) ? "tag-selected" : ""
            }`}
            onClick={() => handleTagClick(tag?.attributes?.Slug)}
          >
            {tag?.attributes?.Name}
          </button>
        ))}
      </div>

      {/* Styling */}
      <style jsx>{`
        .search-modal {
          position: fixed;
          top: 0%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 600px;
          max-height: fit-content !important;
          padding: 20px;
          background-color: white;
        
          z-index: 999;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        }

        .search-close {
          position: absolute;
          top: 2rem !important;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .search-input {
          margin-top: 2rem !important;
          padding: 12px;
          font-size: 16px;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 10px;
          outline: none;
        }

        .search-input:focus {
          border-color: #0070f3;
        }

        .suggestions-list {
          margin-top: 10px;
          list-style: none;
          padding: 0;
          background: white;
          max-height: 200px;
          overflow-y: auto;
        }

        .suggestion-item {
          padding: 10px;
          cursor: pointer;
         
        }

        .suggestion-item:hover {
          background-color: #f7f7f7;
          
        }

        .tags-filter {
          margin-top: 15px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag-btn {
          padding: 8px 12px;
          font-size: 14px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .tag-btn:hover {
          background-color: #0070f3;
          color: white;
        }

        .tag-selected {
          background-color: #0070f3;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SearchModal;
