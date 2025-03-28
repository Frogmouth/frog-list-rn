import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, Modal, Text } from 'react-native';
import { router } from 'expo-router';

import { defaultListStatus, defaultList, defaultItems } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createDefault, deleteDefault, fetchDefault, itemUpdate, prdocutListItem, toggleShopping } from '@/store/slice/defaultList.slice';
import { useColorScheme } from '@/hooks/useColorScheme';

//UI
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ui/ThemedButton';
import SearchSuggestions from '@/components/SearchSuggestions';
import ThemedListItem from '@/components/ui/ThemedListItem';
import { dark, light } from '@/constants/Colors';
import { ThemedLink } from '@/components/ThemedLink';

export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const listStatus = useAppSelector(defaultListStatus);
    const list = useAppSelector(defaultList);
    const items = useAppSelector(defaultItems);

    const themeColor = useColorScheme() || 'light';

    const [confirmationModalVisible, setConfirmationModalVisible ] = useState<boolean>(false);

    useEffect(() => {
        if(!listStatus) {
            dispatch(fetchDefault())
        }
    }, [listStatus, dispatch]);

    const applyItemUpdate = (eventType:'reset'|'pick'|'drop',item:prdocutListItem) => {
        dispatch(itemUpdate({
            id: item.id,
            data: {
                is_dropped: eventType === 'drop',
                is_picked: eventType === 'pick',
            }
        }));
    }
    
    return <ThemedView>
        <ThemedView style={{paddingVertical:8}}>            
            {!list ? 
                <View style={s.buttonsWrapper}>
                    <ThemedText type='title'>Ciao!</ThemedText>
                    <ThemedText type='subtitle'>{':_( non hai ancora una lista!'}</ThemedText>
                    <ThemedText type='label'>Cominciamo subito con il crearne una...</ThemedText>
                    <ThemedButton onPress={() => {
                        dispatch(createDefault())
                    }} icon='add-circle-outline'>Nuova Lista</ThemedButton>
                </View>
            : <>
                <View style={[s.topAddWrapper, {borderColor: themeColor === 'light' ? light.borderLight : dark.borderLight }]}>
                    <SearchSuggestions />
                    <ThemedButton onPress={() => {
                        router.navigate('/products');
                    }} icon={"albums-outline"} />
                </View>
                <FlatList 
                    style={{ zIndex: 0, elevation: 0, paddingHorizontal: 8 }}
                    ListEmptyComponent={<View style={{padding:24, gap: 8}}>
                            <ThemedText style={{textAlign:'center'}} type='subtitle'>oh NO!</ThemedText>
                            <ThemedText style={{textAlign:'center'}}>La lista è vuota, <ThemedLink icon='arrow-forward-outline' href="/products">Agguingi qualcosa</ThemedLink></ThemedText>
                        </View>}
                    data={items}
                    keyExtractor={(item) => item.id.toString() + item.updated_at?.toString()}
                    renderItem={({item}) => <ThemedListItem
                        data={item}
                        onItemSelect={() => applyItemUpdate('pick',item)}
                        onItemRemove={() => applyItemUpdate('drop',item)}
                        onItemDeselect={() => applyItemUpdate('reset',item)}
                        onItemRemoveBack={() => applyItemUpdate('reset',item)}
                        removed={item.is_dropped}
                        selected={item.is_picked}>{item.product.name}</ThemedListItem>}
                    />
                <View style={[s.bottomButtonWrapper, {borderColor: themeColor === 'light' ? light.borderLight : dark.borderLight }]}>
                    {list.is_shopping
                        ? <ThemedButton type="secondary" onPress={() => dispatch(toggleShopping({id: list.id, is_shopping: false}))} style={{flexGrow:1}} icon="bag-check-outline">Fine spesa</ThemedButton>
                        : <ThemedButton type="secondary" onPress={() => dispatch(toggleShopping({id: list.id, is_shopping: true}))} style={{flexGrow:4}} icon="cart">Inizia spesa</ThemedButton>}
                    {!list.is_shopping && <ThemedButton type="tertiary" onPress={() => setConfirmationModalVisible(true)} icon="trash-outline">Elimina</ThemedButton>}
                </View>
            </>}
        </ThemedView>
        <Modal animationType="slide" transparent={true} visible={confirmationModalVisible} onRequestClose={() => setConfirmationModalVisible(false)}>
            <View style={[s.modalContent, s[`modalContent_${themeColor}`]]}>
                <View>
                    <ThemedText style={{textAlign:'center'}}>Vuoi <Text style={{fontWeight: '800', textDecorationLine: 'underline' }}>Eliminare definitivamente</Text> questa lista?</ThemedText>
                    <ThemedText style={{textAlign:'center'}}>{list && 'Non potrai più recupeare i dati' || 'Nessuna lista selezionata...'}</ThemedText>
                </View>
                <View style={{flexDirection: 'row', gap:8}}>
                    <ThemedButton type="primary" disabled={!list} onPress={() => {
                        list && dispatch(deleteDefault({id: list.id})).then(() => setConfirmationModalVisible(false))
                        }} icon="trash-outline">Elimina</ThemedButton>
                    <ThemedButton type="secondary" onPress={() => setConfirmationModalVisible(false)}>Annulla</ThemedButton>
                </View>
            </View>
        </Modal>
    </ThemedView>
}

const s = StyleSheet.create({
    listHeaderWeapper: {
        paddingVertical:8, 
        marginBottom: 8, 
        borderBottomWidth: 1,
        borderBottomColor: '#444'
    },
    buttonsWrapper: {
        paddingHorizontal:32,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: 16,
    },
    bottomButtonWrapper: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 4,
        borderTopWidth: 1,
    },
    topAddWrapper: {
        zIndex: 1, 
        elevation: 1, 
        flexGrow:0, 
        paddingHorizontal: 8, 
        paddingBottom: 8, 
        paddingTop: 4, 
        flexDirection:'row', 
        alignItems: 'center',
        borderBottomWidth: 1,
        gap:4
    },
    modalContent: {
        height: 150,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 16,
    },
    modalContent_light : {
        backgroundColor: light.accent,
    },
    modalContent_dark : {
        backgroundColor: dark.accent,
    }
})