import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clientStore';
import projectReducer from './projectStore';
import leaveReducer from './leaveStore';

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    projects: projectReducer,
    leaves: leaveReducer,
    // Other reducers can be added here
  },
});