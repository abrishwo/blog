import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetch all articles with advanced search functionality

// export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (params = {}) => {
//   const { page = 1, pageSize = 4, tags = [], search = "" } = params;
  
//   // Start building the query with pagination and population
//   let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  
//   try {
//     const response = await axios.get(query);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching articles:', error);
//     throw error;
//   }
// });
// Fetch all articles 

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (params = {}) => {
  // blogger/frontend/redux/slices/articlesSlice.js
  const { page = 1, pageSize = 8, tags = [], search = "" } = params;
  let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=date:desc`;
  
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


/*
export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (params = {}) => {
  const { page = 1, pageSize = 4, tags = [], search = "" } = params;
  let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=Date:desc`;

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

*/
// search all articles with advanced search functionality
/*
export const searchArticles = createAsyncThunk('articles/searchArticles', async (params = {}) => {
  const { page = 1, pageSize = 4, tags = [], search = "" } = params;

  // Start building the base query with pagination and population
  // let query = `${BASE_URL}/api/articles?populate=*`;
  let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  // Initialize conditions for filters
  let conditions = [];

  // 1. When both search input and tags are empty, return all articles
  if (tags.length === 0 && !search) {
    // No filtering is needed, return all articles (just pagination)
    // The base query already handles this case, so we don't need to modify it further
  }

  // 2. When tags are selected and search input is empty
  else if (tags.length > 0 && !search) {
    // Add tag filtering with OR logic to match any of the selected tags
    const tagsQuery = tags.map((tag, index) =>
      `filters[$and][${index}][tags][Slug][$eqi]=${tag}`).join('&');
    conditions.push(tagsQuery);
  }

  // 3. When both tags and search input are provided (existing condition)
  else if (tags.length > 0 && search) {
    // Add tag filtering with OR logic to match any of the selected tags
    const tagsQuery = tags.map((tag, index) =>
      `filters[$and][0][$and][${index}][tags][Slug][$eqi]=${tag}`).join('&');
    conditions.push(tagsQuery);

    // Add search filtering for title, excerpt, content, or slug fields
    const searchFields = ['Title', 'Excerpt', 'Content', 'Slug'];
    const searchQuery = searchFields
      .map((field, index) => `filters[$and][1][$or][${index}][${field}][$containsi]=${search}`)
      .join('&');
    
    conditions.push(searchQuery);
  }

  // 4. When search input is provided and tags are empty (existing condition)
  else if (!tags.length && search) {
    // Add search filtering for title, excerpt, content, or slug fields
    const searchFields = ['Title', 'Excerpt', 'Content', 'Slug'];
    const searchQuery = searchFields
      .map((field, index) => `filters[$or][${index}][${field}][$containsi]=${search}`)
      .join('&');
    
    conditions.push(searchQuery);
  }

  // Combine conditions into the query string
  if (conditions.length > 0) {
    query += `&${conditions.join('&')}`;
  }

  // Fetch articles from Strapi API
  try {
    const response = await axios.get(query);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
});

*/
export const searchArticles = createAsyncThunk(
  "articles/searchArticles",
  async (params = {}) => {
    const { page = 1, pageSize = 8, tags = [], search = "" } = params;

    let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=date:desc`;
    let conditions = [];

    if (tags.length > 0) {
      const tagsQuery = tags
        .map((tag, index) => `filters[$and][${index}][tags][Slug][$eqi]=${tag}`)
        .join("&");
      conditions.push(tagsQuery);
    }

    if (search) {
      const searchFields = ["Title", "Excerpt", "Content", "Slug"];
      const searchQuery = searchFields
        .map(
          (field, index) =>
            `filters[$or][${index}][${field}][$containsi]=${search}`
        )
        .join("&");
      conditions.push(searchQuery);
    }

    if (conditions.length > 0) {
      query += `&${conditions.join("&")}`;
    }

    try {
      const response = await axios.get(query);
      
      return {
        articles: response.data.data,
        totalPages: response.data.meta.pagination.pageCount, // Get total pages
        totalArticles: response.data.meta.pagination.total, // Total articles count
      };
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  }
);

export const searchArticles_backup = createAsyncThunk('articles/searchArticles', async (params = {}) => {
  const { page = 1, pageSize = 4, tags = [], search = "" } = params;

  // Start building the base query with pagination and population
  let query = `${BASE_URL}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  // Initialize conditions for filters
  let conditions = [];

  // 1. When both search input and tags are empty, return all articles
  if (tags.length === 0 && !search) {
    // No filtering is needed, return all articles (just pagination)
    // The base query already handles this case, so we don't need to modify it further
  }

  // 2. When tags are selected and search input is empty
  else if (tags.length > 0 && !search) {
    // Add tag filtering with OR logic to match any of the selected tags
    const tagsQuery = tags.map((tag, index) =>
      `filters[$or][${index}][tags][Slug][$eqi]=${tag}`).join('&');
    conditions.push(tagsQuery);
  }

  // 3. When both tags and search input are provided (existing condition)
  else if (tags.length > 0 && search) {
    // Add tag filtering with OR logic to match any of the selected tags
    const tagsQuery = tags.map((tag, index) =>
      `filters[$and][0][$or][${index}][tags][Slug][$eqi]=${tag}`).join('&');
    conditions.push(tagsQuery);

    // Add search filtering for title, excerpt, content, or slug fields
    const searchFields = ['Title', 'Excerpt', 'Content', 'Slug'];
    const searchQuery = searchFields
      .map((field, index) => `filters[$and][1][$or][${index}][${field}][$containsi]=${search}`)
      .join('&');
    
    conditions.push(searchQuery);
  }

  // 4. When search input is provided and tags are empty (existing condition)
  else if (!tags.length && search) {
    // Add search filtering for title, excerpt, content, or slug fields
    const searchFields = ['Title', 'Excerpt', 'Content', 'Slug'];
    const searchQuery = searchFields
      .map((field, index) => `filters[$or][${index}][${field}][$containsi]=${search}`)
      .join('&');
    
    conditions.push(searchQuery);
  }

  // Combine conditions into the query string
  if (conditions.length > 0) {
    query += `&${conditions.join('&')}`;
  }

  // Fetch articles from Strapi API
  try {
    const response = await axios.get(query);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
});

// Fetch article details by slug
export const fetchArticleDetails = createAsyncThunk('articles/fetchArticleDetails', async (slug) => {
  // https://admin.starsandtoques.com/api/articles?filters[Slug][$eq]=data-management&populate[gallery][populate][images]=*
  // https://admin.starsandtoques.com/api/articles?filters[Slug][$eq]=data-management&populate[gallery][populate][images]=*&populate[Images]=*   for all population
  // const response = await axios.get(`${BASE_URL}/api/articles?filters[Slug][$eq]=${slug}&populate=*`);
  // const response = await axios.get(`${BASE_URL}/api/articles?filters[Slug][$eq]=${slug}&populate[gallery][populate][images]=*&populate[Images]=*&populate[Thumbnail]=*&populate[tags]=*`);
  const response = await axios.get(`${BASE_URL}/api/articles?filters[Slug][$eq]=${slug}&populate[gallery][populate][images]=*&populate[Thumbnail]=*&populate[tags]=*`);
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
  const response = await axios.get(`${BASE_URL}/api/articles/?filters[tags][Slug][$eqi]=${tag}&populate=*`);
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
    searchData: [],
    details: null,
    relatedPosts: [],
    postsByTag: [],
    tags: [],
    byTagStatus: 'idle',
    searchStatus: 'idle',
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    pagination: {
      currentPage: 1,
      totalItems: 20,
      pageSize: 8,
      totalPages: 1,
    },
    search: '',
    selectedTags: [],
    featuredArticle: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },

    setFeaturedArticle: (state, action) => {
      state.featuredArticle = action.payload;
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

          // Fetch all articles
  builder
    .addCase(searchArticles.pending, (state) => {
      state.searchStatus = 'loading';
    })
    // .addCase(searchArticles.fulfilled, (state, action) => {
    //   state.searchStatus = 'succeeded';
    //   state.searchData = action.payload;
    //   state.pagination.totalItems = action.payload.meta.pagination.total;
    //   state.pagination.totalPages = action.payload.meta.pagination.pageCount;
    // })
    .addCase(searchArticles.fulfilled, (state, action) => {
      state.searchStatus = 'succeeded';
      state.searchData = action.payload || [];
      state.pagination.totalItems = action.payload?.meta?.pagination?.total || 0;
      state.pagination.totalPages = action.payload?.meta?.pagination?.pageCount || 1;
    }) 
    // .addCase(searchArticles.fulfilled, (state, action) => {
    //   console.log("🔍 Payload Received:", action.payload); // Debugging
    //   state.searchStatus = 'succeeded';
    //   state.searchData = action.payload?.data || [];
    //   state.pagination.totalItems = action.payload?.meta?.pagination?.total || 0;
    //   state.pagination.totalPages = action.payload?.meta?.pagination?.pageCount || 1;
    // })
       
    .addCase(searchArticles.rejected, (state, action) => {
      state.searchStatus = 'failed';
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
        state.byTagStatus = 'loading';
      })
      .addCase(fetchPostsByTags.fulfilled, (state, action) => {
        state.byTagStatus = 'succeeded';
        state.postsByTag = action.payload;
      })
      .addCase(fetchPostsByTags.rejected, (state, action) => {
        state.byTagStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearch, setSelectedTags,setFeaturedArticle, setPagination } = articlesSlice.actions;

export default articlesSlice.reducer;
