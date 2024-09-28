import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetch about page data
export const fetchPrivacy = createAsyncThunk('privacy/fetchPrivacy', async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/privacies?populate=*`);
    const data = res.data;
    console.log(data);
    return data.data[0];
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    throw error;
  }
});

const privacySlice = createSlice({
  name: 'privacy',
  initialState: {
    privacy: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivacy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrivacy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.privacy = action.payload;
      })
      .addCase(fetchPrivacy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default privacySlice.reducer;
