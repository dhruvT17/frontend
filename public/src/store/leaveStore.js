import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// Async thunks for API calls
export const fetchLeaves = createAsyncThunk(
  'leaves/fetchLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('leaves');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaves');
    }
  }
);

export const createLeave = createAsyncThunk(
  'leaves/createLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axios.post('leaves', leaveData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create leave request');
    }
  }
);

export const updateLeave = createAsyncThunk(
  'leaves/updateLeave',
  async ({ id, leaveData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`leaves/${id}`, leaveData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update leave request');
    }
  }
);

export const deleteLeave = createAsyncThunk(
  'leaves/deleteLeave',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`leaves/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete leave request');
    }
  }
);

export const fetchLeaveById = createAsyncThunk(
  'leaves/fetchLeaveById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`leaves/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave details');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    leaves: [],
    currentLeave: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentLeave: (state, action) => {
      state.currentLeave = action.payload;
    },
    clearCurrentLeave: (state) => {
      state.currentLeave = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leaves
      .addCase(fetchLeaves.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.leaves = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create leave
      .addCase(createLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.leaves.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update leave
      .addCase(updateLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        const index = state.leaves.findIndex(leave => leave._id === action.payload._id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete leave
      .addCase(deleteLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.leaves = state.leaves.filter(leave => leave._id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch leave by ID
      .addCase(fetchLeaveById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveById.fulfilled, (state, action) => {
        state.currentLeave = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLeaveById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentLeave, clearCurrentLeave } = leaveSlice.actions;
export default leaveSlice.reducer;