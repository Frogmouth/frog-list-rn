import { type TextInputProps, StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { dark, light } from '@/constants/Colors';

import { ThemedText } from '../ThemedText';

export type ThemedButtonProps = TextInputProps & {
    label?:string,
};

export function ThemedTextInput({ style, label, onFocus, onBlur, ...otherProps }: ThemedButtonProps) {
    
    const themeColor = useColorScheme() || 'light';

    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <View style={{flexGrow:1}}>
            {label && <ThemedText style={{marginBottom: 8}} type='label'>{label}</ThemedText>}
            <TextInput onFocus={(e) => {
                onFocus && onFocus(e);
                setIsFocused(true);
            }}
            onBlur={(e) => {
                onBlur && onBlur(e);
                setIsFocused(false);
            }} 
            style={[sTextInput[`input_${themeColor}`], isFocused && sTextInput[`focused_${themeColor}`] ,style]} {...otherProps} />
        </View>
    );
}

const commonInput = {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    flexGrow: 1,
    minHeight: 38,
}

const commonText = {
    color: light.text,
    backgroundColor: light.formControl,
    borderColor: light.primary,
    lineHeight: 20,
    fontSize: 15,
}

const commonFocused = {
    borderColor: light.formControlFocused,
    outlineWidth: 0,
}

const sTextInput = StyleSheet.create({
    input_light : {
        ...commonText,
        ...commonInput,
    },
    focused_light: commonFocused,
    input_dark : {
        ...commonText,
        ...commonInput,
        color: dark.text,
        backgroundColor: dark.formControl,
        borderColor: dark.primary,
    },
    focused_dark: {
        ...commonFocused,
        borderColor: dark.formControlFocused,
    },
});