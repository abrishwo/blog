import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetch contact page data
export const fetchContactUs = createAsyncThunk('contact/fetchContactUs', async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/contacts?populate=*`);
    const data = res.data;
    return data.data[0];
  } catch (error) {
    console.error('Error fetching Contact Us data:', error);
    throw error;
  }
});

// Submit contact form data
export const submitContactForm = createAsyncThunk(
  'contact/submitContactForm',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/messages`, {
        data: formData, // Adjust based on the structure Strapi expects
      });
      return res.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return rejectWithValue(error.response.data || 'Form submission failed');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    items: [],
    status: 'idle', 
    formStatus: 'idle', 
    error: null,
    formError: null, 
    formSuccess: null, 
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

  
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.formStatus = 'loading';
        state.formError = null;
        state.formSuccess = null;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.formStatus = 'succeeded';
        state.formSuccess = 'Your message has been successfully sent!';
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.formStatus = 'failed';
        state.formError = action.payload || 'Form submission failed';
      });
  },
});

export default contactSlice.reducer;
