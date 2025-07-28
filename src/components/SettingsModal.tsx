import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSettings, UserSettings } from '../hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleChange = (key: keyof UserSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-96 max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Default Stake */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Default Stake</label>
            <div className="flex items-center">
              <span className="bg-slate-700 border border-slate-600 rounded-l p-3 text-gray-400">R$</span>
              <input
                type="number"
                step="0.01"
                value={localSettings.defaultStake}
                onChange={(e) => handleChange('defaultStake', parseFloat(e.target.value) || 0)}
                className="flex-1 bg-slate-700 border border-slate-600 border-l-0 rounded-r p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Lock Stake */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-400 text-sm">Lock Stake</label>
              <p className="text-xs text-gray-500">Always use default stake amount</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.lockStake}
                onChange={(e) => handleChange('lockStake', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Currency</label>
            <select
              value={localSettings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="BRL">Brazilian Real (R$)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-400 text-sm">Notifications</label>
              <p className="text-xs text-gray-500">Receive bet result notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Auto Calculate EV */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-400 text-sm">Auto Calculate EV</label>
              <p className="text-xs text-gray-500">Automatically calculate expected value</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoCalculateEV}
                onChange={(e) => handleChange('autoCalculateEV', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};