import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  ScrollView,
  Alert,
} from 'react-native'
import { ThemedText } from '@/components/ui/ThemedText'
import { MaterialIcons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { EventMember, EventMemberStatus } from '@/types/event'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { useConfig } from '@/contexts/ConfigContext'
import UserProfile from '@/components/profile/UserProfile'
import { useAuth } from '@/contexts/AuthContext'

export interface MembersListProps {
  members: EventMember[]
  eventName?: string
  emptyTitle?: string
  emptyDescription?: string
  actionButtonTitle?: string
  allActionButtonTitle?: string
  modalActionButtonTitle?: string
  onAction: (userIds: number[]) => Promise<void>
  onSingleAction?: (userId: number) => Promise<void>
}

export default function MembersList({
  members,
  eventName,
  emptyTitle = 'Danh sách đang trống !',
  emptyDescription = 'Không có thành viên nào',
  actionButtonTitle = 'Xử lý',
  allActionButtonTitle = 'Xử lý tất cả',
  modalActionButtonTitle = 'Xử lý',
  onAction,
  onSingleAction,
}: MembersListProps) {
  const config = useConfig()
  const { userId } = useAuth()

  // Theme colors
  const cardBackgroundColor = useThemeColor({ light: '#FFF', dark: '#3A3A3A' }, 'background')
  const borderColor = useThemeColor({ light: '#E5E5EA', dark: '#4A4A4A' }, 'border')
  const textColor = useThemeColor({ light: '#333', dark: '#FFF' }, 'text')
  const secondaryTextColor = useThemeColor({ light: '#8A8A8E', dark: '#999' }, 'text')
  const selectedBorderColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'icon')

  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set())
  const [selectedMember, setSelectedMember] = useState<EventMember | null>(null)
  const [showMemberModal, setShowMemberModal] = useState(false)

  const toggleMemberSelection = (memberId: number) => {
    const newSelected = new Set(selectedMembers)
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId)
    } else {
      newSelected.add(memberId)
    }
    setSelectedMembers(newSelected)
  }

  const openMemberDetail = (member: EventMember) => {
    setSelectedMember(member)
    setShowMemberModal(true)
  }

  const closeMemberModal = () => {
    setShowMemberModal(false)
    setSelectedMember(null)
  }

  const handleSingleAction = async () => {
    if (selectedMember && onSingleAction) {
      await onSingleAction(selectedMember.user.id!)
      closeMemberModal()
    } else if (selectedMember) {
      await onAction([selectedMember.user.id!])
      closeMemberModal()
    }
  }

  const handleSelectedAction = async () => {
    if (selectedMembers.size === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một thành viên')
      return
    }
    await onAction(Array.from(selectedMembers))
  }

  const handleAllAction = async () => {
    const allMemberIds = members
      .map(m => m.user.id)
      .filter(id => id !== undefined && id !== userId) as number[]
    await onAction(allMemberIds)
  }

  const formatTime = (member: EventMember) => {
    return member.registeredAt ? new Date(member.registeredAt).toLocaleString() : ''
  }

  const renderMember = ({ item }: { item: EventMember }) => {
    const isSelected = selectedMembers.has(item.user.id!)
    const isSelf = item.user.id === userId
    const profileImage = item.user.profileImages?.[0]
      ? item.user.profileImages[0].includes(config?.fileUrl)
        ? item.user.profileImages[0]
        : `${config?.fileUrl}/${item.user.profileImages[0]}`
      : null

    return (
      <View style={styles.memberRow}>
        <TouchableOpacity
          style={[
            styles.memberCard,
            {
              backgroundColor: cardBackgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
              marginRight: isSelf ? 0 : 12
            }
          ]}
          onPress={() => openMemberDetail(item)}
          activeOpacity={0.7}
        >
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/images/banner-placeholder.png')
            }
            style={styles.memberAvatar}
          />
          <View style={styles.memberInfo}>
            <View style={styles.memberTextContainer}>
              <ThemedText style={styles.memberName}>{item.user.fullname}</ThemedText>
              <ThemedText style={[styles.memberStatus, { color: secondaryTextColor }]}>
                {item.status === EventMemberStatus.REGISTERED ? 'đăng ký tham gia' :
                  item.status === EventMemberStatus.INVITED ? 'được mời tham gia' :
                    item.status === EventMemberStatus.CONFIRMED ? 'đã tham gia' :
                      'đã từ chối'}
              </ThemedText>
            </View>
            {eventName && (
              <ThemedText style={[styles.memberLocation, { color: textColor }]}>
                {eventName}
              </ThemedText>
            )}
            <ThemedText style={[styles.memberTime, { color: secondaryTextColor }]}>
              {formatTime(item)}
            </ThemedText>
          </View>
        </TouchableOpacity>
        {!isSelf && (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleMemberSelection(item.user.id!)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              {
                backgroundColor: isSelected ? selectedBorderColor : 'transparent',
                borderColor: isSelected ? selectedBorderColor : borderColor,
              }
            ]}>
              {isSelected && (
                <MaterialIcons name="check" size={18} color="white" />
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={[styles.emptyTitle, { color: secondaryTextColor }]}>
        {emptyTitle}
      </ThemedText>
      <ThemedText style={[styles.emptyDescription, { color: secondaryTextColor }]}>
        {emptyDescription}
      </ThemedText>
    </View>
  )

  // Sort members to put current user first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.user.id === userId) return -1
    if (b.user.id === userId) return 1
    return 0
  })

  return (
    <>
      {members.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <FlatList
            data={sortedMembers}
            renderItem={renderMember}
            keyExtractor={(item) => item.user.id?.toString() || ''}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.bottomContainer}>
            {selectedMembers.size > 0 && (
              <ThemedButton
                title={`${actionButtonTitle} ${selectedMembers.size} người đã chọn`}
                onPress={handleSelectedAction}
                style={styles.actionButton}
              />
            )}
            {selectedMembers.size === 0 && (<ThemedButton
              title={allActionButtonTitle}
              onPress={handleAllAction}
              style={styles.actionButton}
            />)}
          </View>
        </>
      )}

      {/* Member Detail Modal */}
      <Modal
        visible={showMemberModal}
        transparent
        animationType="slide"
        onRequestClose={closeMemberModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMemberModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}
            onPress={() => { }}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={closeMemberModal}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            {selectedMember && (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  <UserProfile user={selectedMember.user} />
                </ScrollView>

                <View style={[styles.fixedButtonContainer, { backgroundColor: cardBackgroundColor, borderTopColor: borderColor }]}>
                  <ThemedButton
                    title={modalActionButtonTitle}
                    onPress={handleSingleAction}
                    style={styles.actionButton}
                  />
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
  },
  checkboxContainer: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
  memberTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    flexShrink: 1,
  },
  memberStatus: {
    fontSize: 14,
    flexShrink: 1,
  },
  memberLocation: {
    fontSize: 14,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  memberTime: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomContainer: {
    paddingVertical: 20,
    paddingBottom: 34, // Safe area bottom
  },
  actionButton: {
    backgroundColor: '#FF9500',
    borderRadius: 100,
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 34, // Safe area
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Add space for fixed button
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34, // Safe area
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
})