import { io, Socket } from 'socket.io-client'
import Constants from 'expo-constants'
import { IMessage } from 'react-native-gifted-chat'
import {
  SendMessagePayload,
  ServerMessage,
  SocketEvents,
  TypingPayload
} from '@/types/chat'

class SocketClient {
  private static instance: SocketClient
  private socket: Socket | null = null
  private isConnected: boolean = false
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private reconnectTimeout: NodeJS.Timeout | null = null

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  public connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.isConnected) {
        resolve()
        return
      }

      const socketUrl =
        Constants.expoConfig?.extra?.socketUrl || 'wss://api.cxxc.vn'

      this.socket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket'],
        reconnection: false // We'll handle reconnection manually
      })

      this.socket.on('connect', () => {
        this.isConnected = true
        this.reconnectAttempts = 0
        resolve()
      })

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false
        this.handleReconnect()
      })

      this.socket.on('connect_error', (error) => {
        this.isConnected = false
        reject(error)
        this.handleReconnect()
      })
    })
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    const delay = Math.pow(2, this.reconnectAttempts) * 1000 // Exponential backoff
    this.reconnectAttempts++

    this.reconnectTimeout = setTimeout(() => {
      if (this.socket && !this.isConnected) {
        this.socket.connect()
      }
    }, delay)
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.isConnected = false
    this.reconnectAttempts = 0
  }

  public joinRoom(roomId: string, userId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', { roomId: Number(roomId), userId })
    }
  }

  public leaveRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', { roomId: Number(roomId) })
    }
  }

  public sendMessage(payload: SendMessagePayload): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', payload)
    }
  }

  // Convert server message to Gifted Chat format
  public static convertToGiftedMessage(serverMessage: ServerMessage): IMessage {
    // Handle both legacy and new server response formats
    const messageId = serverMessage._id || serverMessage.id?.toString() || `${serverMessage.user?.id || 'unknown'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const userId = serverMessage.userId || serverMessage.user?.id || 0
    const userName = serverMessage.user?.fullname || serverMessage.user?.username || `User ${userId}`
    
    return {
      _id: messageId,
      text: serverMessage.content,
      createdAt: new Date(serverMessage.createdAt),
      user: {
        _id: userId,
        name: userName,
        avatar: serverMessage.user?.avatar
      },
      // Add custom properties for room info and metadata
      roomId: serverMessage.roomId,
      metadata: serverMessage.metadata
    } as IMessage & { roomId: number; metadata?: Record<string, any> }
  }

  // Convert Gifted Chat message to server payload
  public static convertToServerPayload(
    giftedMessage: IMessage,
    roomId: number,
    userId: number
  ): SendMessagePayload {
    return {
      roomId,
      userId,
      content: giftedMessage.text,
      metadata: {
        giftedChatId: giftedMessage._id,
        ...(giftedMessage as any).metadata
      }
    }
  }

  public sendTyping(roomId: string, isTyping: boolean, userId?: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { 
        roomId: Number(roomId), 
        isTyping,
        userId: userId || null
      })
    }
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  public isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }

  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  public getSocket(): Socket | null {
    return this.socket
  }

  // Utility method to send a simple text message
  public sendTextMessage(
    roomId: string,
    userId: number,
    content: string,
    metadata?: Record<string, any>
  ): void {
    const payload: SendMessagePayload = {
      roomId: Number(roomId),
      userId,
      content,
      metadata
    }
    this.sendMessage(payload)
  }

  // Utility method to check if connected and in a specific room
  public isInRoom(roomId: string): boolean {
    return this.isConnected && this.socket?.connected === true
  }

  // Test function to verify conversion with actual server message
  public static testConversion() {
    const serverMessage: ServerMessage = {
      content: "Một con vịt xoè ra hai cái cánh",
      createdAt: "2025-06-28T16:25:19.140Z",
      metadata: { test: "test" },
      roomId: 2,
      updatedAt: "2025-06-28T16:25:19.140Z",
      user: {
        avatar: "https://example.com/avatar.png",
        id: 42,
        username: "John Doe"
      },
      userId: 42
    }

    const giftedMessage = SocketClient.convertToGiftedMessage(serverMessage)
    return giftedMessage
  }
}

export default SocketClient
