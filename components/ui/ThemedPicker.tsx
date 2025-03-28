import { View, StyleSheet, ViewProps } from 'react-native';
import { Picker, type PickerItemProps, type PickerProps } from '@react-native-picker/picker';

import { useColorScheme } from '@/hooks/useColorScheme';
import { dark, light } from '@/constants/Colors';
import { ThemedText } from '../ThemedText';

type ExtendedPickerItemProps = PickerItemProps & {
    key : string,
}

type ThemedPickerProps = PickerProps & {
    items : ExtendedPickerItemProps[],
    label?: string,
    style? : ViewProps['style'],
};

export function ThemedPicker({items, style, label, itemStyle, ...otherProps}: ThemedPickerProps) {
    
    const themeColor = useColorScheme() || 'light';
    
    return (
        <View>
            {label && <ThemedText style={{marginBottom: 8}} type='label'>{label}</ThemedText>}
            <View style={[sTextInput[`picker_${themeColor}`], style]}>
                <Picker
                    dropdownIconColor={themeColor === 'light' ? light.text : dark.text}
                    style={[sTextInput[`picker_${themeColor}_item`]]}
                    itemStyle={[sTextInput[`picker_${themeColor}_item`], itemStyle ]}
                    {...otherProps}>
                    {items.map(({key, ...otherItemProps}) => <Picker.Item key={key} {...otherItemProps} />)}
                </Picker>
            </View>
        </View>
    );
}

const commonInput = {
    backgroundColor: light.formControl,
    borderColor: light.primary,
    borderWidth: 2,
    borderRadius: 4,
}

const commonText = {
    color: light.text,
    lineHeight: 20,
    fontSize: 15,
}

const sTextInput = StyleSheet.create({
    picker_light : {
        ...commonInput,
    },
    picker_light_item : {
        ...commonText,
    },
    picker_dark : {
        ...commonInput,
        backgroundColor: dark.formControl,
        borderColor: dark.primary,
    },
    picker_dark_item : {
        ...commonText,
        color: dark.text,
    }

});