import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchSystemConfig = createAsyncThunk('config/fetchSystemConfig', async () => {
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

const systemSlice = createSlice({
  name: 'config',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
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
  },
});

export default systemSlice.reducer;
