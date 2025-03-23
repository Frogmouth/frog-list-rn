import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { defaultListStatus, defaultList, defaultItems } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createDefault, fetchDefault, itemUpdate } from '@/store/slice/defaultList.slice';
//UI
import Ionicons from '@expo/vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchSuggestions from '@/components/SearchSuggestions';

const chooseItemColorScheme = (is_dropped: boolean, is_picked:boolean) => {
    if(is_dropped) return s.dropped;
    if(is_picked) return s.picked;
    return undefined;
}

const ToProductButton = () => (
    <Pressable onPress={() => {
        router.navigate('/products');
    }}>
        <ThemedView style={{paddingHorizontal: 16, paddingVertical: 8, borderRadius: 5}} darkColor='#333' lightColor='#f1f1f1'>
            <ThemedText type='cta' style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <Ionicons name="list-circle" size={20} />
            </ThemedText>
        </ThemedView>
    </Pressable>
)


export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const listStatus = useAppSelector(defaultListStatus);
    const list = useAppSelector(defaultList);
    const items = useAppSelector(defaultItems);

    useEffect(() => {
        if(!listStatus) {
            dispatch(fetchDefault())
        }
    }, [listStatus, dispatch]);

    const sectionedItems = useMemo(() => {
        let sections = [{
            title: 'Lista',
            data: [],
        },{
            title: 'Carrello',
            data: [],
        },{
            title: 'Rimossi',
            data: [],
        }] as {title: string, data: typeof items}[];
        items.forEach((item) => {
            let index = 0;
            if(item.is_picked) index = 1;  
            if(item.is_dropped) index = 2
            sections[index].data.push(item);
        })
        return sections;
    }, [items]);

    const NewListButton = () => (
        <Pressable onPress={() => {
            dispatch(createDefault())
        }}><ThemedText>{'Nuova Lista'}</ThemedText></Pressable>
    )

    return <ThemedView>
        <ThemedView style={{paddingVertical:8, paddingHorizontal:16}}>
            <View style={{zIndex: 1, elevation: 1, marginVertical:8, flexGrow:0}}>
                {list ? <View style={{flexDirection:'row', alignItems: 'center', gap:4}}>
                    <SearchSuggestions />
                    <ToProductButton/>
                </View> : 
                <View style={s.buttonsWrapper}>
                    <ThemedText>Crea una nuova lista</ThemedText>
                    <NewListButton/>
                </View>}
            </View>
            <SwipeListView
                style={{zIndex: 0, elevation: 0}}
                sections={sectionedItems}
                useSectionList
                keyExtractor={(item) => `${item.id}_${item.updated_at}` }
                renderItem={({item}) => 
                    (<ThemedView>
                        <ThemedText style={chooseItemColorScheme(item.is_dropped, item.is_picked)}>{item.product.name}</ThemedText>
                    </ThemedView>)
                }
                renderHiddenItem={ () => (
                    <ThemedView style={{flexDirection:'row', justifyContent: 'space-between', height:32}}>
                        <ThemedText style={{backgroundColor: 'green', color: 'white', flexGrow:1}}>CARRELLO</ThemedText>
                        <ThemedText style={{backgroundColor: 'red', color: 'white', flexGrow:1, textAlign: 'right'}}>RIMUOVI</ThemedText>
                    </ThemedView> )
                }
                renderSectionHeader={({section}) => <ThemedView style={s.listHeaderWeapper}><ThemedText>{section.title}</ThemedText></ThemedView>}
                rightActivationValue={-90}
                leftActivationValue={-90}
                stopRightSwipe={-150}
                stopLeftSwipe={150}
                onLeftAction={function (key, rowMap){
                    let item = rowMap[key]?.props.item;
                    item && dispatch(itemUpdate({
                        id: item.id,
                        data:{
                            is_picked: true,
                            is_dropped: false,
                        }
                    }))
                }}
                onRightAction={function (key, rowMap){
                    let item = rowMap[key].props.item;
                    item && dispatch(itemUpdate({
                        id: item.id,
                        data: {
                            is_dropped: true,
                            is_picked: false,
                        }
                    }))
                }}
            />
        </ThemedView>
    </ThemedView>
}

const s = StyleSheet.create({
    listHeaderWeapper: {paddingVertical:8, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#444'},
    dropped : {color: 'red'},
    picked : {color: 'green'},
    buttonsWrapper: {
        maxWidth: 240,
        alignSelf: 'center',
    }
})