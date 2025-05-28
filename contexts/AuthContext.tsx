import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface AuthContextType {
  token: string | null;
  userId: number | undefined;
  setToken: (token: string | null) => void;
  logout: () => void;
}

type userToken = {
  sub: string,
  fullname: string,
  iat: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const json = atob(token.split(".")[1]);
      const user = JSON.parse(json) as userToken;
      setUserId(parseInt(user.sub));
    }
  }, [token])

  const logout = async () => {
    setToken(null);
    setUserId(undefined);
    await AsyncStorage.removeItem("token");
    router.replace("/auth");
  }

  return (
    <AuthContext.Provider value={{ token, userId, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
