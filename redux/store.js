import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articlesSlice';
import aboutReducer from './slices/aboutSlice';
import contactReducer from './slices/contactSlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    about: aboutReducer,
    contact: contactReducer,
    // Add other slice reducers here
  },
});

export default store;
