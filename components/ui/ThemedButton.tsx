import { Pressable, View, Text, type ViewProps, type PressableProps, StyleSheet } from 'react-native';

import { useThemeStyle } from '@/hooks/useThemeStyle';

const dark = StyleSheet.create({
    button: {
        
    },
    text: {},
    pressable: {}
})

const light = dark;

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  children: ViewProps['children'],
  style: Partial<Record<keyof typeof dark, any>> | Partial<Record<keyof typeof light, any>>;
};

export function ThemedButton({ lightColor, darkColor, children, style, ...otherProps }: ThemedButtonProps) {
  const themedStyle = useThemeStyle({ light: light, dark: dark });

    return (
        <Pressable style={[{ flexGrow: 1, flexShrink: 1, flexBasis: 'auto' }, style.pressable]} {...otherProps}>
            <View style={[themedStyle.button, style.button]}>
                <Text style={[themedStyle.text, style.text]}>{children}</Text>
            </View>
        </Pressable>
    );
}