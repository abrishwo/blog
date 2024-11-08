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

// Submit contact form data and send email notification
export const submitContactForm = createAsyncThunk(
  'contact/submitContactForm',
  async (formData, { rejectWithValue }) => {
    try {
      // 1. Submit form data to Strapi CMS
      const res = await axios.post(`${BASE_URL}/api/messages`, {
        data: formData, // Adjust based on the structure Strapi expects
      });

      
      // 2. Send email notification (through Next.js API route)
      await axios.post('/api/contact', formData); // Assuming you have a `/api/contact` route set up in Next.js

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
    mailConfig: null,
  },
  reducers: {
    setMailConfig: (state, action) => {
      state.mailConfig = action.payload;
    },
  },
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

    // Handle contact form submission
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
export const {setMailConfig } = contactSlice.actions;

export default contactSlice.reducer;
