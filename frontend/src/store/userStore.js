import { create } from 'zustand';
import axios from '../api/axios';

const useUserStore = create((set) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/users'); // Adjust the endpoint as necessary
      set({ users: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch users', isLoading: false });
    }
  },

  fetchUserProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/users/${userId}`); // Adjust the endpoint as necessary
      set({ currentUser: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch user profile', isLoading: false });
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/users/register', userData); // Use the correct endpoint
      set((state) => ({
        users: [...state.users, response.data.data], // Add the new user to the list
        isLoading: false,
      }));
      return response.data; // Return the response for further handling
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create user', isLoading: false });
    }
  },

  updateUser: async (userId, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/users/${userId}`, userData);
      return response.data; // Return the response for further handling
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update user', isLoading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete user', isLoading: false });
    }
  },
}));

export default useUserStore; 