// /store/slices/searchSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch posts from Strapi
export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async (searchTerm: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/articles`, {
      params: {
        title_contains: searchTerm,  // Modify based on your Strapi setup
      },
    });
    return response.data;
  }
);

interface SearchState {
  searchTerm: string;
  results: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  searchTerm: '',
  results: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    clearSearch(state) {
      state.searchTerm = '';
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch search results';
      });
  },
});

export const { setSearchTerm, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
