import { useReducer } from 'react';
import {
  UPDATE_PRODUCTS,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "./actions";

export const reducer = (state, action) => {
  const defaultAction = () => state;
  const actions = {
    [UPDATE_PRODUCTS]: () => ({ ...state, products: [ ...action.products ] }),
    [UPDATE_CATEGORIES]: () => ({ ...state, categories: [ ...action.categories ] }),
    [UPDATE_CURRENT_CATEGORY]: () => ({ ...state, currentCategory: action.currentCategory }),
  };
  const exec = actions[action.type] ?? defaultAction;

  return exec();
};

export function useProductReducer(initialState) {
  return useReducer(reducer, initialState);
}
