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

export default function ConfirmedMembersScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const axios = useApi()
  const { showLoading, hideLoading } = useLoading()
  const { eventId } = useLocalSearchParams()

  // Theme colors
  const backgroundColor = useThemeColor({ light: '#FFFCEE', dark: '#2B2A27' }, 'background')
  const secondaryTextColor = useThemeColor({ light: '#8A8A8E', dark: '#999' }, 'text')

  const [event, setEvent] = useState<EventDto>()
  const [confirmedMembers, setConfirmedMembers] = useState<EventMember[]>([])
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
    fetchConfirmedMembers()
  }, [])

  const fetchConfirmedMembers = async () => {
    try {
      showLoading()
      const response = await axios.get(`${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/confirmed-members`)
      
      if (response?.data) {
        setConfirmedMembers(response.data.confirmedMembers)
        setEvent(response.data.event)
      }
    } catch (error) {
      console.error('Error fetching confirmed members:', error)
    } finally {
      hideLoading()
    }
  }

  const removeMembers = async (userIds: number[]) => {
    try {
      showLoading()
      const response = await axios.post(
        `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/remove-members`,
        { userIds }
      )
      
      if (response?.data) {
        showSnackbar(`Đã xóa ${userIds.length} thành viên thành công`, 'success')
        fetchConfirmedMembers()
      }
    } catch (error) {
      console.error('Error removing members:', error)
      showSnackbar('Không thể xóa thành viên. Vui lòng thử lại.', 'error')
    } finally {
      hideLoading()
    }
  }

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 20 }} lightColor="#FFFCEE" darkColor="#2B2A27">
      <ThemedText type="title" style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, marginTop: 12 }}>
        Danh sách thành viên
      </ThemedText>
      
      <MembersList
        members={confirmedMembers}
        eventName={event?.name}
        emptyTitle="Chưa có thành viên nào!"
        emptyDescription="Hãy mời thêm người tham gia chuyến đi"
        actionButtonTitle="Xóa"
        allActionButtonTitle="Xóa tất cả"
        modalActionButtonTitle="Xóa thành viên"
        onAction={removeMembers}
      />
    </ThemedView>
  )
}