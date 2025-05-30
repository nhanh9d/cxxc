// contexts/ConfigContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';
import { useLoading } from './LoadingContext';

type Config = {
  fileUrl: string
};

const ConfigContext = createContext<Config | null>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const getConfig = async () => {
      showLoading();
      const response = await axios.get<Config>(`${Constants.expoConfig?.extra?.apiUrl}/system-config/fe.config`);
      setConfig(response.data);
      hideLoading();
    }
    getConfig();
  }, []);

  if (!config) return null;

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within an ConfigProvider');
  }

  return context;
};
