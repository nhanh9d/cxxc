import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/layout/ThemedView'
import { MaterialIcons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useApi } from '@/contexts/ApiContext'
import { useLoading } from '@/contexts/LoadingContext'
import { EventDto, EventMember, EventMemberStatus } from '@/types/event'
import Constants from 'expo-constants'
import MembersList from '@/components/event/MembersList'
import { useSnackbar } from '@/contexts/SnackbarContext'

export default function PendingMembersScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const axios = useApi()
  const { showLoading, hideLoading } = useLoading()
  const { eventId } = useLocalSearchParams()

  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFCEE', dark: '#2B2A27' }, 'background')
  const secondaryTextColor = useThemeColor({ light: '#8A8A8E', dark: '#999' }, 'text')

  const [event, setEvent] = useState<EventDto>()
  const [pendingMembers, setPendingMembers] = useState<EventMember[]>([])
  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialIcons name="chevron-left" size={24} color={secondaryTextColor} />
          <ThemedText style={{ color: secondaryTextColor }}>Quay lại</ThemedText>
        </TouchableOpacity>
      ),
      headerTitle: '',
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0
      }
    })
  }, [navigation, backgroundColor, secondaryTextColor])

  useEffect(() => {
    fetchPendingMembers()
  }, [])

  const fetchPendingMembers = async () => {
    try {
      showLoading()
      const response = await axios.get(`${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/pending-members`)
      
      if (response?.data?.pendingMembers?.length) {
        setPendingMembers(response.data.pendingMembers)
        setEvent(response.data.event)
      }
    } catch (error) {
      console.error('Error fetching pending members:', error)
    } finally {
      hideLoading()
    }
  }

  const confirmMembers = async (userIds: number[]) => {
    try {
      showLoading()
      const response = await axios.post(
        `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/confirm-members`,
        { userIds }
      )
      
      if (response?.data) {
        showSnackbar(`Đã duyệt ${userIds.length} thành viên thành công`, 'success')
        // Delay navigation to show snackbar
        setTimeout(() => {
          router.back()
        }, 1500)
      }
    } catch (error) {
      console.error('Error approving members:', error)
      showSnackbar('Không thể duyệt thành viên. Vui lòng thử lại.', 'error')
    } finally {
      hideLoading()
    }
  }

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 20 }} lightColor="#FFFCEE" darkColor="#2B2A27">
      <ThemedText type="title" style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, marginTop: 12 }}>
        Duyệt thành viên
      </ThemedText>
      
      <MembersList
        members={pendingMembers}
        eventName={event?.name}
        emptyTitle="Danh sách đang trống !"
        emptyDescription="Bạn sẽ nhận được thông báo khi có người đăng ký"
        actionButtonTitle="Duyệt"
        allActionButtonTitle="Duyệt tất cả"
        modalActionButtonTitle="Duyệt"
        onAction={confirmMembers}
      />
    </ThemedView>
  )
}