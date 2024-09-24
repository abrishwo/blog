import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = "https://vivid-flowers-9f3564b8da.strapiapp.com"
// const BASE_URL = 'http://localhost:1337';

// Fetch all articles 
export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (params = {}) => {

  const { page = 1, pageSize = 4, tags = [], search = "" } = params;
  let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  
  if (tags.length > 0) {
    const tagsQuery = tags.map(tag => `filters[tags][Name][$eq]=${tag}`).join('&');
    query += `&${tagsQuery}`;
  }

  if (search) {
    query += `&filters[Title][$containsi]=${search}`;
  }

  const response = await axios.get(query);
  return response.data;
});

// Fetch article details by slug
export const fetchArticleDetails = createAsyncThunk('articles/fetchArticleDetails', async (slug) => {
  const response = await axios.get(`${BASE_URL}/api/articles?filters[Slug][$eq]=${slug}&populate=*`);
  return response.data;
});

// Fetch related posts (based on tags or categories)
export const fetchRelatedPosts = createAsyncThunk('articles/fetchRelatedPosts', async (tags) => {
  const tagsQuery = tags.map(tag => `filters[tags][Name][$eq]=${tag}`).join('|');
  const query = `${BASE_URL}/api/articles?populate=*&${tagsQuery}&pagination[pageSize]=3`;
  const response = await axios.get(query);
  console.log(response.data);
  return response.data;
});


// export const fetchRelatedPosts = createAsyncThunk('articles/fetchRelatedPosts', async ({ currentPostId, tags }) => {
//   try {
//     const query = `${BASE_URL}/api/articles?populate=*`; // Fetch enough posts to analyze
//     const response = await axios.get(query);
//     const allPosts = response.data;
// console.log(allPosts);
//     const filteredPosts = allPosts.filter(post => post.id !== currentPostId);

//     const relatedPosts = filteredPosts
//       .map(post => {
//         const postTags = post.attributes.tags.data.map(tag => tag.attributes.Name);
//         const similarTagsCount = postTags.filter(tag => tags.includes(tag)).length;
//         return {
//           ...post,
//           similarTagsCount,
//         };
//       })
//       .filter(post => post.similarTagsCount > 0) // Keep only posts with at least 1 matching tag
//       .sort((a, b) => b.similarTagsCount - a.similarTagsCount) // Sort by similarity (descending)
//       .slice(0, 3); // Return top 3 most similar posts
// console.log(relatedPosts);
//     return relatedPosts;
  
//   } catch (error) {
//     console.error('Error fetching related posts:', error);
//     throw error;
//   }
// });


// Fetch posts (based on tags or categories)
export const fetchPostsByTags = createAsyncThunk('articles/fetchPostsByTags', async (tag) => {
  const response = await axios.get(`${BASE_URL}/api/articles/?filters[tags][Slug][$eq]=${tag}&populate=*`);
  // https://vivid-flowers-9f3564b8da.strapiapp.com/api/articles/?filters[tags][Slug][$eq]=belgium&populate=*
  return response.data.data;
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    items: [],
    details: null,
    relatedPosts: [],
    postsByTag: [],
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
        state.relatedPosts = action.payload;
      })
      .addCase(fetchRelatedPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });


          // Fetch posts By Tags
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
