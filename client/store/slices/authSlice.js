import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    role: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, _id, name, email, role } = action.payload;
      state.token = token;
      state.role = role;
      state.user = { _id, name, email, role };
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ _id, name, email, role }));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    // New action — load from localStorage on client mount
    loadFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
          const parsed = JSON.parse(user);
          state.token = token;
          state.user = parsed;
          state.role = parsed.role;
        }
      }
    },
  },
});

export const { setCredentials, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;