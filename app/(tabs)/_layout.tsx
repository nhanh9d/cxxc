import { Tabs, useNavigation, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const segments = useSegments();
  const navigation = useNavigation();
  useEffect(() => {
    const currentScreen = segments[segments.length - 1];
    let title = "Khám phá";

    if (currentScreen == "friend") {
      title = "Kết bạn"
    }

    navigation.setOptions({
      headerLeft: () => (
        <ThemedText type="title">{title}</ThemedText>),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          style={{ marginRight: 15, borderRadius: 100, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", padding: 2 }}>
          <MaterialIcons name="notifications-none" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#FFFCEE",
        shadowOpacity: 0, // Remove shadow (iOS)
        elevation: 0, // Remove shadow (Android)
        borderBottomWidth: 0, // Remove bottom border
      }
    });
  }, [navigation, segments]);

  return (
    <Tabs
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
