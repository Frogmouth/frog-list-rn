import { useMemo } from 'react';
import type { PressableProps, TextProps, DimensionValue, TextStyle, ViewStyle } from 'react-native';
import { Pressable, View, Text, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { dark, light } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';


export type ThemedButtonProps = PressableProps & {
    children? : TextProps['children'],
    type?: 'primary' | 'secondary' | 'tertiary',
    icon?: keyof typeof Ionicons.glyphMap,
};

export function ThemedButton({ type, children, icon, ...otherProps }: ThemedButtonProps) {
    
    const themeColor = useColorScheme() || 'light';

    const styleType = useMemo<keyof typeof sText>(() => `${(type || 'primary')}_${themeColor}`, [themeColor]);
    
    return (
        <Pressable style={[{ flexGrow: 0 }]} {...otherProps}>
            {({ pressed }) => 
                (<View style={[sButton[styleType], pressed && sButton.pressed]}>
                    {icon && <Ionicons style={[sText[styleType], {fontSize: 23}]} color={sText[styleType].color} name={icon} />}
                    {children && <Text style={sText[styleType]}>{children}</Text>}
                </View>)
            }
        </Pressable>
    );
}

export type ThemedRoundedButtonProps = ThemedButtonProps & {
    width: DimensionValue,
    height: DimensionValue,
};

export function ThemedRoundedButton({ type, children, icon, style, width, height, ...otherProps }: ThemedRoundedButtonProps) {
    
    const themeColor = useColorScheme() || 'light';

    const styleType = useMemo<keyof typeof sText>(() => `${(type || 'primary')}_${themeColor}`, [themeColor]);
    
    return (
        <Pressable style={[{flexGrow:0, width: width, height: height}]} {...otherProps}>
            {({ pressed }) => 
                (<View style={[sButton[styleType], { width: width, height: height, padding:0, borderRadius:'50%', justifyContent: 'center', alignItems:'center'}, pressed && sButton.pressed]}>
                    {icon && <Ionicons style={[sText[styleType], {lineHeight: 42, fontSize: 42}]} name={icon} />}
                </View>)
            }
        </Pressable>
    );
}

const commonButton = {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
} as ViewStyle;

const commonText = {
    color: light.text,
    lineHeight: 20,
    fontSize: 16,
    textAlign: 'center',
} as TextStyle;

const sText = StyleSheet.create({
    primary_light : {
        ...commonText,
        color: light.textInverted,
    },
    primary_dark : {
        ...commonText,
        color: dark.text,
    },
    secondary_light : commonText,
    secondary_dark : {
        ...commonText,
        color: dark.text,
    },
    tertiary_light : {
        ...commonText,
        color: light.primary,
    },
    tertiary_dark : {
        ...commonText,
        color: dark.primary,
    }
});

const sButton = StyleSheet.create({
    pressed : {
        opacity: .5,
    },
    primary_light : {
        backgroundColor: light.primary,
        borderColor: light.primary,
        ...commonButton,
    },
    primary_dark : {
        backgroundColor: dark.primary,
        borderColor: dark.primary,
        ...commonButton,
    },
    secondary_light : {
        backgroundColor: light.secondary,
        borderColor: light.secondary,
        ...commonButton,
    },
    secondary_dark : {
        backgroundColor: dark.secondary,
        borderColor: dark.secondary,
        ...commonButton,
    },
    tertiary_light : {
        backgroundColor: 'transparent',
        borderColor: light.primary,
        ...commonButton,
    },
    tertiary_dark : {
        backgroundColor: 'transparent',
        borderColor: dark.primary,
        ...commonButton,
    },
});