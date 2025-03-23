import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput  } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { categories } from '@/store';
import { createProduct } from '@/store/slice/products.slice';
import { fetchCategories } from '@/store/slice/categories.slice';
import { addProduct } from '@/store/slice/defaultList.slice';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ProductsList() {

    const dispatch = useAppDispatch();
    const prodcutCategories = useAppSelector(categories);
    const params = useLocalSearchParams<{ name?: string }>();

    const [ selectedCategory, setSelectedCategory ] = useState<number>();
    const [ productName, setProductName] = useState<string>(params.name || '');

    const submit = useCallback((addAlso?:boolean) => {
        dispatch(createProduct({
            name: productName,
            category: selectedCategory,
        })).then((action) => {
            if(addAlso){
                const payload = action.payload as { id: number };
                dispatch(addProduct({productId: payload.id})).then(() => {
                    router.back();
                })
            }
        });
    }, [selectedCategory,productName]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    return(
        <ThemedView style={s.stackContent}>
            <ThemedText>Nome</ThemedText>
            <ThemedView style={s.inputWrapper}>
                <TextInput value={productName} onChangeText={(text) => setProductName(text)} style={s.textInput} />
            </ThemedView>
            <ThemedText>Categoria</ThemedText>
            <ThemedView style={s.inputWrapper}>
                <Picker
                    onValueChange={(itemValue:number, itemIndex) => setSelectedCategory(itemValue)}
                >
                    {prodcutCategories.map((category) => <Picker.Item key={`${category.id}_picker`} value={category.id} label={category.name || `Categoria ${category.id}`} />)}
                </Picker>
            </ThemedView>
            <Pressable onPress={() => submit()}><ThemedText>CREA</ThemedText></Pressable>
            <Pressable onPress={() => submit(true)}><ThemedText>CREA & AGGIUNGI</ThemedText></Pressable>
        </ThemedView>)
}

const s = StyleSheet.create({
    stackContent: {paddingVertical:8, paddingHorizontal:16, gap:8},
    inputWrapper: {backgroundColor: '#666', flexGrow:0},
    textInput: {color: 'white', padding:8}
});