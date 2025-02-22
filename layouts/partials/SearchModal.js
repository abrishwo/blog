import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline, IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles, searchArticles, setSearch, setSelectedTags, setPagination, fetchTags } from '../../redux/slices/articlesSlice';

const SearchModal = ({ searchModal, setSearchModal }) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Keyword suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // Show suggestions

  const dispatch = useDispatch();

  // Redux state
  const { items, tags, search, selectedTags, status, searchData, searchStatus } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchTags()); // Fetch all available tags on mount
    // dispatch(fetchArticles({ search, tags: selectedTags }));
  }, [searchModal]);

  useEffect(() => {
    if (searchModal) {
      document.getElementById("searchModalInput").focus();

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleSearch();
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

  

  const handleSearch = () => {
    dispatch(setSearch(input));
    // handleTagClick();
    dispatch(searchArticles({ search: input, tags: selectedTags }));
    router.push({
      pathname: "/search",
      query: { key: input, tags: selectedTags.join(",") , searchData: searchData},
    });
    setSearchModal(false);
  };

  return (
    <div className={`search-modal ${searchModal ? "open" : ""}`}>
      {/* Close Button */}
      <button onClick={() => setSearchModal(false)} className="search-close">
        <IoCloseCircleOutline />
      </button>

      {/* Input field with search button */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          id="searchModalInput"
          placeholder="Search by keyword..."
          value={input}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearch}>
          <IoSearchOutline />
        </button>
      </div>

      {/* Tags Filter */}
      {/* Tags Filter */}
<div className="tags-filter">
  {(tags && tags?.data?.length>0) &&
    [...tags.data]
      .sort((a, b) => {
        const nameA = a.attributes.Name.toLowerCase();
        const nameB = b.attributes.Name.toLowerCase();

        const isNumA = /^\d/.test(nameA);
        const isNumB = /^\d/.test(nameB);

        if (isNumA && isNumB) {
          return parseInt(nameA) - parseInt(nameB); // Numeric sorting
        } else if (isNumA) {
          return -1; // Numbers come first
        } else if (isNumB) {
          return 1;
        }
        return nameA.localeCompare(nameB); // Alphabetical sorting
      })
      .map((tag, index) => (
        <button
          key={index}
          className={`tag-btn ${
            selectedTags.includes(tag.attributes.Slug) ? "tag-selected" : ""
          }`}
          onClick={() => handleTagClick(tag.attributes.Slug)}
        >
          {tag.attributes.Name}
        </button>
      ))}
</div>

      {/* <div className="tags-filter">
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
      </div> */}


      {/* Styling */}
      <style jsx>{`
     
        .search-modal {
          position: fixed;
          top: 0%;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          // max-width: 600px;
          padding: 20px;
          // background-color: white;
          z-index: 999;
         
          display: flex;
          flex-direction: column;
          // height: 40vh;

          background-color: #ffffff;
  border: 1px solid #e0e0e0; /* Light border for a subtle effect */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .search-close {
          position: absolute;
          top: 2rem !important;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 34px;
          cursor: pointer;
        }

        .search-bar {
          display: flex;
          margin-top: 2rem !important;
          align-items: center;
          width: 100%;
        }

        .search-input {
          padding: 12px;
          font-size: 16px;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 8px 8px 8px 8px;
          outline: none;
        }

        .search-input:focus {
          border-color: #0070f3;
        }

        .search-button {
          min-height: 50px !important;
          min-width: 8vw !important;
          background-color: #0070f3;
          border: none;
          padding: 12px;
          font-size: 24px;
          display: inline-flex;
          justify-content: center;
          color: white;
          cursor: pointer;
          border-radius: 0 8px 8px 0;
          transform : translateX(-100%) !important;
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

        @media (max-width: 768px) {
          .search-modal {
            width: 95%;
            height: 100%;
            min-height: 100vh;
          }

          .search-input {
            font-size: 14px;
          }

          .search-button {
            padding: 10px;
          }

          .tag-btn {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchModal;
