import { StyleSheet, Pressable, type PressableProps, type StyleProp, type ViewStyle, type TextStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

type ButtonAddProductProps = {
    buttonStyle? : StyleProp<ViewStyle>,
    textStyle? : StyleProp<TextStyle>
} & PressableProps;

export default function ButtonAddProduct({onPress, buttonStyle, textStyle}: ButtonAddProductProps) {
    return (
        <Pressable onPress={onPress}>
            <ThemedView style={[s.button, buttonStyle]} darkColor='#333' lightColor='#f1f1f1'>
                <ThemedText type='cta' style={[s.buttonText, textStyle]}>
                    Aggiungi <Ionicons name="add-circle" size={20} />
                </ThemedText>
            </ThemedView>
        </Pressable>
    )
}

const s = StyleSheet.create({
    button : {paddingHorizontal: 16, paddingVertical: 8, borderTopEndRadius: 5, borderBottomEndRadius: 5, marginTop:8},
    buttonText : {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', display: 'flex'},
})