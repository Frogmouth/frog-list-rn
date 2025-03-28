import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';

import { prodcutSuggestions } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addProduct } from '@/store/slice/defaultList.slice';
import { clearSuggestions, suggestedProducts } from '@/store/slice/products.slice';
import { debounce } from '@/store/utils';

import ButtonAddProduct from '@/components/ui/ButtonAddProduct';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { ThemedTextInput } from './ui/ThemedTextInput';

const debounced = debounce((arg:any, dispatch:any) => dispatch(suggestedProducts(arg)), 1500);
const debouncedSuggestedProducts = (arg:any) => (dispatch:any) => debounced.exec(arg, dispatch)

export default function SearchSuggestions() {
    
    const dispatch = useAppDispatch();
    const suggestions = useAppSelector(prodcutSuggestions);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState<string>('');

    const performSearch = useCallback((query:string) => {
        setSearchQuery(query);
        if(query.length > 1) {
            dispatch(debouncedSuggestedProducts({
                query: query
            }));
        } else {
            debounced.abort();
            if(suggestions) {
                dispatch(clearSuggestions())
            };
        }
    }, [suggestions]);

    return <View style={{flexGrow:1}}>
        {suggestions && <Pressable onPressIn={() => dispatch(clearSuggestions())} style={s.awayClicker}><></></Pressable>}
        <View style={s.componentWrapper}>
            <View style={[s.searchWrapper, suggestions ? s.active : s.quiet]}>
                <ThemedTextInput
                    placeholder='Aggiungi prodotti...'
                    value={searchQuery} 
                    onChangeText={(query) => performSearch(query)} />
            </View>
            {suggestions && <ThemedView darkColor='#333' style={s.suggestionsWrapper}>
                <FlatList
                    ListEmptyComponent={<ThemedView darkColor='#444' style={s.nosuggestion}>
                            <ThemedText>Nessun prodotto trovato</ThemedText>
                            <ButtonAddProduct onPress={() => {
                                dispatch(clearSuggestions())
                                setSearchQuery('');
                                router.navigate( {
                                    pathname: '/addproduct',
                                    params: { name: searchQuery }
                                })
                            }} />
                        </ThemedView>}
                    data={suggestions}
                    renderItem={({item}) => <Pressable onPress={() => {
                        dispatch(addProduct({
                            productId: item.id,
                        }))
                    }}>
                        <ThemedView darkColor='#444' style={s.suggestion}><ThemedText>{item.name}</ThemedText></ThemedView>
                    </Pressable>} />
            </ThemedView>}
        </View>
    </View>
    ;
}


const s = StyleSheet.create({
    componentWrapper: {flexGrow:1, position:'relative', zIndex:2, elevation: 1},
    searchWrapper : {flexDirection:'row', alignItems: 'center',borderTopStartRadius: 5, },
    active: { borderBottomStartRadius: 0 },
    quiet: { borderBottomStartRadius: 5 },
    
    suggestionsWrapper : {position:'absolute', top:'100%',width:'100%', padding:8, borderBottomStartRadius: 5, borderBottomEndRadius: 5},
    suggestion: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, },
    nosuggestion: { padding: 8, },
    awayClicker: {position: 'fixed', top:0, left:0, bottom: 0, right:0, zIndex:1, elevation:1, opacity:.4, backgroundColor:'#000'}
});