import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import { ThemedText } from '@/components/ui/ThemedText'
import { useApi } from '@/contexts/ApiContext'
import { ChatRoom, ChatParticipant } from '@/types/chat'
import { useColorScheme } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'
interface Contact {
  id: string
  name: string
  avatar: string
}

// Keep existing mock data for contacts
const contacts: Contact[] = [
  {
    id: '1',
    name: 'Nila Dang',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Dat Nguyen',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Toan Bui',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Thi',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
]

export default function ChatScreen() {
  const api = useApi()
  const router = useRouter()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const colorScheme = useColorScheme()
  
  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFCEE', dark: '#2B2A27' }, 'background')
  const cardBackgroundColor = useThemeColor({ light: '#FFF', dark: '#3A3A3A' }, 'background')
  const textColor = useThemeColor({ light: '#000', dark: '#FFF' }, 'text')
  const subtitleColor = useThemeColor({ light: '#8E8E93', dark: '#AAA' }, 'text')
  const messageTextColor = useThemeColor({ light: '#666', dark: '#CCC' }, 'text')
  const timeColor = useThemeColor({ light: '#999', dark: '#AAA' }, 'text')
  const emptyTextColor = useThemeColor({ light: '#999', dark: '#AAA' }, 'text')
  const borderColor = useThemeColor({ light: '#FFF', dark: '#4A4A4A' }, 'border')
  const fetchChatRooms = useCallback(async () => {
    if (!api) return

    try {
      const response = await api.get('/chat/rooms')
      console.log('Chat rooms fetched:', response.data)
      const data = response.data as any
      setChatRooms(data.rooms || [])
    } catch (error) {
      console.error('Error fetching chat rooms:', error)
      Alert.alert('Lỗi', 'Không thể tải danh sách tin nhắn')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [api])

  useEffect(() => {
    fetchChatRooms()
  }, [fetchChatRooms])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchChatRooms()
  }, [fetchChatRooms])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getRoomDisplayInfo = (room: ChatRoom) => {
    // Since we don't have participant info in this API response,
    // we'll use the room name and metadata for display
    return {
      name: room.name,
      subtitle: `${room.memberCount} thành viên`,
      avatar: room.lastMessage?.user?.profileImages?.[0] || null, // No avatar info in current API
      isOnline: false
    }
  }
  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactItem}>
      <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
      <ThemedText style={[styles.contactName, { color: textColor }]}>{item.name}</ThemedText>
    </TouchableOpacity>
  )

  const renderMessage = ({ item }: { item: ChatRoom }) => {
    console.log("🚀 ~ renderMessage ~ item:", item)
    const displayInfo = getRoomDisplayInfo(item)
    const lastMessage = item.lastMessage
    const handlePress = () => {
      router.push({
        pathname: '/chat/conversation',
        params: {
          roomId: item.id,
          roomName: item.name,
          username: item.name
        }
      })
    }

    return (
      <TouchableOpacity style={[styles.messageItem, { backgroundColor: cardBackgroundColor, borderColor }]} onPress={handlePress}>
        <View style={styles.messageLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: displayInfo.avatar || 'https://via.placeholder.com/48'
              }}
              style={styles.messageAvatar}
            />
            {displayInfo.isOnline && <View style={[styles.onlineIndicator, { borderColor: cardBackgroundColor }]} />}
          </View>
          <View style={styles.messageContent}>
            <ThemedText style={[styles.messageName, { color: textColor }]}>
              {displayInfo.name}
            </ThemedText>
            <ThemedText style={[styles.messageText, { color: messageTextColor }]}>
              {lastMessage?.message || displayInfo.subtitle}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.messageTime, { color: timeColor }]}>
          {formatTime(item.updatedAt)}
        </ThemedText>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View style={styles.content}>
        {/* Contacts Section */}
        {/* <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Đã ghép cặp</ThemedText>
          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contactsContainer}
          />
        </View> */}

        {/* Messages Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: subtitleColor }]}>Tin nhắn</ThemedText>
          <FlatList
            data={chatRooms}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {loading ? (
                  <ThemedText style={[styles.emptyText, { color: emptyTextColor }]}>Đang tải...</ThemedText>
                ) : (
                  <ThemedText style={[styles.emptyText, { color: emptyTextColor }]}>
                    Chưa có tin nhắn nào
                  </ThemedText>
                )}
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 8
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 12,
    marginHorizontal: 20,
    letterSpacing: 0.3
  },
  contactsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  contactItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 100
  },
  contactAvatar: {
    width: '100%',
    aspectRatio: 5 / 6,
    borderRadius: 20,
    marginBottom: 12
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18
  },
  messagesContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  messageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    borderWidth: 2
  },
  messageContent: {
    flex: 1
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2
  },
  messageText: {
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
    marginLeft: 8
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32
  }
})
