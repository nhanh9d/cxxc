import React, { useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/layout/ThemedView';

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const backgroundColor = useThemeColor({ light: "#FFFCEE", dark: "#2B2A27" }, 'background');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 0, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="chevron-back" size={22} color="#999" />
          <Text style={{ color: '#999', fontSize: 16, marginLeft: 2 }}>Quay lại</Text>
        </TouchableOpacity>
      ),
      headerTitle: () => (<Text></Text>),
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText type="title" style={styles.title}>Cài đặt ứng dụng</ThemedText>
      <ThemedView style={styles.card} darkColor="#1C1A14">
        <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Cài đặt thông báo', 'Chức năng đang phát triển')}> 
          <Ionicons name="notifications-outline" size={22} color="#999" style={styles.icon} />
          <ThemedText type="default" style={styles.text}>Cài đặt thông báo</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.chevron} />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.card} darkColor="#1C1A14">
        <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Cài đặt quyền riêng tư', 'Chức năng đang phát triển')}> 
          <MaterialCommunityIcons name="shield-lock-outline" size={22} color="#999" style={styles.icon} />
          <ThemedText type="default" style={styles.text}>Cài đặt quyền riêng tư</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.chevron} />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.card} darkColor="#1C1A14">
        <View style={styles.row}>
          <MaterialIcons name="language" size={22} color="#999" style={styles.icon} />
          <ThemedText type="default" style={styles.text}>Ngôn ngữ</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: 8 }}>
            <Text style={{ fontSize: 22 }}>🇻🇳</Text>
            <Text style={{ fontSize: 22 }}>🇬🇧</Text>
          </View>
        </View>
      </ThemedView>
      <ThemedView style={[styles.card, { marginTop: 24 }]} darkColor="#1C1A14"> 
        <TouchableOpacity style={[styles.row, { justifyContent: 'center' }]} onPress={() => logout()}> 
          <MaterialCommunityIcons name="logout" size={22} color="#F44" style={styles.icon} />
          <Text style={[styles.text, { color: '#F44' }]}>Đăng xuất</Text>
          <Ionicons name="chevron-forward" size={20} color="#F44" style={styles.chevron} />
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#EEEEEF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
}); 