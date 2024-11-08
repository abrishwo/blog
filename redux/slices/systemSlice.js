import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchSystemConfig = createAsyncThunk('config/fetchSystemConfig', async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/system-configs?populate=*`);
    const data = res.data;
    console.log(data);
    return data.data[0];
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    throw error;
  }
});

export const fetchSocialMedia = createAsyncThunk('config/fetchSocialMedia', async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/social-medias?populate=*`);
    const data = res.data;
    console.log(data);
    return data.data;
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    throw error;
  }
});


const systemSlice = createSlice({
  name: 'config',
  initialState: {
    items: [],
    social:[],
    status: 'idle', // idle | loading | succeeded | failed
    smStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSystemConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSystemConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

      // social media settings
      builder
      .addCase(fetchSocialMedia.pending, (state) => {
        state.smStatus = 'loading';
      })
      .addCase(fetchSocialMedia.fulfilled, (state, action) => {
        state.smStatus = 'succeeded';
        state.social = action.payload;
      })
      .addCase(fetchSocialMedia.rejected, (state, action) => {
        state.smStatus = 'failed';
        state.error = action.error.message;
      });
  },


});

export default systemSlice.reducer;
