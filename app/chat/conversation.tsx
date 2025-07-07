import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  ActivityIndicator,
  useColorScheme
} from 'react-native'
import {
  GiftedChat,
  IMessage,
  User,
  Send,
  Bubble,
  InputToolbar,
  Composer,
  Actions,
  Message
} from 'react-native-gifted-chat'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { ThemedText } from '@/components/ui/ThemedText'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/contexts/ApiContext'
import SocketClient from '@/lib/SocketClient'
import {
  ServerMessage,
  SendMessagePayload,
  ConversationMessage,
  TypingPayload,
  MessagesApiResponse
} from '@/types/chat'
import { useNavigation } from '@react-navigation/native'
import { useThemeColor } from '@/hooks/useThemeColor'

// Constants
const COLORS = {
  primary: '#FF9500',
  background: '#FFFCEE',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#333333',
  lightGray: '#999999',
  border: '#E5E5EA',
  bubbleBorder: '#EEEEEF'
}

const SIZES = {
  borderRadius: {
    small: 12,
    medium: 20,
    large: 25,
    round: 22
  },
  padding: {
    small: 6,
    medium: 12,
    large: 16,
    extraLarge: 20
  },
  button: {
    small: 40,
    medium: 44
  },
  avatar: {
    small: 24
  }
}

export default function ConversationScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { token, userId } = useAuth()
  const api = useApi()
  const socketClient = useRef(SocketClient.getInstance())
  const colorScheme = useColorScheme()

  // Theme colors
  const backgroundColor = useThemeColor({ light: COLORS.background, dark: '#2B2A27' }, 'background')
  const textColor = useThemeColor({ light: COLORS.lightGray, dark: '#AAA' }, 'text')
  const inputToolbarBg = useThemeColor({ light: COLORS.white, dark: '#3A3A3A' }, 'background')
  const composerTextColor = useThemeColor({ light: COLORS.black, dark: COLORS.white }, 'text')
  const borderColor = useThemeColor({ light: COLORS.border, dark: '#4A4A4A' }, 'border')
  const leftBubbleBg = useThemeColor({ light: COLORS.white, dark: '#3A3A3A' }, 'background')
  const leftBubbleTextColor = useThemeColor({ light: COLORS.black, dark: COLORS.white }, 'text')
  const iconColor = useThemeColor({ light: COLORS.gray, dark: '#AAA' }, 'icon')
  const loadingOverlayBg = useThemeColor({ light: 'rgba(255, 252, 238, 0.9)', dark: 'rgba(43, 42, 39, 0.9)' }, 'background')

  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingEarlier, setLoadingEarlier] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const roomId = params.roomId as string
  const username = params.username as string
  const roomName = params.roomName as string

  const currentUser: User = {
    _id: Number(userId) || 1,
    name: 'You',
    avatar: undefined
  }

  // Fetch messages from API
  const fetchMessages = useCallback(
    async (page: number = 1, isLoadingMore: boolean = false) => {
      if (!api || !roomId) return

      try {
        if (isLoadingMore) {
          setLoadingEarlier(true)
        } else {
          setLoading(true)
        }

        const response = await api.get(`/chat/rooms/${roomId}/messages`, {
          params: {
            page,
            limit: 20 // Load messages in chunks
          }
        })

        const data = response.data as MessagesApiResponse

        // Convert server messages to Gifted Chat format
        const convertedMessages: ConversationMessage[] = data.messages.map(
          (serverMessage) => {
            const giftedMessage = SocketClient.convertToGiftedMessage(
              serverMessage
            ) as ConversationMessage
            giftedMessage.roomId = serverMessage.roomId.toString()
            return giftedMessage
          }
        )

        if (isLoadingMore) {
          // For load earlier: API returns older messages (newest to oldest)
          // We need to prepend them to the existing messages
          // Since GiftedChat expects newest first, we don't reverse here
          setMessages((prevMessages) => [
            ...prevMessages,
            ...convertedMessages
          ])
        } else {
          // For initial load: API returns messages newest to oldest
          // GiftedChat expects newest first, so no reverse needed
          setMessages(convertedMessages)
        }

        // Check if there are more messages to load
        setHasMoreMessages(page < data.totalPages)
        setCurrentPage(page)
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải tin nhắn')
      } finally {
        setLoading(false)
        setLoadingEarlier(false)
      }
    },
    [api, roomId]
  )

  // Load more messages (pagination)
  const onLoadEarlier = useCallback(() => {
    if (!loadingEarlier && hasMoreMessages) {
      fetchMessages(currentPage + 1, true)
    }
  }, [fetchMessages, currentPage, loadingEarlier, hasMoreMessages])

  // Initialize socket connection and fetch messages
  useEffect(() => {
    const initializeChat = async () => {
      if (!token || !roomId) return

      // First, fetch existing messages
      await fetchMessages(1, false)

      // Then initialize socket connection
      try {
        await socketClient.current.connect(token || undefined)

        // Join the room
        socketClient.current.joinRoom(roomId, Number(userId))

        // Listen for new messages
        socketClient.current.on(
          'new_message',
          (serverMessage: ServerMessage) => {
            const giftedMessage = SocketClient.convertToGiftedMessage(
              serverMessage
            ) as ConversationMessage
            
            // Set the roomId as string for the ConversationMessage interface
            giftedMessage.roomId = serverMessage.roomId.toString()

            console.log('Message positioning - Current User ID:', Number(userId), 'Message User ID:', giftedMessage.user._id, 'Will appear on:', giftedMessage.user._id === Number(userId) ? 'RIGHT' : 'LEFT')

            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [giftedMessage])
            )
          }
        )
      } catch (error) {
        Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server chat')
      }
    }

    initializeChat()

    // Cleanup: disconnect socket when leaving conversation
    return () => {
      socketClient.current.leaveRoom(roomId)
      socketClient.current.off('new_message')
      socketClient.current.off('typing')
      socketClient.current.off('userJoined')
      socketClient.current.off('userLeft')

      // Disconnect socket when leaving conversation
      socketClient.current.disconnect()
    }
  }, [roomId, currentUser._id, token, fetchMessages])

  const onSend = useCallback(
    (messages: IMessage[] = []) => {
      const message = messages[0]

      // Convert Gifted Chat message to server payload
      const payload: SendMessagePayload = SocketClient.convertToServerPayload(
        message,
        Number(roomId),
        Number(userId)
      )

      // Send via socket
      socketClient.current.sendMessage(payload)

    },
    [currentUser, roomId, userId]
  )

  const onInputTextChanged = useCallback(
    () => {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Send typing start
      socketClient.current.sendTyping(roomId, true, Number(userId))

      // Set timeout to send typing stop
      typingTimeoutRef.current = setTimeout(() => {
        socketClient.current.sendTyping(roomId, false, Number(userId))
      }, 1000)
    },
    [roomId, userId]
  )

  const renderBubble = (props: any) => {
    const { currentMessage, previousMessage, user } = props;
    const isLastInGroup = !previousMessage?.user || previousMessage.user._id !== currentMessage.user._id;
    const showName = isLastInGroup && currentMessage.user._id !== user._id;

    return (
      <View>
        {showName && currentMessage.user && (
          <ThemedText style={[styles.senderName, { color: textColor }]}>
            {currentMessage.user.name || 'Unknown'}
          </ThemedText>
        )}
        <Bubble
          {...props}
          wrapperStyle={{
            right: styles.rightBubble,
            left: [styles.leftBubble, { backgroundColor: leftBubbleBg, borderColor, marginLeft: 0 }]
          }}
          textStyle={{
            right: styles.rightBubbleText,
            left: [styles.leftBubbleText, { color: leftBubbleTextColor }]
          }}
        />
      </View>
    )
  }

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Image
            source={require('@/assets/images/send-icon.png')}
            style={styles.sendIcon}
          />
        </View>
      </Send>
    )
  }

  const renderComposer = (props: any) => {
    return (
      <Composer
        {...props}
        textInputStyle={[styles.composerTextInput, { color: composerTextColor, borderColor: COLORS.primary }]}
        placeholderTextColor={textColor}
        multiline={true}
        keyboardAppearance="light"
        placeholder="Aa"
      />
    )
  }

  const renderActions = () => {
    return (
      <Actions
        containerStyle={styles.actionsContainer}
        icon={() => (
          <Ionicons name="camera" size={28} color={iconColor} />
        )}
      />
    )
  }

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={[styles.inputToolbar, { backgroundColor: inputToolbarBg, borderTopColor: borderColor }]}
        primaryStyle={styles.inputPrimary}
        renderActions={renderActions}
        renderComposer={renderComposer}
        renderSend={renderSend}
      />
    )
  }

  const goBack = () => {
    router.back()
  }

  const goToChatDetail = () => {
    router.push({
      pathname: '/chat/detail',
      params: {
        roomId,
        roomName,
        username
      }
    })
  }

  const renderHeaderLeft = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={goBack} style={{ marginRight: 8 }}>
        <MaterialIcons name="chevron-left" size={24} color={COLORS.lightGray} />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={goToChatDetail}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
          }}
          style={styles.messageAvatar}
        />
        <ThemedText>{roomName}</ThemedText>
      </TouchableOpacity>
    </View>
  )


  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerLeft: renderHeaderLeft,
      headerTitle: '',
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0
      }
    })
  }, [navigation, goBack, backgroundColor, username])

  const renderLoadingOverlay = () => {
    if (!loading) return null
    
    return (
      <View style={[styles.loadingOverlay, { backgroundColor: loadingOverlayBg }]}>
        <ActivityIndicator 
          size="large" 
          color={COLORS.primary} 
        />
        <ThemedText style={[styles.loadingText, { color: iconColor }]}>
          Đang tải tin nhắn...
        </ThemedText>
      </View>
    )
  }

  const renderLoadEarlier = (props: any) => {
    return (
      <View style={styles.loadEarlierContainer}>
        <TouchableOpacity
          style={[styles.loadEarlierButton, { backgroundColor: leftBubbleBg, borderColor }]}
          onPress={props.onLoadEarlier}
          disabled={loadingEarlier}
        >
          {loadingEarlier ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <ThemedText style={styles.loadEarlierText}>
              Tải tin nhắn cũ hơn
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <GiftedChat
        renderTime={() => null}
        renderDay={() => {
          return (
            <View style={styles.dayContainer}>
              <ThemedText style={{ color: textColor }}>Hôm nay</ThemedText>
            </View>
          )
        }}
        renderMessage={(props) => <Message {...props} showUserAvatar={false} />}
        renderAvatar={() => null}
        messages={messages}
        onSend={onSend}
        onInputTextChanged={onInputTextChanged}
        user={currentUser}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        placeholder="Nhập tin nhắn..."
        alwaysShowSend
        isLoadingEarlier={loadingEarlier}
        infiniteScroll
        loadEarlier={hasMoreMessages}
        onLoadEarlier={onLoadEarlier}
        renderLoadEarlier={renderLoadEarlier}
        messagesContainerStyle={[styles.messagesContainer, { backgroundColor, paddingHorizontal: 10 }]}
        bottomOffset={0}
      />
      {renderLoadingOverlay()}
    </View>
  )
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1
  },
  messagesContainer: {
    flex: 1
  },

  // Header Styles
  messageAvatar: {
    width: SIZES.avatar.small,
    height: SIZES.avatar.small,
    borderRadius: SIZES.borderRadius.small,
    marginRight: 8
  },

  // Message Bubble Styles
  rightBubble: {
    backgroundColor: COLORS.primary,
    marginRight: 0,
    marginBottom: 4,
    borderTopRightRadius: SIZES.borderRadius.medium,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: SIZES.borderRadius.medium,
    borderBottomLeftRadius: SIZES.borderRadius.medium,
    padding: SIZES.padding.small
  },
  leftBubble: {
    marginLeft: 0,
    marginBottom: 4,
    borderWidth: 1,
    borderTopRightRadius: SIZES.borderRadius.medium,
    borderBottomRightRadius: SIZES.borderRadius.medium,
    borderTopLeftRadius: SIZES.borderRadius.medium,
    borderBottomLeftRadius: 4,
    padding: SIZES.padding.small
  },
  rightBubbleText: {
    color: COLORS.white,
    fontSize: 16
  },
  leftBubbleText: {
    fontSize: 16
  },
  senderName: {
    fontSize: 12,
    color: '#999',
    marginLeft: 0,
    marginBottom: 4,
    fontWeight: '500'
  },

  // Input Toolbar Styles
  inputToolbar: {
    paddingTop: 8,
    paddingHorizontal: SIZES.padding.extraLarge,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1
  },
  inputPrimary: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  actionsContainer: {
    marginLeft: 0,
    marginTop: 0
  },
  composerTextInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: SIZES.padding.large,
    paddingVertical: SIZES.padding.medium,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: SIZES.borderRadius.large,
    marginLeft: SIZES.padding.medium,
    maxHeight: 100,
    minHeight: 44
  },

  // Send Button Styles
  sendContainer: {
    marginBottom: 0,
    marginTop: 0,
    marginLeft: SIZES.padding.medium
  },
  sendButton: {
    width: SIZES.button.medium,
    height: SIZES.button.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius.round
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white
  },

  // Day Render Styles
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding.medium
  },

  // Loading Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  loadingText: {
    marginTop: SIZES.padding.medium,
    fontSize: 16
  },
  loadEarlierContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding.medium
  },
  loadEarlierButton: {
    paddingHorizontal: SIZES.padding.large,
    paddingVertical: SIZES.padding.small,
    borderRadius: SIZES.borderRadius.medium,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadEarlierText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500'
  },

  // Deprecated Styles (can be removed if not used elsewhere)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.large,
    paddingVertical: SIZES.padding.medium,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  backButton: {
    marginRight: SIZES.padding.medium,
    padding: 4
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black
  },
  typingIndicator: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
    marginTop: 2
  },
  menuButton: {
    marginLeft: SIZES.padding.medium,
    padding: 4
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 4,
    flex: 1
  },
  cameraButton: {
    width: SIZES.button.small,
    height: SIZES.button.small,
    borderRadius: SIZES.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 0,
    marginLeft: 0
  }
})
