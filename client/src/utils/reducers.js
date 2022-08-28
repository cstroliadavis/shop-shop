import { useReducer } from 'react';
import {
  UPDATE_PRODUCTS,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  ADD_TO_CART,
  ADD_MULTIPLE_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  TOGGLE_CART,
} from './actions';

const actions = {
  default: (state) => state,
  [UPDATE_PRODUCTS]: (state, action) => ({ ...state, products: [ ...action.products ] }),
  [UPDATE_CATEGORIES]: (state, action) => ({ ...state, categories: [ ...action.categories ] }),
  [UPDATE_CURRENT_CATEGORY]: (state, action) => ({ ...state, currentCategory: action.currentCategory }),
  [ADD_TO_CART]: (state, action) => ({
    ...state,
    cartOpen: true,
    cart: [ ...state.cart, action.product ],
  }),
  [ADD_MULTIPLE_TO_CART]: (state, action) => ({ ...state, cart: [ ...state.cart, ...action.products ] }),
  [REMOVE_FROM_CART]: (state, action) => {
    let newState = state.cart.filter(product => product._id !== action._id);

    return {
      ...state,
      cartOpen: newState.length > 0,
      cart: newState,
    };
  },
  [UPDATE_CART_QUANTITY]: (state, action) => ({
    ...state,
    cartOpen: true,
    cart: state.cart.map(product => {
      const purchaseQuantity = action._id === product._id
        ? action.purchaseQuantity
        : product.purchaseQuantity;

      return { ...product, purchaseQuantity };
    }),
  }),
  [CLEAR_CART]: (state) => ({ ...state, cartOpen: false, cart: [] }),
  [TOGGLE_CART]: (state) => ({ ...state, cartOpen: !state.cartOpen }),
};

export const reducer = (state, action) => {
  const exec = actions[action.type] ?? actions.default;

  return exec(state, action);
};

export function useProductReducer(initialState) {
  return useReducer(reducer, initialState);
}
