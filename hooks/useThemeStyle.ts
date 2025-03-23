'use strict'

import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeStyle<T> (
  props: { light: T; dark: T },
) {
  return  props[useColorScheme() ?? 'light'] as T;
}
