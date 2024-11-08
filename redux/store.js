import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articlesSlice';
import aboutReducer from './slices/aboutSlice';
import contactReducer from './slices/contactSlice';
import systemReducer from './slices/systemSlice';
import privacyReducer from './slices/privacySlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    about: aboutReducer,
    contact: contactReducer,
    config: systemReducer,
    privacy: privacyReducer,
    // Add other slice reducers here
  },
});

export default store;
