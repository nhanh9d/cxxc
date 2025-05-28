// contexts/ConfigContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';

type Config = {
  fileUrl: string
};

const ConfigContext = createContext<Config | null>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const getConfig = async () => {
      const response = await axios.get<Config>(`${Constants.expoConfig?.extra?.apiUrl}/system-config/fe.config`);
      const data = response.data;

      setConfig(data);
    }

    getConfig();
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within an ConfigProvider');
  }

  return context;
};
