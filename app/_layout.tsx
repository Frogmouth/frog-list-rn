import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import FlashMessage from "react-native-flash-message";

import { useColorScheme } from '@/hooks/useColorScheme';
import { rootStore } from '@/store';
import { ThemedView } from '@/components/ThemedView';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={{flex:1}}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <ThemedView>
              <Provider store={rootStore}>
                  <Stack>
                    <Stack.Screen
                        name="index"
                        options={{
                          title: 'Home'
                        }}
                      />
                    <Stack.Screen
                        name="products"
                        options={{
                          title: 'Prodotti'
                        }}
                      />
                    <Stack.Screen
                      name="addproduct"
                      options={{
                        title: 'Nuovo prodotto',
                        presentation: 'transparentModal',
                      }}
                    />
                  </Stack>
                  <StatusBar style="auto" />
                  <FlashMessage />
              </Provider>
            </ThemedView>
        </ThemeProvider>
      </SafeAreaView>
  );
}
