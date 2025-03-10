import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientStore';
import projectReducer from './projectStore';

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    projects: projectReducer,
    // Other reducers can be added here
  },
});