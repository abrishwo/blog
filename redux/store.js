import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articlesSlice';
import aboutReducer from './slices/aboutSlice';
import contactReducer from './slices/contactSlice';
import systemSlice from './slices/systemSlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    about: aboutReducer,
    contact: contactReducer,
    config: systemSlice,
    // Add other slice reducers here
  },
});

export default store;
