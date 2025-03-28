import { StyleSheet, Text } from 'react-native';
import { Link, type LinkProps } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export type ThemedLinkProps = LinkProps & {
    icon?: keyof typeof Ionicons.glyphMap,
    iconPosition?: 'before' | 'after',
};

export function ThemedLink({style, iconPosition, icon, children, ...otherProps}: ThemedLinkProps) {
    const themeColor = useColorScheme() || 'light';

  return <Link numberOfLines={icon && 1} style={[{ color: Colors[themeColor].accent }, style]} {...otherProps}>
    {iconPosition === 'before' && <Ionicons name={icon} size={sLink.default.fontSize} style={sLink.icons} />}<Text style={[sLink.default, style]}>{children}</Text>{iconPosition !== 'before' && <Ionicons name={icon} size={sLink.default.fontSize} style={sLink.icons} />}
  </Link>;
}

const sLink = StyleSheet.create({
    default: {
        textDecorationLine: 'underline',
        fontSize: 18,
    },
    icons : {
        verticalAlign: 'bottom'
    }
})