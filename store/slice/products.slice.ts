import type { Tables, TablesInsert } from '@/types/database.types';
import { createAppAsyncThunk } from '@/store/thunkTyped';

import { createSlice, isAllOf, isAsyncThunkAction, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'

import supabase, { performNameSearch } from '@/store/supabase';
import { showMessage } from 'react-native-flash-message';

type productFilter = {
  term: keyof Tables<'products'>,
  value: any,
}
export interface ProductsState {
    products : Tables<'products'>[],
    status : 0 | 1 | 2 | 3,
    hasMore: boolean,
    count: number,
    error?: string,
    suggestions? : Tables<'products'>[],
    filters: productFilter[],
}

const initialState:ProductsState = {
    products: [],
    suggestions: undefined,
    hasMore: true,
    status: 0,
    count: 0,
    error: undefined,
    filters: [],
}

export const fetchProducts = createAppAsyncThunk(
    'products/fetchProducts',
    async (args:undefined|{
      applyFilters?: boolean
    }, {getState}) => {
        try {
            let currentIndex = 0
            let to = 39;
            let applyFilters = !!args?.applyFilters;
            if(applyFilters) {
              if(!args?.applyFilters && !getState().prdocuts.hasMore) throw 'Tutti i prodotti sono stati mostrati.'
              currentIndex = getState().prdocuts.products.length;
              to += currentIndex;
            }
            
            let partial = supabase.from('products')
              .select('*', { count: 'exact'})
              .order('name')
            
            if(applyFilters) {
              getState().prdocuts.filters.forEach((filter) => {
                partial.eq(filter.term, filter.value)
              })
            }

            const { data:products, count, error } = await partial.range(currentIndex, to);

            if(error) throw error.message;
            
            return { products, count, applyFilters};

        } catch (e) {
            throw 'Errore durante il recupero dei prodotti';
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
      },
      toggleFilterProduts: (state, {payload}) => {
        if(!!state.filters.find((filter) => filter.term === payload.term && filter.value === filter.value)) {
          state.filters = state.filters.filter((filter) => filter.term !== payload.term && filter.value !== filter.value)
        } else {
          state.filters = [...state.filters, payload];
        }
      }
    },
    extraReducers: builder => {
        builder
          .addCase(fetchProducts.fulfilled, (state, action) => {
            if(action.payload.applyFilters) {
              state.products = action.payload?.products || [];
            } else {
              state.filters = [];
              state.products = [...state.products, ...action.payload?.products];
            } 
            state.count = action.payload?.count || 0;
            state.hasMore = state.products.length < state.count;
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
export const { clearSuggestions, toggleFilterProduts } = productsReducer.actions

// Export the slice reducer for use in the store configuration
export default productsReducer.reducer