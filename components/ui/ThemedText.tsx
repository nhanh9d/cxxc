import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'subtitleSemiBold' | 'subtitleNoBold' | 'link' | 'small' | 'body2Regular' | 'body2Medium';
};

export function ThemedText({
  style,
  lightColor = "#000",
  darkColor = "#FFF",
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'subtitleSemiBold' ? styles.subtitleSemiBold : undefined,
        type === 'subtitleNoBold' ? styles.subtitleNoBold : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'body2Regular' ? styles.body2Regular : undefined,
        type === 'body2Medium' ? styles.body2Medium : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitleSemiBold: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
  },
  subtitleNoBold: {
    fontSize: 20,
    lineHeight: 28,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  small: {
    lineHeight: 16,
    fontSize: 12,
    color: '#000',
  },
  body2Regular: {
    lineHeight: 20,
    fontSize: 14,
  },
  body2Medium: {
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '500',
  },
});
