import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Alert,
  ImageSourcePropType,
  Modal,
} from 'react-native'
import { ThemedText } from '@/components/ui/ThemedText'
import { useEffect, useState } from 'react'
import { EventDto, EventMember, EventStatistic } from '@/types/event'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { formattedDate } from '@/helpers/date'
import { ThemedScrollView } from '@/components/layout/ThemedScrollView'
import React from 'react'
import { useApi } from '@/contexts/ApiContext'
import { useAuth } from '@/contexts/AuthContext'
import { useConfig } from '@/contexts/ConfigContext'
import { useLoading } from '@/contexts/LoadingContext'
import { UserDto } from '@/types/user'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ChatRoomDto } from '@/types/chatRoom'
import QRCode from 'react-native-qrcode-svg'
import { ThemedView } from '@/components/layout/ThemedView'
import { ButtonType, ThemedButton } from '@/components/ui/ThemedButton'

export default function DetailScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const axios = useApi()
  const { userId } = useAuth()
  const config = useConfig()
  const { showLoading, hideLoading } = useLoading()
  const backgroundColor = useThemeColor(
    { light: '#FFFCEE', dark: '#2B2A27' },
    'background'
  )
  const buttonBackgroundColor = useThemeColor({ light: "#FFF", dark: "#3A3A3A" }, 'background')
  const borderColor = useThemeColor({ light: "#EEEEEF", dark: "#4A4A4A" }, 'border')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/(tabs)')
          }
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialIcons
            name={router.canGoBack() ? 'chevron-left' : 'home'}
            size={24}
            color="#8A8A8E"
          />
          <ThemedText style={{ color: '#8A8A8E' }}>
            {router.canGoBack() ? 'Quay lại' : 'Về trang chủ'}
          </ThemedText>
        </TouchableOpacity>
      ),
      headerTitle: '',
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0, // Remove shadow (iOS)
        elevation: 0, // Remove shadow (Android)
        borderBottomWidth: 0 // Remove bottom border
      }
    })
  }, [navigation])

  const { eventId } = useLocalSearchParams()

  //get event information
  const [joined, setJoined] = useState(false)
  const [event, setEvent] = useState<EventDto>()
  const [invitedNo, setInvitedNo] = useState<number>(0)
  const [rejectedNo, setRejectedNo] = useState<number>(0)
  const [members, setMembers] = useState<EventMember[]>()
  const [chatRoom, setChatRoom] = useState<ChatRoomDto>()
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    const getEventFromApi = async () => {
      const statisticUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/statistic`
      const response = await axios.get<EventStatistic>(statisticUri)

      if (response?.data) {
        const eventData = response.data.event
        if (eventData.banner && !eventData.banner.startsWith('http')) {
          eventData.banner = `${Constants.expoConfig?.extra?.fileUrl}${eventData.banner}`
        }
        setEvent(eventData)
        setInvitedNo(response.data.invitedNo)
        setRejectedNo(response.data.rejectedNo)
        setMembers(response.data.event.members)
        setChatRoom(response.data.chatRoom)
      }
    }

    getEventFromApi()
  }, [])

  //check is creator
  const [isCreator, setIsCreator] = useState(false)
  useEffect(() => {
    setIsCreator(event?.creator?.id === userId)
    setJoined(!!event?.members?.filter((m) => m.user.id === userId).length)
  }, [event])

  const sharedBackAlert = (content: string) =>
    Alert.alert(
      'Thông báo',
      content,
      [
        {
          text: 'Quay về trang chủ',
          onPress: () => router.replace('/(tabs)')
        }
      ],
      {
        onDismiss: () => router.replace('/(tabs)')
      }
    )

  const sharedAlert = (
    content: string = 'Hiện chức năng đang được phát triển'
  ) =>
    Alert.alert('Thông báo', content, [
      {
        text: 'Ok'
      }
    ])

  const register = async () => {
    try {
      showLoading()
      const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/register`
      const response = await axios.post(eventUri, { id: eventId })

      if (response?.data) {
        sharedAlert('Đăng ký tham gia chuyến đi thành công')
        router.reload()
      }
    } catch (error) {
      console.log('🚀 ~ register ~ error:', error)
    } finally {
      hideLoading()
    }
  }
  const invite = () => {
    sharedAlert()
  }
  const share = () => {
    setShowQRModal(true)
  }

  const generateShareLink = () => {
    // Create a deep link using the app scheme from app.json
    const deepLink = `cxxc://event/detail?eventId=${eventId}`
    return deepLink
  }
  const notify = () => {
    sharedAlert()
  }
  const edit = () => {
    router.push({
      pathname: '/event/create',
      params: { eventId }
    })
  }

  const chat = () => {
    router.push({
      pathname: '/chat/conversation',
      params: {
        roomId: chatRoom?.id,
        roomName: chatRoom?.name,
        username: chatRoom?.members?.find((m) => m.user.id === userId)?.user
          .fullname
      }
    })
  }

  const remove = async () => {
    const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}`
    const response = await axios.delete<EventStatistic>(eventUri)

    if (response?.data) {
      sharedBackAlert('Huỷ chuyến đi thành công')
    }
  }

  const unjoin = async () => {
    const unJoinEventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/unjoin`
    const response = await axios.post(unJoinEventUri, { id: eventId })

    if (response?.data) {
      sharedBackAlert('Huỷ tham gia chuyến đi thành công')
    }
  }

  const imageSource = (user?: UserDto): ImageSourcePropType =>
    user?.profileImages?.[0]
      ? {
          uri: user.profileImages[0].includes(config?.fileUrl)
            ? user.profileImages[0]
            : `${config?.fileUrl}/${user.profileImages[0]}`
        }
      : require('../../assets/images/banner-placeholder.png')

  return (
    <ThemedScrollView style={styles.container}>
      <Image
        source={
          event?.banner
            ? {
                uri: event.banner.includes(config?.fileUrl)
                  ? event.banner
                  : `${config?.fileUrl}/${event.banner}`
              }
            : require('../../assets/images/banner-placeholder.png')
        }
        style={{
          width: '100%',
          height: 150,
          resizeMode: 'cover',
          borderRadius: 12,
          marginBottom: 24
        }}
      />

      <View style={{ marginBottom: 24 }}>
        <ThemedText
          type="subtitleNoBold"
          style={{ marginBottom: 12, fontWeight: '500' }}
        >
          {event?.name}
        </ThemedText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8
          }}
        >
          <MaterialCommunityIcons
            size={16}
            name="calendar-blank-outline"
            color="#8A8A8E"
            style={{ marginRight: 4 }}
          />
          <ThemedText type="default">
            Từ {event?.startDate ? formattedDate(event.startDate) : ''} -{' '}
            {event?.endDate ? formattedDate(event.endDate) : ''}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            size={16}
            name="map-marker-radius-outline"
            color="#8A8A8E"
            style={{ marginRight: 4 }}
          />
          <ThemedText type="default">{event?.startLocation}</ThemedText>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 24
        }}
      >
        {isCreator && (
          <TouchableOpacity
            onPress={() => invite()}
            style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
          >
            <MaterialIcons
              style={{ marginBottom: 8 }}
              name="person-add-alt"
              size={24}
              color="#8A8A8E"
            />
            <ThemedText type="body2Regular">Mời bạn bè</ThemedText>
          </TouchableOpacity>
        )}
        {isCreator && (
          <TouchableOpacity
            onPress={() => notify()}
            style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
          >
            <MaterialIcons
              style={{ marginBottom: 8 }}
              name="notifications"
              size={24}
              color="#8A8A8E"
            />
            <ThemedText type="body2Regular">Thông báo</ThemedText>
          </TouchableOpacity>
        )}
        {!isCreator && (
          <TouchableOpacity
            onPress={() => (joined ? void 0 : register())}
            style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
          >
            <MaterialIcons
              style={{ marginBottom: 8 }}
              name={joined ? 'check-circle' : 'group-add'}
              size={24}
              color={joined ? '#34C759' : '#8A8A8E'}
            />
            <ThemedText type="body2Regular">
              {joined ? 'Đã ' : ''}Đăng ký
            </ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => share()} style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}>
          <MaterialIcons
            style={{ marginBottom: 8 }}
            name="share"
            size={24}
            color="#8A8A8E"
          />
          <ThemedText type="body2Regular">Chia sẻ</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText style={[styles.subtitle, { borderBottomColor: borderColor }]}>Thống kê thành viên</ThemedText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 24
        }}
      >
        <View style={[styles.statistic, { backgroundColor: buttonBackgroundColor, borderColor, borderWidth: 1, borderRadius: 12, padding: 16 }]}>
          <ThemedText type="subtitleSemiBold">{members?.length}</ThemedText>
          <ThemedText type="body2Regular">Thành viên</ThemedText>
        </View>
        <View style={[styles.statistic, { backgroundColor: buttonBackgroundColor, borderColor, borderWidth: 1, borderRadius: 12, padding: 16 }]}>
          <ThemedText type="subtitleSemiBold">{invitedNo}</ThemedText>
          <ThemedText type="body2Regular">Đã mời</ThemedText>
        </View>
        <View style={[styles.statistic, { backgroundColor: buttonBackgroundColor, borderColor, borderWidth: 1, borderRadius: 12, padding: 16 }]}>
          <ThemedText type="subtitleSemiBold">{rejectedNo}</ThemedText>
          <ThemedText type="body2Regular">Không tham gia</ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.subtitle, { borderBottomColor: borderColor }]}>Tổ chức bởi</ThemedText>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}
      >
        <Image
          source={imageSource(event?.creator)}
          style={{
            width: 32,
            height: 32,
            resizeMode: 'cover',
            borderRadius: 100,
            marginRight: 8
          }}
        />
        <ThemedText type="defaultSemiBold">
          {event?.creator?.fullname}
        </ThemedText>
      </View>

      <ThemedText style={[styles.subtitle, { borderBottomColor: borderColor }]}>
        {members?.length} thành viên tham gia
      </ThemedText>
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row' }}>
          {members?.slice(0, 10).map((member, index) => (
            <Image
              key={index}
              source={imageSource(member.user)}
              style={[
                {
                  width: 32,
                  height: 32,
                  resizeMode: 'cover',
                  borderRadius: 100,
                  marginLeft: index > 0 ? -12 : 0
                }
              ]}
            />
          ))}
        </View>
        <ThemedText type="defaultSemiBold" style={{ marginTop: 8 }}>
          {members
            ?.slice(0, 10)
            .map((member) => member.user.fullname)
            .join(', ')}
          {members && members.length > 10 ? '...' : ''}
        </ThemedText>
      </View>

      <ThemedText style={[styles.subtitle, { borderBottomColor: borderColor }]}>Mô tả</ThemedText>
      <View style={{ marginBottom: 24 }}>
        <ThemedText type="default">{event?.description}</ThemedText>
      </View>

      {(isCreator || joined) && (
        <>
          <ThemedText style={[styles.subtitle, { borderBottomColor: borderColor }]}>Quản lý</ThemedText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 24
            }}
          >
            {isCreator && (
              <TouchableOpacity
                onPress={() => edit()}
                style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
              >
                <MaterialIcons
                  style={{ marginBottom: 8 }}
                  name="mode-edit"
                  size={24}
                  color="#8A8A8E"
                />
                <ThemedText type="body2Regular">Chỉnh sửa thông tin</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => chat()}
              style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
            >
              <MaterialIcons
                style={{ marginBottom: 8 }}
                name="chat-bubble-outline"
                size={24}
                color="#8A8A8E"
              />
              <ThemedText type="body2Regular">Hội thoại chung</ThemedText>
            </TouchableOpacity>
            {isCreator && (
              <TouchableOpacity
                onPress={() => remove()}
                style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
              >
                <MaterialIcons
                  style={{ marginBottom: 8 }}
                  name="delete-outline"
                  size={24}
                  color="#FF3B30"
                />
                <ThemedText type="body2Regular" style={{ color: '#FF3B30' }}>
                  Huỷ chuyến đi
                </ThemedText>
              </TouchableOpacity>
            )}
            {joined && !isCreator && (
              <TouchableOpacity
                onPress={() => unjoin()}
                style={[styles.actionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
              >
                <MaterialIcons
                  style={{ marginBottom: 8 }}
                  name="output"
                  size={24}
                  color="#FF3B30"
                />
                <ThemedText type="body2Regular" style={{ color: '#FF3B30' }}>
                  Huỷ tham gia
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      
      {/* QR Code Share Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={[styles.qrModalContent, { 
            backgroundColor: buttonBackgroundColor,
            borderColor 
          }]}>
            <ThemedText type="subtitle" style={{ marginBottom: 20, textAlign: 'center' }}>
              Chia sẻ hoạt động {event?.name}
            </ThemedText>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={generateShareLink()}
                size={200}
                backgroundColor="white"
                color="black"
              />
            </View>
            
            <ThemedText type="small" style={{ 
              textAlign: 'center', 
              marginTop: 16,
              marginBottom: 20,
              opacity: 0.7
            }}>
              Quét mã QR để xem chi tiết chuyến đi
            </ThemedText>
            
            <ThemedButton
              title="Đóng"
              buttonType={ButtonType.primary}
              onPress={() => setShowQRModal(false)}
              style={{ marginTop: 10 }}
            />
          </ThemedView>
        </View>
      </Modal>
    </ThemedScrollView>
  )
}

const styles = StyleSheet.create({
  banner: {
    position: 'relative',
    marginBottom: 12
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  bannerButton: {
    position: 'absolute',
    width: 120,
    bottom: 12,
    left: 12,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  bannerButtonText: {
    fontSize: 12,
    paddingRight: 0,
    textAlign: 'left'
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1
  },
  subtitle: {
    color: '#8A8A8E',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 12
  },
  statistic: {
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  qrModalContent: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1
  },
  qrContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
})
