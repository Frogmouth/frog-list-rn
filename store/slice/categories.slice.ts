import type { Tables } from '@/types/database.types';

import { createSlice, isAllOf, isAsyncThunkAction, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '@/store/thunkTyped';

import supabase from '../supabase';

import { showMessage } from 'react-native-flash-message';

export interface categoriesState {
    categories : Tables<'categories'>[],
    status : 0 | 1 | 2 | 3,
    error?: string,
}

const initialState:categoriesState = {
    categories: [],
    status: 0,
    error: undefined,
}

export const fetchCategories = createAppAsyncThunk(
    'categories/fetchCategories',
    async () => {
        try {
            const { data:categories, error } = await supabase.from('categories').select('*');

            if(error) throw error.message;
            
            return {categories};

        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
  )


export const categoriesReducer = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
          .addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload?.categories || [];
          })
          .addMatcher(
            isAllOf(isPending, isAsyncThunkAction),
            (state) => {
                state.status = 1
            }
          )
          .addMatcher(
              isAllOf(isFulfilled, isAsyncThunkAction),
              (state) => {
                  state.status = 2
              }
          )
          .addMatcher(
              isAllOf(isRejected,isAsyncThunkAction),
              (state, action) => {
                  state.status = 3
                  state.error = action.error.message;
                  if(action.error.message)
                  showMessage({
                    message: action.error.message,
                    type: 'danger',
                  });
              }
          )
      }
});

// Export the generated action creators for use in components
// export const {  } = categoriesReducer.actions

// Export the slice reducer for use in the store configuration
export default categoriesReducer.reducer