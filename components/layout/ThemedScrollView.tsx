import { ScrollView, type ScrollViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedScrollView({
  style,
  lightColor = "#FFFCEE",
  darkColor = "#2B2A27",
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
