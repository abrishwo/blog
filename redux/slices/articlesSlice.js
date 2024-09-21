import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all articles 
export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (params = {}) => {
  const { page = 1, pageSize = 4, tags = [], search = "" } = params;
  let query = `https://vivid-flowers-9f3564b8da.strapiapp.com/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  
  if (tags.length > 0) {
    const tagsQuery = tags.map(tag => `filters[tags][name][$eq]=${tag}`).join('&');
    query += `&${tagsQuery}`;
  }

  if (search) {
    query += `&filters[title][$containsi]=${search}`;
  }

  const response = await axios.get(query);
  return response.data;
});

// Fetch article details by slug
export const fetchArticleDetails = createAsyncThunk('articles/fetchArticleDetails', async (slug) => {
  const response = await axios.get(`https://vivid-flowers-9f3564b8da.strapiapp.com/api/articles?filters[slug][$eq]=${slug}&populate=*`);
  return response.data;
});

// Fetch related posts (based on tags or categories)
export const fetchRelatedPosts = createAsyncThunk('articles/fetchRelatedPosts', async (tags) => {
  const tagsQuery = tags.map(tag => `filters[tags][name][$eq]=${tag}`).join('|');
  const query = `https://vivid-flowers-9f3564b8da.strapiapp.com/api/articles?populate=*&${tagsQuery}&pagination[pageSize]=3`;
  // const query = "http://localhost:1337/api/articles?populate=*&filters[tags][name][$eq]=Belgium&pagination[pageSize]=3";
  const response = await axios.get(query);
  console.log(response.data);
  return response.data;
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    items: [],
    details: null,
    relatedPosts: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    pagination: {
      currentPage: 1,
      totalItems: 0,
      pageSize: 10,
      totalPages: 1,
    },
    search: '',
    selectedTags: [],
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch all articles
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination.totalItems = action.payload.meta.pagination.total;
        state.pagination.totalPages = action.payload.meta.pagination.pageCount;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Fetch article details by slug
    builder
      .addCase(fetchArticleDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticleDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.details = action.payload;
      })
      .addCase(fetchArticleDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Fetch related posts
    builder
      .addCase(fetchRelatedPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRelatedPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.relatedPosts = action.payload.data;
      })
      .addCase(fetchRelatedPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearch, setSelectedTags, setPagination } = articlesSlice.actions;

export default articlesSlice.reducer;
