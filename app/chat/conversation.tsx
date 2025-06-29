import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  ActivityIndicator
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

  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [loading, setLoading] = useState(true)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const roomId = params.roomId as string
  const username = params.username as string

  const currentUser: User = {
    _id: Number(userId) || 1,
    name: 'You',
    avatar: undefined
  }

  // Fetch messages from API
  const fetchMessages = useCallback(
    async () => {
      if (!api || !roomId) return

      try {
        setLoading(true)

        const response = await api.get(`/chat/rooms/${roomId}/messages`, {
          params: {
            page: 1,
            limit: 999 // Load all messages
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

        // Set initial messages (newest first)
        setMessages(convertedMessages)
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải tin nhắn')
      } finally {
        setLoading(false)
      }
    },
    [api, roomId]
  )

  // Initialize socket connection and fetch messages
  useEffect(() => {
    const initializeChat = async () => {
      if (!token || !roomId) return

      // First, fetch existing messages
      await fetchMessages()

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
    (text: string) => {
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
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.rightBubble,
          left: styles.leftBubble
        }}
        textStyle={{
          right: styles.rightBubbleText,
          left: styles.leftBubbleText
        }}
      />
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
        textInputStyle={styles.composerTextInput}
        placeholderTextColor="#999"
        multiline={true}
        keyboardAppearance="light"
        placeholder="Aa"
      />
    )
  }

  const renderActions = (props: any) => {
    return (
      <Actions
        containerStyle={styles.actionsContainer}
        icon={() => (
          <Ionicons name="camera" size={28} color="#333333" />
        )}
      />
    )
  }

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
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

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={goBack}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <MaterialIcons name="chevron-left" size={24} color={COLORS.lightGray} />
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
        }}
        style={styles.messageAvatar}
      />
      <ThemedText>{username}</ThemedText>
    </TouchableOpacity>
  )

  const backgroundColor = useThemeColor(
    { light: COLORS.background, dark: '#2B2A27' },
    'background'
  )
  const textColor = useThemeColor(
    { light: COLORS.lightGray, dark: '#2B2A27' }, 
    'text'
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
      <View style={styles.loadingOverlay}>
        <ActivityIndicator 
          size="large" 
          color={COLORS.primary} 
        />
        <ThemedText style={styles.loadingText}>
          Đang tải tin nhắn...
        </ThemedText>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
        messagesContainerStyle={styles.messagesContainer}
        bottomOffset={Platform.OS === 'ios' ? -33 : 0}
      />
      {renderLoadingOverlay()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  messagesContainer: {
    backgroundColor: COLORS.background
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
    marginRight: 8,
    marginBottom: 8,
    borderTopRightRadius: SIZES.borderRadius.medium,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: SIZES.borderRadius.medium,
    borderBottomLeftRadius: SIZES.borderRadius.medium,
    padding: SIZES.padding.small
  },
  leftBubble: {
    backgroundColor: COLORS.white,
    marginLeft: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.bubbleBorder,
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
    color: COLORS.black,
    fontSize: 16
  },

  // Input Toolbar Styles
  inputToolbar: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: SIZES.padding.extraLarge,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.border
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
    color: COLORS.black,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    backgroundColor: 'rgba(255, 252, 238, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  loadingText: {
    marginTop: SIZES.padding.medium,
    fontSize: 16,
    color: COLORS.gray
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
