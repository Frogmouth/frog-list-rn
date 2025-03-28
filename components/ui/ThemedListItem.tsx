import { Pressable, View, Text, type ViewProps, type TextProps, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useColorScheme } from "@/hooks/useColorScheme";
import { light, dark } from "@/constants/Colors";
import { useMemo } from "react";

type itemActions = (data:ThemedListItemprops['data']) => void;

type itemIcons = Array<keyof typeof Ionicons.glyphMap|null>;
type actionIcons = Array<itemActions|undefined>;

type ThemedListItemprops = ViewProps & {
    data: any,
    removed?: boolean,
    selected?: boolean,
    children?: TextProps['children'],
    onItemRemove?: itemActions;
    onItemRemoveBack?: itemActions;
    onItemSelect?: itemActions;
    onItemDeselect?: itemActions;
    selectIcon?: keyof typeof Ionicons.glyphMap,
    deselectIcon?: keyof typeof Ionicons.glyphMap,
    removeIcon?: keyof typeof Ionicons.glyphMap,
    removeBackIcon?: keyof typeof Ionicons.glyphMap,
}

export default function ThemedListItem({selectIcon, deselectIcon, removeIcon, removeBackIcon, children, style, data, removed, selected, onItemRemove, onItemRemoveBack, onItemSelect, onItemDeselect, ...otherProps}:ThemedListItemprops) {

    const themeColor = useColorScheme() || 'light';
    
    const iconsName = useMemo<itemIcons>(() => {
        if(!!removed) return [onItemRemoveBack ? removeBackIcon || 'arrow-undo-circle-outline' : null, null];
        if(!!selected) return [onItemDeselect ? deselectIcon || 'radio-button-on' : null, onItemRemove ? removeIcon || 'close-circle-outline' : null];
        return [onItemSelect ? selectIcon || 'radio-button-off' : null, onItemRemove ? removeIcon || 'close-circle-outline' : null]
    },[removed, selected]);

    const iconActions = useMemo<actionIcons>(() => {
        if(!!removed) return [onItemRemoveBack];
        if(!!selected) return [onItemDeselect, onItemRemove];
        return [onItemSelect,onItemRemove]
    }, [removed,selected]);

    const styleSuffix = useMemo<'removed' | 'selected' | undefined>(() => {
        if(!!removed) return 'removed';
        if(!!selected) return 'selected';
        return undefined;
    },[removed,selected]);

    return <View style={[staticStyles.wrapper, dynStyle[`wrapper_${themeColor}`], styleSuffix && dynStyle[`wrapper_${themeColor}_${styleSuffix}`], style]} {...otherProps}>
        {iconsName[0] && <Pressable onPress={() => iconActions[0] && iconActions[0](data) } style={[staticStyles.spacing]}>
            <Ionicons style={[dynStyle[`text_${themeColor}`]]} name={iconsName[0]} size={22} />
        </Pressable>}
        <Text style={[staticStyles.spacing, staticStyles.text, dynStyle[`text_${themeColor}`]]}>{children}</Text>
        {iconsName[1] && <Pressable onPress={() => iconActions[1] && iconActions[1](data) } style={[staticStyles.spacing, staticStyles.endPressable]}>
            <Ionicons style={[dynStyle[`text_${themeColor}`]]} name={iconsName[1]} size={22} />
        </Pressable>}
    </View>
}

const staticStyles = StyleSheet.create({
    wrapper: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
    },
    text: {
        flexGrow: 1,
        fontSize: 16,
    },
    spacing: {
        padding: 12,
    },
    endPressable : {
        borderRadius: 8,
    }
});

const dynStyle = StyleSheet.create({
    wrapper_light : {
        backgroundColor: 'rgb(212, 217, 244)',
    },
    wrapper_light_removed : {
        backgroundColor: 'rgb(221, 103, 132)',
    },
    wrapper_light_selected : {
        backgroundColor: 'rgb(120, 194, 120)',
    },
    wrapper_dark : {
        backgroundColor: 'rgb(23 27 41)',
    },
    wrapper_dark_removed : {
        backgroundColor: 'rgb(62, 32, 32)',
    },
    wrapper_dark_selected : {
        backgroundColor: 'rgb(49, 78, 68)',
    },
    text_light : {
        color: light.text
    },
    text_dark : {
        color: dark.text
    },
});