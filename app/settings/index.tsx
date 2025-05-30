import React, { useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { logout } = useAuth();

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
        backgroundColor: '#FFFCEE',
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0,
      },
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt ứng dụng</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Cài đặt thông báo', 'Chức năng đang phát triển')}> 
          <Ionicons name="notifications-outline" size={22} color="#999" style={styles.icon} />
          <Text style={styles.text}>Cài đặt thông báo</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.chevron} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Cài đặt quyền riêng tư', 'Chức năng đang phát triển')}> 
          <MaterialCommunityIcons name="shield-lock-outline" size={22} color="#999" style={styles.icon} />
          <Text style={styles.text}>Cài đặt quyền riêng tư</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" style={styles.chevron} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="language" size={22} color="#999" style={styles.icon} />
          <Text style={styles.text}>Ngôn ngữ</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: 8 }}>
            <Text style={{ fontSize: 22 }}>🇻🇳</Text>
            <Text style={{ fontSize: 22 }}>🇬🇧</Text>
          </View>
        </View>
      </View>
      <View style={[styles.card, { marginTop: 24 }]}> 
        <TouchableOpacity style={[styles.row, { justifyContent: 'center' }]} onPress={() => logout()}> 
          <MaterialCommunityIcons name="logout" size={22} color="#F44" style={styles.icon} />
          <Text style={[styles.text, { color: '#F44' }]}>Đăng xuất</Text>
          <Ionicons name="chevron-forward" size={20} color="#F44" style={styles.chevron} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCEE',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
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
    fontSize: 17,
    color: '#222',
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
}); 