import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientStore';

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    // Other reducers can be added here
  },
});