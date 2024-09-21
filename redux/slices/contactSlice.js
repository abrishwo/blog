import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch contact page data
export const fetchContactUs = createAsyncThunk('contact/fetchContactUs', async () => {
  try {
    const res = await axios.get('http://localhost:1337/api/contacts?populate=*');
    const data = res.data;
    return data.data[0];
  } catch (error) {
    console.error('Error fetching Contact Us data:', error);
    throw error;
  }
});

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactUs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContactUs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchContactUs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contactSlice.reducer;
