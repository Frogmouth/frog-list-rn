import type { Tables, TablesUpdate } from '@/types/database.types';
import { createAppAsyncThunk } from '@/store/thunkTyped';

import { createSlice, isAllOf, isAsyncThunkAction, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'

import supabase from '@/store/supabase';
import { showMessage } from 'react-native-flash-message';

export interface prdocutListItem extends Omit<Tables<'list_items'>, 'product'> {
    product: Tables<'products'>,
    key: string,
}

export interface DefaultListState {
    list : null | Tables<'lists'>,
    items : prdocutListItem[],
    status : 0 | 1 | 2 | 3,
    error?: string,
}

const initialState:DefaultListState = {
    list: null,
    items: [],
    status: 0,
    error: undefined,
}

export const fetchDefault = createAppAsyncThunk(
    'defaultList/fetchDefault',
    async () => {
        
        try {
            const { data, error } = await supabase.from('lists')
            .select('*, list_items (*, products (id, name) )')
            .is('is_deleted', false)
            .is('is_default', true);

            if(error) throw error.message;

            const list = data[0] as any;
            const list_items = [...list.list_items];
            delete list.list_items;
            return { list, list_items };
            
        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
)

export const createDefault = createAppAsyncThunk(
    'defaultList/createDefault',
    async () => {
        
        try {
            const { data:lists, error } = await supabase.from('lists')
            .insert({
                is_default: true
            })
            .select();
            
            if(error) throw error.message;
            
            return lists?.[0] || null;
            
        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
)

export const toggleShopping = createAppAsyncThunk(
    'defaultList/toggleShopping',
    async (args: {id: number, is_shopping: boolean}) => {
        
        try {
            const { data:lists, error } = await supabase.from('lists')
            .update({
                is_shopping: !!args.is_shopping,
                closed_at: !args.is_shopping && new Date().toISOString() || null,
            })
            .eq('id', args.id)
            .select();
            
            if(error) throw error.message;
            
            return lists?.[0] || null;
            
        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
)

export const deleteDefault = createAppAsyncThunk(
    'defaultList/deleteDefault',
    async (args: {id: number}) => {
        
        try {
            const { error } = await supabase.from('lists')
            .delete()
            .eq('id', args.id);
            
            if(error) throw error.message;
            
            return true;
            
        } catch (e) {
            throw 'Errore nella cacenllazione della lista di default';
        }
    }
)

// items actions

export const addProduct = createAppAsyncThunk(
    'defaultList/addProduct',
    async (args: {productId:number}, {getState}) => {
        const state = getState();
        const listId = state.defaultList.list?.id;

        if(!listId) throw "Missing default list";

        try {
            const { data:list_items, error } = await supabase.from('list_items')
            .insert({
                list: listId,
                product: args.productId
            }).select('*, products (id, name) )');
            
            if(error) throw error.message;
            
            return list_items?.[0] || null;
            
        } catch (e) {
            throw 'Error occurred on fatching default list';
        }
    }
)

export const itemUpdate = createAppAsyncThunk(
    'defaultList/itemUpdate',
    async (args:{id:number, data:TablesUpdate<'list_items'>},{getState, dispatch}) => {
        try {
            const defaultList = getState().defaultList.list;
            if(args.data.is_dropped && !defaultList?.is_shopping) {
                dispatch(itemRemove({id: args.id}))
                return null;
            }
            const { data:list_items, error } = await supabase.from('list_items')
              .update(args.data)
              .eq('id', args.id)
              .select();
  
            if(error) throw error.message;

            return list_items?.[0];
            
        } catch (e) {
            throw 'Errore nel aggiornamento del elemento';
        }
    }
)

export const itemRemove = createAppAsyncThunk(
    'defaultList/itemRemove',
    async (args:{id:number}) => {
        try {
            const { data:list_items, error } = await supabase.from('list_items')
              .delete()
              .eq('id', args.id)
              .select();
  
            if(error) throw error.message;

            return args.id;
            
        } catch (e) {
            throw 'Errore nella rimozione del elemento';
        }
    }
)

const listItemsFactory = function(item:any) {
    const { products } = item;
    if(!!products) {
        item.product = products;
        delete item.produts;
    }
    item.key = `${item.id}_${item.updated_at || 'init'}`;
    return {...item} as prdocutListItem;
}

export const defaultListSlice = createSlice({
    name: 'defaultList',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDefault.fulfilled, (state, action) => {
                const {list_items, list} = action.payload;
                state.items = list_items.map((item:any) => listItemsFactory(item)) as any[];
                state.list = list;
                state.status = 2;
            })
            .addCase(fetchDefault.pending, (state) => {
                state.status = 1;
            })
            .addCase(fetchDefault.rejected, (state) => {
                state.status = 3;
            })
            .addCase(deleteDefault.fulfilled, (state) => {
                state.list = initialState.list;
                state.items = [];
                state.status = 0;
                showMessage({
                    message: "Lista Eliminata",
                    type: "warning",
                });
            })
            .addCase(createDefault.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(toggleShopping.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.items = [...state.items,listItemsFactory(action.payload) as any]
                showMessage({
                    message: "Prodotto aggiunto",
                    type: "success",
                });
            })
            .addCase(itemRemove.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                showMessage({
                    message: "Prodotto Rimosso",
                    type: "success",
                });
            })
            .addCase(itemUpdate.fulfilled, (state, {payload, meta}) => {
                if(payload) {
                    state.items = state.items.map((item:any) => {
                        if(meta.arg.id === item.id) {
                            let { product, ...newItem} = payload;
                            newItem = listItemsFactory(newItem);
                            return {...item, ...(newItem as any) };
                        }
                        return item;
                    }) as any[];
                    showMessage({
                        message: "Elemento aggiornato!",
                        type: "success",
                    });
                }
            })
            .addMatcher(
                isAllOf(isRejected,isAsyncThunkAction),
                (state, action) => {
                    state.error = action.error.message;
                    action.error.message && showMessage({
                        message: action.error.message,
                        type: "danger",
                    });
                }
            )
    }
});

// Export the generated action creators for use in components
// export const {} = defaultListSlice.actions

// Export the slice reducer for use in the store configuration
export default defaultListSlice.reducer