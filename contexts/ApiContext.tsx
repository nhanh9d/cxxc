// contexts/ApiContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import api from '@/lib/axios';
import { useAuth } from './AuthContext';
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { removeToken } from "@/helpers/secureStore";

const ApiContext = createContext<AxiosInstance | null>(null);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      async (config) => {
        if (token) {
          // Kiểm tra token hết hạn
          try {
            const decoded: any = jwtDecode(token);
            if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
              throw new Error("Token expired");
            }
          } catch (e) {
            await removeToken();
            router.replace("/auth");
            throw new Error("Token invalid");
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          await removeToken();
          router.replace("/auth");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(interceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
