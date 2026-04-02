import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  },
  reducers: {
    setCart: (state, action) => {
      // Called when we fetch cart from backend
      const items = action.payload.items || [];
      state.items = items;
      state.totalAmount = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      state.totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    },
    clearCartState: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;