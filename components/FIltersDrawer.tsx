import { Pressable, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { categories, productsFilters } from "@/store";
import { useEffect } from "react";
import { fetchCategories } from "@/store/slice/categories.slice";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { toggleFilterProduts, fetchProducts } from "@/store/slice/products.slice";
import { ThemedButton } from "./ui/ThemedButton";

type FiltersDrawerProps = {};

export default function FiltersDrawer(props:FiltersDrawerProps) {

    const dispatch = useAppDispatch();
    const allCategories = useAppSelector(categories);
    const appliedFilters = useAppSelector(productsFilters);

    const themeColor = useColorScheme() || 'light';

    useEffect(() => {
        if(allCategories.length < 1) dispatch(fetchCategories())
    });

    return <ThemedView darkColor="rgb(34, 34, 46)" style={{
        width: '100%',
        gap: 16,
    }}>
        <View style={{padding: 16, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <ThemedText type="subtitle">Filtri</ThemedText>
            <ThemedButton type="secondary" onPress={() => dispatch(fetchProducts({applyFilters: true}))}>Applica</ThemedButton>
        </View>
        <View style={{
            paddingHorizontal: 16,
            gap: 8
        }}>
            <ThemedText type="defaultSemiBold">Categorie</ThemedText>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
            }}>
                {allCategories.map((cat) => <Pressable onPress={() => dispatch(toggleFilterProduts({
                    term: 'category',
                    value: cat.id
                }))} key={`${cat.id}`} style={({pressed}) => ({
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: pressed || appliedFilters.find((filter) => filter.term === 'category' && filter.value === cat.id) ? Colors[themeColor].accent : 'rgba(150,150,150,.5)',
                    borderRadius: 8,
                })}><ThemedText>{cat.name}</ThemedText></Pressable>)}
            </View>
        </View>
    </ThemedView>;
}

