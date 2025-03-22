import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  userId: number | undefined;
  setToken: (token: string | null) => void;
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

  useEffect(() => {
    if (token) {
      const json = atob(token.split(".")[1]);
      const user = JSON.parse(json) as userToken;
      setUserId(parseInt(user.sub));
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, userId, setToken }}>
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
