import { useEffect} from 'react';
import { FlatList, StyleSheet, View  } from 'react-native';
import { router } from 'expo-router';

import { products, defaultItems } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slice/products.slice';

//UI
import { ThemedView } from '@/components/ThemedView';
import { addProduct, itemUpdate } from '@/store/slice/defaultList.slice';
import ThemedListItem from '@/components/ui/ThemedListItem';
import { ThemedRoundedButton } from '@/components/ui/ThemedButton';


export default function ProductsList() {
    const dispatch = useAppDispatch();
    const listItems = useAppSelector(defaultItems);
    const productsData = useAppSelector(products);

    useEffect(() => {
        productsData.products.length < 1 && dispatch(fetchProducts())
    }, []);

    return(
        <ThemedView style={s.componentWrapper}>
            <View style={{position: 'absolute', bottom: 30, right: 15, width:60, height:60, zIndex: 1, elevation:1}}>
                <ThemedRoundedButton onPress={() => {router.navigate('./addproduct')}} height={'100%'} width={'100%'} icon='add' />
            </View>
            <FlatList 
                style={{ zIndex: 0, elevation: 0, paddingHorizontal: 8 }}
                data={productsData.products}
                extraData={listItems}
                keyExtractor={(item) => item.id.toString()}
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