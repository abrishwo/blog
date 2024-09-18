// /components/SearchModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchSearchResults, setSearchTerm } from '../../store/slices/searchSlice';
import { closeModal } from '../../store/slices/modalSlice';

const SearchModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm, results, loading } = useSelector((state: RootState) => state.search);
  const isModalOpen = useSelector((state: RootState) => state.modal.isModalOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchSearchResults(searchTerm));
    }
  }, [searchTerm, dispatch]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-3xl p-6 shadow-lg relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => dispatch(closeModal())}
        >
          &times;
        </button>

        {/* Search Box */}
        <input
          type="text"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleInputChange}
        />

        {/* Display Search Results */}
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg shadow-sm">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg">{post.title}</h2>
                  <p>{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
