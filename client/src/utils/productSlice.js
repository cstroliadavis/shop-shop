import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: '',
  products: [],
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateProducts: (state, action) => ({ ...state, products: [ ...action.payload ] }),
    updateCategories: (state, action) => ({ ...state, categories: [ ...action.payload ] }),
    updateCurrentCategory: (state, action) => ({ ...state, currentCategory: action.payload }),
    addToCart: (state, action) => ({
      ...state,
      cartOpen: true,
      cart: [ ...state.cart, action.payload ],
    }),
    addMultipleToCart: (state, action) => ({ ...state, cart: [ ...state.cart, ...action.payload ] }),
    removeFromCart: (state, action) => {
      let newState = state.cart.filter(product => product._id !== action.payload);

      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState,
      };
    },
    updateCartQuantity: (state, action) => ({
      ...state,
      cartOpen: true,
      cart: state.cart.map(product => {
        const purchaseQuantity = action.payload._id === product._id
          ? action.payload.purchaseQuantity
          : product.purchaseQuantity;

        return { ...product, purchaseQuantity };
      }),
    }),
    clearCart: (state) => ({ ...state, cartOpen: false, cart: [] }),
    toggleCart: (state) => ({ ...state, cartOpen: !state.cartOpen }),
  },
});

export const {
  updateProducts,
  updateCategories,
  updateCurrentCategory,
  addToCart,
  addMultipleToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  toggleCart,
} = productSlice.actions;

export const checkCartOpen = (state) => state.product.cartOpen;
export const getCart = (state) => state.product.cart;
export const getCategoriesList = (state) => state.product.categories;
export const getCurrentCategory = (state) => state.product.currentCategory;
export const getProductsList = (state) => state.product.products;

export default productSlice.reducer;
