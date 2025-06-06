import { Tabs, useNavigation, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View, Alert, StyleProp, ViewStyle } from 'react-native';

import { HapticTab } from '@/components/navigation/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import HeaderIconBtn from '@/components/ui/HeaderIconBtn';
import { useThemeColor } from '@/hooks/useThemeColor';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: "#FFFCEE", dark: "#2B2A27" }, 'background');
  const router = useRouter();
  const segments = useSegments();
  const navigation = useNavigation();
  const [headerIconProps, setHeaderIconProps] = useState({
    iconName: "notifications-none",
    color: "black",
    onPress: () => router.push("/notifications"),
    style: { marginRight: 4, borderRadius: 100, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", padding: 2 }
  });

  useEffect(() => {
    const currentScreen = segments[segments.length - 1];
    switch (currentScreen) {
      case "profile":
        setHeaderIconProps({
          iconName: "settings",
          color: "#999",
          onPress: () => router.push("/settings"),
          style: { marginRight: 12, borderRadius: 100, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", padding: 2 }
        });
        break;
      case "friend":
      case "chat":
      default:
        setHeaderIconProps({
          iconName: "notifications-none",
          color: "black",
          onPress: () => router.push("/notifications"),
          style: { marginRight: 4, borderRadius: 100, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", padding: 2 }
        });
    }
  }, [segments, router]);

  useEffect(() => {
    const currentScreen = segments[segments.length - 1];
    let title = "Khám phá";
    switch (currentScreen) {
      case "friend":
        title = "Kết bạn";
        break;
      case "chat":
        title = "Nhắn tin";
        break;
      case "profile":
        title = "Hồ sơ";
        break;
      default:
        title = "Khám phá";
    }
    navigation.setOptions({
      headerLeft: () => (
        <ThemedText type="title" style={{ paddingLeft: 4 }}>{title}</ThemedText>),
      headerRight: () => <HeaderIconBtn {...headerIconProps} />,
      headerTitle: "",
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0,
      }
    });
  }, [navigation, segments, headerIconProps]);

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => <SimpleLineIcons size={18} name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="friend"
        options={{
          title: 'Kết bạn',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={18} name="puzzle-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Nhắn tin',
          tabBarIcon: ({ color }) => <Ionicons size={18} name="chatbubble-ellipses-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color }) => <IconSymbol size={18} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
