import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetch all articles with advanced search functionality
export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (params = {}) => {
  const { page = 1, pageSize = 4, tags = [], search = "" } = params;
  
  let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  
  // Add tags filtering if tags are selected
  if (tags.length > 0) {
    const tagsQuery = tags.map(tag => `filters[tags][Name][$eq]=${tag.replace("_"," ")}`).join('&');
    query += `&${tagsQuery}`;
  }

  // Add search filtering if search input is provided
  if (search) {
    const searchFields = ['Title', 'Excerpt', 'Content', 'Slug'];
    const searchQuery = searchFields
      .map(field => `filters[${field}][$containsi]=${search}`)
      .join('&');
    
    query += `&${searchQuery}`;
  }

  const response = await axios.get(query);
  return response.data;
});

// Fetch article details by slug
export const fetchArticleDetails = createAsyncThunk('articles/fetchArticleDetails', async (slug) => {
  const response = await axios.get(`${BASE_URL}/api/articles?filters[Slug][$eq]=${slug}&populate=*`);
  return response.data;
});

// Fetch related posts
export const fetchRelatedPosts = createAsyncThunk('articles/fetchRelatedPosts', async ({ currentPostId, tags }) => {
  try {
    const query = `${BASE_URL}/api/articles?populate=*`;
    const response = await axios.get(query);
    const allPosts = response.data.data;

    const filteredPosts = allPosts.filter(post => post.id !== currentPostId);

    const relatedPosts = filteredPosts
      .map(post => {
        const postTags = post.attributes.tags.data.map(tag => tag.attributes.Name);
        const similarTagsCount = postTags.filter(tag => tags.includes(tag)).length;
        return {
          ...post,
          similarTagsCount,
        };
      })
      .filter(post => post.similarTagsCount > 0)
      .sort((a, b) => b.similarTagsCount - a.similarTagsCount)
      .slice(0, 3);

    return relatedPosts;
  
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw error;
  }
});

// Fetch posts by tag
export const fetchPostsByTags = createAsyncThunk('articles/fetchPostsByTags', async (tag) => {
  const response = await axios.get(`${BASE_URL}/api/articles/?filters[tags][Slug][$eq]=${tag}&populate=*`);
  return response.data.data;
});

// Fetch tags
export const fetchTags = createAsyncThunk('articles/fetchTags', async () => {
  const response = await axios.get(`${BASE_URL}/api/tags/?populate=*`);
  return response.data;
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    items: [],
    details: null,
    relatedPosts: [],
    postsByTag: [],
    tags: [],
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
        state.items = action.payload;
        state.pagination.totalItems = action.payload.meta.pagination.total;
        state.pagination.totalPages = action.payload.meta.pagination.pageCount;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Fetch tags
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
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
        state.relatedPosts = action.payload;
      })
      .addCase(fetchRelatedPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Fetch posts by tag
    builder
      .addCase(fetchPostsByTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsByTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.postsByTag = action.payload;
      })
      .addCase(fetchPostsByTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearch, setSelectedTags, setPagination } = articlesSlice.actions;

export default articlesSlice.reducer;
