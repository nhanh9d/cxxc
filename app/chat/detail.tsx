import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  FlatList,
  useColorScheme 
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/layout/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useApi } from '@/contexts/ApiContext';
import { UserDto } from '@/types/user';
import UserProfile from '@/components/profile/UserProfile';
import { ThemedScrollView } from '@/components/layout/ThemedScrollView';
import { Modal } from 'react-native';

interface ChatMember {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  user: UserDto;
}

interface ChatRoomDetail {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  members: ChatMember[];
  avatar?: string;
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const api = useApi();
  const colorScheme = useColorScheme();
  
  const roomId = params.roomId as string;
  const roomName = params.roomName as string;
  
  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFCEE', dark: '#2B2A27' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#FFF', dark: '#3A3A3A' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#FFF' }, 'text');
  const subtitleColor = useThemeColor({ light: '#8E8E93', dark: '#AAA' }, 'text');
  const borderColor = useThemeColor({ light: '#EEEEEF', dark: '#4A4A4A' }, 'border');
  const iconColor = useThemeColor({ light: '#999', dark: '#AAA' }, 'icon');

  const [members, setMembers] = useState<ChatMember[]>([]);
  const [roomInfo, setRoomInfo] = useState({
    name: roomName,
    description: '',
    memberCount: 0,
    createdAt: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialIcons name="chevron-left" size={24} color={iconColor} />
          <ThemedText>Quay lại</ThemedText>
        </TouchableOpacity>
      ),
      headerTitle: 'Chi tiết nhóm chat',
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0,
      }
    });
  }, [navigation, backgroundColor, iconColor]);

  // Fetch room details from API
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!api || !roomId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/chat/rooms/${roomId}`);
        const roomData = response.data as ChatRoomDetail;
        
        if (roomData) {
          setRoomInfo({
            name: roomData.name || roomName,
            description: roomData.description || 'Hội thoại chung',
            memberCount: roomData.memberCount || roomData.members?.length || 0,
            createdAt: roomData.createdAt || '',
            avatar: roomData.avatar || ''
          });
          
          // Process members data
          const processedMembers = roomData.members?.map(member => ({
            id: member.id || member.user?.id?.toString() || '',
            name: member.name || member.user?.fullname || 'Unknown User',
            avatar: member.avatar || member.user?.profileImages?.[0] || '',
            isOnline: member.isOnline || false,
            user: member.user
          })) || [];
          
          setMembers(processedMembers);
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
        // Fallback to basic info if API fails
        setRoomInfo(prev => ({ ...prev, name: roomName }));
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [api, roomId, roomName]);

  const handleMemberPress = async (member: ChatMember) => {
    setSelectedUser(member.user);
    setLoadingUserDetail(true);
    setUserModalVisible(true);
    setLoadingUserDetail(false);
  };

  const renderMember = ({ item }: { item: ChatMember }) => (
    <TouchableOpacity 
      style={[styles.memberItem, { backgroundColor: cardBackgroundColor, borderColor }]}
      onPress={() => handleMemberPress(item)}
    >
      <Image 
        source={{ 
          uri: item.avatar || item.user?.profileImages?.[0] || 'https://via.placeholder.com/48x48/cccccc/666666?text=User' 
        }} 
        style={styles.memberAvatar} 
      />
      <ThemedView style={styles.memberInfo}>
        <ThemedText style={[styles.memberName, { color: textColor }]}>{item.name}</ThemedText>
        {/* <ThemedText style={[styles.memberStatus, { color: subtitleColor }]}>
          {item.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
        </ThemedText> */}
      </ThemedView>
      <MaterialIcons name="chevron-right" size={20} color={iconColor} />
      {/* {item.isOnline && <ThemedView style={styles.onlineIndicator} />} */}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Room Info Section */}
      <ThemedView style={[styles.roomInfoSection, { backgroundColor: cardBackgroundColor, borderColor }]}>
        <Image
          source={{
            uri: roomInfo.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
          }}
          style={styles.roomAvatar}
        />
        <ThemedText style={[styles.roomName, { color: textColor }]}>{roomInfo.name}</ThemedText>
        <ThemedText style={[styles.memberCount, { color: subtitleColor }]}>
          {roomInfo.memberCount} thành viên
        </ThemedText>
        {roomInfo.description ? (
          <ThemedText style={[styles.roomDescription, { color: subtitleColor }]}>
            {roomInfo.description}
          </ThemedText>
        ) : null}
      </ThemedView>

      {/* Members Section */}
      <ThemedView style={styles.membersSection}>
        <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
          Thành viên ({members.length})
        </ThemedText>
        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText style={[styles.loadingText, { color: subtitleColor }]}>Đang tải...</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.membersList}
            ListEmptyComponent={
              <ThemedView style={styles.emptyContainer}>
                <ThemedText style={[styles.emptyText, { color: subtitleColor }]}>
                  Không có thành viên nào
                </ThemedText>
              </ThemedView>
            }
          />
        )}
      </ThemedView>
      
      {/* User Detail Modal */}
      <Modal
        visible={userModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setUserModalVisible(false);
          setSelectedUser(null);
        }}
      >
        <ThemedView style={[styles.modalContainer, { backgroundColor }]}>
          {/* Modal Header */}
          <ThemedView style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <ThemedText style={[styles.modalTitle, { color: textColor }]}>
              Thông tin thành viên
            </ThemedText>
            <TouchableOpacity 
              onPress={() => {
                setUserModalVisible(false);
                setSelectedUser(null);
              }}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={iconColor} />
            </TouchableOpacity>
          </ThemedView>
          
          {/* Modal Content */}
          {loadingUserDetail ? (
            <ThemedView style={styles.loadingContainer}>
              <ThemedText style={[styles.loadingText, { color: subtitleColor }]}>
                Đang tải thông tin...
              </ThemedText>
            </ThemedView>
          ) : selectedUser ? (
            <ThemedScrollView 
              style={styles.modalContent}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <UserProfile user={selectedUser} />
            </ThemedScrollView>
          ) : (
            <ThemedView style={styles.loadingContainer}>
              <ThemedText style={[styles.loadingText, { color: subtitleColor }]}>
                Không thể tải thông tin người dùng
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomInfoSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  roomAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 14,
  },
  membersSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  membersList: {
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberStatus: {
    fontSize: 14,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  roomDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});