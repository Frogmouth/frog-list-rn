import type { Tables, TablesInsert } from '@/types/database.types';
import { createAppAsyncThunk } from '@/store/thunkTyped';

import { createSlice, isAllOf, isAsyncThunkAction, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'

import supabase, { performNameSearch } from '@/store/supabase';
import { showMessage } from 'react-native-flash-message';

export interface ProductsState {
    products : Tables<'products'>[],
    status : 0 | 1 | 2 | 3,
    count: number,
    error?: string,
    suggestions? : Tables<'products'>[],
}

const initialState:ProductsState = {
    products: [],
    suggestions: undefined,
    status: 0,
    count: 0,
    error: undefined,
}

export const fetchProducts = createAppAsyncThunk(
    'products/fetchProducts',
    async (args?:{start?:number,perPage?:number}) => {
        try {
            args = args || {};
            const {start, perPage} = args;
            const { data:products, count, error } = await supabase.from('products')
              .select('*', { count: 'exact'})
              .range(0,( (start || 1) + 1) * (perPage || 20))

            if(error) throw error.message;
            
            return {products, count};

        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
  )

export const suggestedProducts = createAppAsyncThunk(
    'products/suggestedProducts',
    async (args:{query:string, limit?:number}) => {
        try {
            console.log('querying', args);
            const { data, error } = await performNameSearch(args.query, 'products', '*', args.limit);
            
            if(error) throw error.message;
            
            return data as Tables<'products'>[];

        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
  )

export const createProduct = createAppAsyncThunk(
    'products/createProduct',
    async (args:TablesInsert<'products'>) => {

        try {
            const { data:products, error } = await supabase.from('products')
              .insert(args)
              .select('*');

            if(error) throw error.message;
            
            return products?.[0] || null;

        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
  )

export const productsReducer = createSlice({
    name: 'products',
    initialState,
    reducers: {
      clearSuggestions: (state) => {
        state.suggestions = undefined;
      }
    },
    extraReducers: builder => {
        builder
          .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 2
            state.products = action.payload?.products || [];
            state.count = action.payload?.count || 0;
          })
          .addCase(createProduct.fulfilled, (state, action) => {
            state.products.push(action.payload)
            state.count = state.count + 1;
          })
          .addCase(suggestedProducts.fulfilled, (state, action) => {
            state.suggestions = action.payload;
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
export const { clearSuggestions } = productsReducer.actions

// Export the slice reducer for use in the store configuration
export default productsReducer.reducer