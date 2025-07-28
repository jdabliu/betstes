import React from 'react';

export interface UserSettings {
  defaultStake: number;
  lockStake: boolean;
  currency: string;
  timezone: string;
  notifications: boolean;
  autoCalculateEV: boolean;
}

const defaultSettings: UserSettings = {
  defaultStake: 100,
  lockStake: false,
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  notifications: true,
  autoCalculateEV: true
};

export const useSettings = () => {
  const [settings, setSettings] = React.useState<UserSettings>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('userSettings', JSON.stringify(updated));
  };

  return {
    settings,
    updateSettings
  };
};