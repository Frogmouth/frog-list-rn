import { useEffect} from 'react';
import { FlatList, StyleSheet, View  } from 'react-native';
import { router } from 'expo-router';

import { products, defaultItems, productsIsFiltered, productsStatus } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slice/products.slice';
import { addProduct, itemUpdate } from '@/store/slice/defaultList.slice';

//UI
import { ThemedView } from '@/components/ThemedView';
import ThemedListItem from '@/components/ui/ThemedListItem';
import { ThemedButton, ThemedRoundedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ThemedText';


export default function ProductsList() {
    const dispatch = useAppDispatch();
    const listItems = useAppSelector(defaultItems);
    const productsData = useAppSelector(products);
    const isFilered = useAppSelector(productsIsFiltered);
    const status = useAppSelector(productsStatus);

    useEffect(() => {
        if(status === 0){
            console.log('request products');
            dispatch(fetchProducts({reset:true}))
        }
    }, [status]);

    return(
        <ThemedView style={s.componentWrapper}>
            <View style={{position: 'absolute', bottom: 30, right: 15, width:60, height:60, zIndex: 1, elevation:1}}>
                <ThemedRoundedButton onPress={() => {router.navigate('./addproduct')}} height={'100%'} width={'100%'} icon='add' />
            </View>
            {isFilered && <View style={{justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 8, paddingHorizontal: 8}}>
                <ThemedButton onPress={() => dispatch(fetchProducts({reset:true}))} icon="refresh-circle-outline">ELIMINA FILTRI</ThemedButton>
            </View>}
            <FlatList 
                style={{ zIndex: 0, elevation: 0, paddingHorizontal: 8 }}
                data={productsData.products}
                extraData={productsData}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => <ThemedText style={{padding: 24,textAlign: 'center'}}>{status > 1 ? 'Nessun risultato!' : 'Carico i prodotti...'}</ThemedText> }
                onEndReachedThreshold={.4}
                onEndReached={() => productsData.hasMore && dispatch(fetchProducts())}
                renderItem={({item}) => {
                    let listitem = listItems.find((listitem) => listitem.product.id === item.id)
                    return <ThemedListItem
                        data={item}
                        selectIcon="bag-add-outline"
                        deselectIcon="checkmark-circle-outline"
                        selected={!!listitem}
                        onItemDeselect={() => {
                            !!listitem && dispatch(itemUpdate({id:listitem.id, data: {
                                is_dropped : true,
                                is_picked : false,
                            }}))
                        }}
                        onItemSelect={() => {
                            dispatch(addProduct({productId: item.id}))}} >{item.name}</ThemedListItem>}
                    }
                />
        </ThemedView>)
}

const s = StyleSheet.create({
    componentWrapper: { paddingVertical:8 },
    countRow: {
        paddingBottom:8, marginBottom:8, borderBottomWidth:1, borderBottomColor: '#ccc', flexGrow:1
    }
});