import type { Action, ThunkAction } from '@reduxjs/toolkit'
import {configureStore} from '@reduxjs/toolkit'

import defaultListReducer from '@/store/slice/defaultList.slice';
import productsReducer from '@/store/slice/products.slice';
import categoriesReducer from './slice/categories.slice';

export const rootStore = configureStore({
    reducer: {
        defaultList: defaultListReducer,
        prdocuts: productsReducer,
        categories: categoriesReducer,
    },
  });

export type AppStore = typeof rootStore
export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

export const defaultListStatus = (state: RootState) => state.defaultList.status;
export const productsStatus = (state: RootState) => state.prdocuts.status;

export const defaultList = (state: RootState) => state.defaultList.list;
export const defaultItems = (state: RootState) => state.defaultList.items;
export const products = (state: RootState) => state.prdocuts;

export const prodcutSuggestions = (state: RootState) => state.prdocuts.suggestions;

export const categories = (state: RootState) => state.categories.categories;