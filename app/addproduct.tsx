import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { categories } from '@/store';
import { createProduct } from '@/store/slice/products.slice';
import { fetchCategories } from '@/store/slice/categories.slice';
import { addProduct } from '@/store/slice/defaultList.slice';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { ThemedPicker } from '@/components/ui/ThemedPicker';
import { ThemedButton } from '@/components/ui/ThemedButton';

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
            <ThemedView style={s.inputWrapper}>
                <ThemedTextInput label="Nome" value={productName} onChangeText={(text) => setProductName(text)} />
            </ThemedView>
            <ThemedPicker
                label="Categoria"
                onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue as number)}
                items={prodcutCategories.map(category => ({
                    key: `${category.id}_picker`,
                    value: category.id,
                    label: category.name || `Categoria ${category.id}`,
                }))} />
            <ThemedButton onPress={() => submit()} type="primary">CREA</ThemedButton>
            <ThemedButton onPress={() => submit(true)} type="secondary">CREA & AGGIUNGI</ThemedButton>
        </ThemedView>)
}

const s = StyleSheet.create({
    stackContent: {paddingVertical:8, paddingHorizontal:16, gap:24},
    inputWrapper: {flexGrow:0},
});