// src/components/modals/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Save, Download, Upload, Trash2, X, BarChart } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';
import { useLanguage } from '../../contexts/LanguageContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState(() => getFromStorage('appSettings', {
    language: 'en',
    notifications: true,
    autoSave: true
  }));

  const [stats, setStats] = useState({
    moodHistory: 0,
    calendarEvents: 0,
    moodBoardNotes: 0,
    pomodoroSessions: 0
  });

  useEffect(() => {
    if (isOpen) {
      const moodHistory = getFromStorage('moodHistory', []);
      const calendarEvents = getFromStorage('calendarEvents', {});
      const moodBoardNotes = getFromStorage('moodBoardNotes', []);
      const pomodoroSessions = getFromStorage('pomodoroSessions', 0);

      const totalEvents = Object.values(calendarEvents).reduce((acc, events) => acc + events.length, 0);

      setStats({
        moodHistory: moodHistory.length,
        calendarEvents: totalEvents,
        moodBoardNotes: moodBoardNotes.length,
        pomodoroSessions: pomodoroSessions
      });
    }
  }, [isOpen]);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveToStorage('appSettings', newSettings);

    if (key === 'language') {
      window.dispatchEvent(new CustomEvent('languageChange', { detail: value }));
    }
  };

  const exportData = () => {
    const data = {
      moodHistory: getFromStorage('moodHistory', []),
      calendarEvents: getFromStorage('calendarEvents', {}),
      moodBoardNotes: getFromStorage('moodBoardNotes', []),
      todaysTasks: getFromStorage('todaysTasks', {}),
      leavesEarned: getFromStorage('leavesEarned', 0),
      pomodoroSessions: getFromStorage('pomodoroSessions', 0),
      settings: settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodtracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (window.confirm(t('confirmImport'))) {
          if (data.moodHistory) saveToStorage('moodHistory', data.moodHistory);
          if (data.calendarEvents) saveToStorage('calendarEvents', data.calendarEvents);
          if (data.moodBoardNotes) saveToStorage('moodBoardNotes', data.moodBoardNotes);
          if (data.todaysTasks) saveToStorage('todaysTasks', data.todaysTasks);
          if (data.leavesEarned) saveToStorage('leavesEarned', data.leavesEarned);
          if (data.pomodoroSessions) saveToStorage('pomodoroSessions', data.pomodoroSessions);
          if (data.settings) {
            setSettings(data.settings);
            saveToStorage('appSettings', data.settings);
          }

          alert(t('importSuccess'));
          window.location.reload();
        }
      } catch (error) {
        alert(t('importError'));
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm(t('confirmClear1'))) {
      if (window.confirm(t('confirmClear2'))) {
        localStorage.clear();
        alert(t('clearSuccess'));
        window.location.reload();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-7 h-7" />
            <h2 className="text-2xl font-bold">{t('settings')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Language */}
          <div className="bg-white/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-amber-900">{t('language')}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateSetting('language', 'en')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  settings.language === 'en'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => updateSetting('language', 'fr')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  settings.language === 'fr'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                🇫🇷 Français
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/60 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-bold text-amber-900">{t('notifications')}</div>
                  <div className="text-xs text-amber-600">{t('notificationsDesc')}</div>
                </div>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.notifications ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white/60 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart className="w-5 h-5 text-green-600" />
              <span className="font-bold text-amber-900">{t('stats')}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.moodHistory}</div>
                <div className="text-xs text-purple-700">{t('moods')}</div>
              </div>
              <div className="bg-blue-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.calendarEvents}</div>
                <div className="text-xs text-blue-700">{t('calendarEvents')}</div>
              </div>
              <div className="bg-green-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.moodBoardNotes}</div>
                <div className="text-xs text-green-700">{t('moodBoardNotes')}</div>
              </div>
              <div className="bg-orange-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.pomodoroSessions}</div>
                <div className="text-xs text-orange-700">{t('pomodoroSessions')}</div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white/60 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Save className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-amber-900">{t('dataManagement')}</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={exportData}
                className="w-full flex items-center gap-3 p-3 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all"
              >
                <Download className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">{t('export')}</span>
              </button>

              <label className="w-full flex items-center gap-3 p-3 bg-green-100 hover:bg-green-200 rounded-xl transition-all cursor-pointer">
                <Upload className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">{t('import')}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>

              <button
                onClick={clearAllData}
                className="w-full flex items-center gap-3 p-3 bg-red-100 hover:bg-red-200 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">{t('clear')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-amber-100 p-4 rounded-b-3xl border-t border-amber-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;