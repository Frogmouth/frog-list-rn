import { useEffect} from 'react';
import { Pressable, StyleSheet, View  } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { router } from 'expo-router';

import { productsStatus, products, defaultListStatus } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slice/products.slice';

//UI
// import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addProduct } from '@/store/slice/defaultList.slice';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function ProductsList() {
    const dispatch = useAppDispatch();
    const listStatus = useAppSelector(defaultListStatus);
    const productsData = useAppSelector(products);

    useEffect(() => {
        dispatch(fetchProducts())
    }, []);

    return(
        <ThemedView style={s.componentWrapper}>
            <SwipeListView
                data={[...productsData.products]}
                keyExtractor={( {id}:any ) => id.toString()}
                renderItem={ ({item}:any ) => (
                    <ThemedView>
                        <ThemedText>{item.name}</ThemedText>
                    </ThemedView>
                )}
                renderHiddenItem={ () => (
                    <ThemedView style={{flexDirection:'row', justifyContent: 'space-between', height:32}}>
                        <ThemedText style={{backgroundColor: 'green', color: 'white', flexGrow:1}}>ALLA LISTA</ThemedText>
                        <ThemedText style={{backgroundColor: 'red', color: 'white', flexGrow:1, textAlign: 'right'}}>ELIMINA</ThemedText>
                    </ThemedView> )
                }
                rightActivationValue={-60}
                leftActivationValue={60}
                stopRightSwipe={-90}
                stopLeftSwipe={90}
                closeOnScroll={true}
                onLeftAction={(key:string) => {
                    if(listStatus === 2) dispatch(addProduct({productId: parseInt(key)}))
                }}
            />
            <View style={{position: 'fixed', bottom: 20, right:20,}}>
                <Pressable onPress={() => router.navigate('/addproduct')}>
                    <ThemedView darkColor='#666' style={{borderRadius:'50%', padding:6}}>
                        <Ionicons color={'white'} name='add' size={32}/>
                    </ThemedView>
                </Pressable>
            </View>
        </ThemedView>)
}

const s = StyleSheet.create({
    componentWrapper: {paddingVertical:8, paddingHorizontal:16},
    countRow: {
        paddingBottom:8, marginBottom:8, borderBottomWidth:1, borderBottomColor: '#ccc', flexGrow:1
    }
});