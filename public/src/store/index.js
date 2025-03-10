import { configureStore } from '@reduxjs/toolkit';
// Remove the import for clientReducer since the file doesn't exist
// import clientReducer from './clientStore';

// Create the store without using hooks
export const store = configureStore({
  reducer: {
    // Remove the clients reducer since clientReducer doesn't exist
    // clients: clientReducer,
    // Add your other reducers here
  },
});

// Don't export hooks directly from this file
// Instead, create custom hooks that use the store
// Export these for use in components
export { useSelector, useDispatch } from 'react-redux';