import { IMessage } from 'react-native-gifted-chat'

export interface ChatRoom {
  id: number
  roomId: string
  name: string
  type: string
  memberCount: number
  lastMessage: any | null
  metadata: any
  createdAt: string
  updatedAt: string
}

export interface ChatRoomsResponse {
  rooms: ChatRoom[]
  limit: number
  page: number
  total: number
  totalPages: number
}

export interface ChatParticipant {
  id: string
  name: string
  age?: number
  avatar?: string
  isOnline?: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  message: string
  timestamp: string
  type?: 'text' | 'image' | 'voice'
}

// Server message payload for sending
export interface SendMessagePayload {
  roomId: number
  userId: number
  content: string
  metadata?: Record<string, any>
}

// Server response message format
export interface ServerMessage {
  _id?: string // Optional since server might not send it
  roomId: number
  userId: number
  content: string
  metadata?: Record<string, any>
  createdAt: string | Date
  updatedAt?: string | Date
  user?: {
    id: number
    username: string
    avatar?: string
  }
}

// Extended Gifted Chat message with room info
export interface ConversationMessage extends IMessage {
  roomId: string
  metadata?: Record<string, any>
}

// Typing indicator payload
export interface TypingPayload {
  roomId: number
  userId: number
  isTyping: boolean
}

// Socket events interface
export interface SocketEvents {
  connect: () => void
  disconnect: () => void
  message: (message: ServerMessage) => void
  messageReceived: (message: ServerMessage) => void
  userJoined: (data: { userId: string; roomId: string }) => void
  userLeft: (data: { userId: string; roomId: string }) => void
  typing: (data: TypingPayload) => void
  error: (error: any) => void
}

// API response for fetching messages
export interface MessagesApiResponse {
  messages: ServerMessage[]
  limit: number
  page: number
  total: number
  totalPages: number
}
