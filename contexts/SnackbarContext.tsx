import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Snackbar, SnackbarType } from '@/components/ui/Snackbar'

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

interface SnackbarProviderProps {
  children: ReactNode
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{
    visible: boolean
    message: string
    type: SnackbarType
    duration?: number
  }>({ visible: false, message: '', type: 'info' })

  const showSnackbar = (message: string, type: SnackbarType = 'info', duration: number = 3000) => {
    setSnackbar({
      visible: true,
      message,
      type,
      duration
    })
  }

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, visible: false }))
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        onDismiss={hideSnackbar}
      />
    </SnackbarContext.Provider>
  )
}