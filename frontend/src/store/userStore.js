import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import axios from '../api/axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('/users');
  return response.data;
});

export const fetchUserProfile = createAsyncThunk('users/fetchUserProfile', async (userId) => {
  const response = await axios.get(`/users/${userId}`);
  return response.data.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData) => {
  const response = await axios.post('/users/register', userData);
  return response.data.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, userData }) => {
  const response = await axios.put(`/users/${userId}`, userData);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  await axios.delete(`/users/${userId}`);
  return userId;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch users';
        state.isLoading = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch user profile';
        state.isLoading = false;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create user';
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update user';
        state.isLoading = false;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete user';
        state.isLoading = false;
      });
  },
});

const store = configureStore({
  reducer: {
    users: userSlice.reducer,
  },
});

export default store;