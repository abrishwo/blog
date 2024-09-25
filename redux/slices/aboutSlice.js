import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetch about page data
export const fetchAboutUs = createAsyncThunk('about/fetchAboutUs', async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/abouts?populate=*`);
    const data = res.data;
    console.log(data);
    return data.data[0];
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    throw error;
  }
});

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutUs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAboutUs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAboutUs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default aboutSlice.reducer;
