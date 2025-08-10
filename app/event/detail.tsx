import { useLocalSearchParams, useNavigation, useRouter, useFocusEffect } from 'expo-router'
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
import { EventDto, EventMember, EventMemberStatus, EventStatistic, EventTarget } from '@/types/event'
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
  const [confirmedNo, setConfirmedNo] = useState<number>(0)
  const [pendingNo, setPendingNo] = useState<number>(0)
  const [members, setMembers] = useState<EventMember[]>()
  const [chatRoom, setChatRoom] = useState<ChatRoomDto>()
  const [showQRModal, setShowQRModal] = useState(false)

  const getEventFromApi = async () => {
    try {
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
        setConfirmedNo(response.data.event.members?.filter((m) => m.status === EventMemberStatus.CONFIRMED).length || 0)
        setPendingNo(response.data.event.members?.filter((m) => m.status === EventMemberStatus.REGISTERED || m.status === EventMemberStatus.INVITED).length || 0)
      }
    } catch (error) {
      console.error('Error fetching event statistics:', error)
    }
  }

  useEffect(() => {
    getEventFromApi()
  }, [])

  // Refetch data when screen comes into focus (returning from member pages)
  useFocusEffect(
    React.useCallback(() => {
      getEventFromApi()
    }, [eventId])
  )

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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialCommunityIcons
            size={16}
            name="map-marker-radius-outline"
            color="#8A8A8E"
            style={{ marginRight: 4 }}
          />
          <ThemedText type="default">{event?.startLocation}</ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons
            size={16}
            name={event?.target === EventTarget.PRIVATE ? "lock" : "public"}
            color="#8A8A8E"
            style={{ marginRight: 4 }}
          />
          <ThemedText type="default">
            {event?.target === EventTarget.PRIVATE ? "Riêng tư" : "Công khai"}
          </ThemedText>
        </View>
      </View>

      {(isCreator || joined) && (
        <View style={{ marginBottom: 24 }}>
          <ThemedText style={[styles.subtitle, { borderBottomColor: borderColor }]}>Quản lý</ThemedText>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 12
            }}
          >
            {isCreator && (
              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/event/pending-members',
                  params: { eventId }
                })}
                style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
              >
                <View style={styles.badgeContainer}>
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{pendingNo}</ThemedText>
                  </View>
                </View>
                <ThemedText type="body2Regular" style={styles.actionButtonText}>Chờ duyệt</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/event/confirmed-members',
                params: { eventId }
              })}
              style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
            >
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: '#8A8A8E', width: 40 }]}>
                  <ThemedText style={styles.badgeText}>{confirmedNo}/{event?.size || 20}</ThemedText>
                </View>
              </View>
              <ThemedText type="body2Regular" style={styles.actionButtonText}>Đã tham gia</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => invite()}
              style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
            >
              <MaterialIcons
                name="person-add-alt"
                size={24}
                color="#8A8A8E"
              />
              <ThemedText type="body2Regular" style={styles.actionButtonText}>Mời bạn bè</ThemedText>
            </TouchableOpacity>
            {isCreator && (
              <TouchableOpacity
                onPress={() => edit()}
                style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
              >
                <MaterialIcons
                  name="edit"
                  size={24}
                  color="#8A8A8E"
                />
                <ThemedText type="body2Regular" style={styles.actionButtonText}>Chỉnh sửa</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => chat()}
              style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
            >
              <MaterialCommunityIcons
                name="message-text"
                size={24}
                color="#8A8A8E"
              />
              <ThemedText type="body2Regular" style={styles.actionButtonText}>Chat chung</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => share()}
              style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
            >
              <MaterialIcons
                name="share"
                size={24}
                color="#8A8A8E"
              />
              <ThemedText type="body2Regular" style={styles.actionButtonText}>Chia sẻ</ThemedText>
            </TouchableOpacity>
            {isCreator ? (
              <TouchableOpacity
                onPress={() => remove()}
                style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color="#FF3B30"
                />
                <ThemedText type="body2Regular" style={[styles.actionButtonText, { color: '#FF3B30' }]}>Hủy</ThemedText>
              </TouchableOpacity>
            ) : joined && (
              <TouchableOpacity
                onPress={() => unjoin()}
                style={[styles.gridActionButton, { backgroundColor: buttonBackgroundColor, borderColor }]}
              >
                <MaterialIcons
                  name="output"
                  size={24}
                  color="#FF3B30"
                />
                <ThemedText type="body2Regular" style={[styles.actionButtonText, { color: '#FF3B30' }]}>Hủy tham gia</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ThemedText style={[styles.subtitle, { borderBottomColor: borderColor }]}>Thống kê thành viên</ThemedText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 24
        }}
      >
        <View style={styles.statistic}>
          <ThemedText type="subtitle" style={{ fontSize: 20, fontWeight: '600' }}>{members?.length || 0}</ThemedText>
          <ThemedText type="small" style={{ color: '#8A8A8E', marginTop: 4 }}>Thành viên</ThemedText>
        </View>
        <View style={styles.statistic}>
          <ThemedText type="subtitle" style={{ fontSize: 20, fontWeight: '600' }}>{invitedNo || 0}</ThemedText>
          <ThemedText type="small" style={{ color: '#8A8A8E', marginTop: 4 }}>Đã mời</ThemedText>
        </View>
        <View style={styles.statistic}>
          <ThemedText type="subtitle" style={{ fontSize: 20, fontWeight: '600' }}>{rejectedNo || 0}</ThemedText>
          <ThemedText type="small" style={{ color: '#8A8A8E', marginTop: 4 }}>Không tham gia</ThemedText>
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
  gridActionButton: {
    width: '31.5%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 80
  },
  actionButtonText: {
    fontSize: 12,
    marginTop: 8,
  },
  badgeContainer: {
    position: 'relative'
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600'
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
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8
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
