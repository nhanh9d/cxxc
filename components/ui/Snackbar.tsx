import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'

export type SnackbarType = 'success' | 'error' | 'info'

interface SnackbarProps {
  message: string
  type?: SnackbarType
  duration?: number
  visible: boolean
  onDismiss: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  duration = 3000,
  visible,
  onDismiss,
  style,
  textStyle,
}) => {
  const translateY = useRef(new Animated.Value(100)).current
  
  // Theme colors
  const defaultBg = useThemeColor({ light: '#333', dark: '#FFF' }, 'background')
  const defaultText = useThemeColor({ light: '#FFF', dark: '#333' }, 'text')
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50'
      case 'error':
        return '#F44336'
      default:
        return defaultBg
    }
  }
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MaterialIcons name="check-circle" size={20} color="#FFF" />
      case 'error':
        return <MaterialIcons name="error" size={20} color="#FFF" />
      default:
        return <MaterialIcons name="info" size={20} color={type === 'info' ? defaultText : '#FFF'} />
    }
  }

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        hideSnackbar()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const hideSnackbar = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss()
    })
  }

  if (!visible && translateY._value === 100) {
    return null
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text
          style={[
            styles.message,
            { color: type === 'info' ? defaultText : '#FFF' },
            textStyle,
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
})