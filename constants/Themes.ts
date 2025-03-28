import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { Colors } from './Colors';

export const MyLightTheme: Theme = {...{
  colors: {
    primary: Colors.light.primary,
    background: Colors.light.background,
    text: Colors.light.text,
    card: 'rgb(255, 255, 255)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  }
}, ...DefaultTheme};

export const MyDarkTheme: Theme = {...{
    colors: {
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      text: Colors.dark.text,
      card: 'rgb(255, 255, 255)',
      border: 'rgb(216, 216, 216)',
      notification: 'rgb(255, 59, 48)',
    }
  }, ...DarkTheme};