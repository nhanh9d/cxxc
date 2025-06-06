// components/Providers.tsx
import React from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeContext } from '@react-navigation/native';

import { AuthProvider } from '@/contexts/AuthContext';
import { ApiProvider } from '@/contexts/ApiContext';
import { ImageUploadProvider } from '@/contexts/UploadImageContext';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { LoadingProvider } from "@/contexts/LoadingContext";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  const providers: [React.ComponentType<any>, any?][] = [
    [LoadingProvider],
    [ThemeContext.Provider, { value: theme }],
    [AuthProvider],
    [ApiProvider],
    [ConfigProvider],
    [ImageUploadProvider],
  ];

  const wrappedChildren = providers.reduceRight((acc, [Provider, props]) => {
    return <Provider {...(props || {})}>{acc}</Provider>;
  }, children);

  return wrappedChildren;
};
