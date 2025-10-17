// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Moon, Sun, Bell, Trash2, Download, Upload, Save, ArrowLeft } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../utils/storageUtils';

const Settings = ({ onBack }) => {
  const [settings, setSettings] = useState(() => getFromStorage('appSettings', {
    language: 'en',
    theme: 'light',
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
    // Calculer les statistiques
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
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveToStorage('appSettings', newSettings);

    // Appliquer les changements immédiatement
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
        
        if (window.confirm('This will replace all your current data. Are you sure?')) {
          // Restaurer toutes les données
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

          alert('Data imported successfully! Reloading...');
          window.location.reload();
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ This will delete ALL your data permanently. Are you sure?')) {
      if (window.confirm('⚠️ Last chance! This action cannot be undone!')) {
        localStorage.clear();
        alert('All data cleared. Reloading...');
        window.location.reload();
      }
    }
  };

  const translations = {
    en: {
      title: 'Settings',
      subtitle: 'Customize your MoodTracker experience',
      language: 'Language',
      languageDesc: 'Choose your preferred language',
      theme: 'Theme',
      themeDesc: 'Choose your display theme',
      notifications: 'Notifications',
      notificationsDesc: 'Enable browser notifications',
      autoSave: 'Auto-save',
      autoSaveDesc: 'Automatically save your progress',
      stats: 'Statistics',
      statsDesc: 'Your activity summary',
      moods: 'Moods recorded',
      events: 'Calendar events',
      notes: 'Mood board notes',
      sessions: 'Pomodoro sessions',
      dataManagement: 'Data Management',
      export: 'Export Data',
      exportDesc: 'Download all your data',
      import: 'Import Data',
      importDesc: 'Restore from backup',
      clear: 'Clear All Data',
      clearDesc: 'Delete everything (dangerous)',
      back: 'Back to Dashboard',
      light: 'Light',
      dark: 'Dark'
    },
    fr: {
      title: 'Paramètres',
      subtitle: 'Personnalisez votre expérience MoodTracker',
      language: 'Langue',
      languageDesc: 'Choisissez votre langue préférée',
      theme: 'Thème',
      themeDesc: 'Choisissez votre thème d\'affichage',
      notifications: 'Notifications',
      notificationsDesc: 'Activer les notifications du navigateur',
      autoSave: 'Sauvegarde auto',
      autoSaveDesc: 'Sauvegarder automatiquement votre progression',
      stats: 'Statistiques',
      statsDesc: 'Résumé de votre activité',
      moods: 'Humeurs enregistrées',
      events: 'Événements calendrier',
      notes: 'Notes mood board',
      sessions: 'Sessions Pomodoro',
      dataManagement: 'Gestion des données',
      export: 'Exporter les données',
      exportDesc: 'Télécharger toutes vos données',
      import: 'Importer les données',
      importDesc: 'Restaurer depuis une sauvegarde',
      clear: 'Effacer toutes les données',
      clearDesc: 'Tout supprimer (dangereux)',
      back: 'Retour au tableau de bord',
      light: 'Clair',
      dark: 'Sombre'
    }
  };

  const t = translations[settings.language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{t.back}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-amber-900">{t.title}</h1>
              <p className="text-amber-600">{t.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-amber-900">{t.language}</h3>
                  <p className="text-sm text-amber-600 mt-1">{t.languageDesc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('language', 'en')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    settings.language === 'en'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => updateSetting('language', 'fr')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    settings.language === 'fr'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  🇫🇷 Français
                </button>
              </div>
            </div>
          </div>

          {/* Theme (Coming Soon) */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200 opacity-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Sun className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-amber-900">{t.theme}</h3>
                  <p className="text-sm text-amber-600 mt-1">{t.themeDesc} (Coming Soon)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Bell className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-amber-900">{t.notifications}</h3>
                  <p className="text-sm text-amber-600 mt-1">{t.notificationsDesc}</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`w-14 h-7 rounded-full transition-all ${
                  settings.notifications ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  settings.notifications ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
            <div className="flex items-start gap-3 mb-4">
              <SettingsIcon className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-xl font-bold text-amber-900">{t.stats}</h3>
                <p className="text-sm text-amber-600 mt-1">{t.statsDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.moodHistory}</div>
                <div className="text-sm text-amber-700 mt-1">{t.moods}</div>
              </div>
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.calendarEvents}</div>
                <div className="text-sm text-amber-700 mt-1">{t.events}</div>
              </div>
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{stats.moodBoardNotes}</div>
                <div className="text-sm text-amber-700 mt-1">{t.notes}</div>
              </div>
              <div className="bg-white/60 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.pomodoroSessions}</div>
                <div className="text-sm text-amber-700 mt-1">{t.sessions}</div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
            <div className="flex items-start gap-3 mb-4">
              <Save className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="text-xl font-bold text-amber-900">{t.dataManagement}</h3>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full flex items-center justify-between p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-blue-900">{t.export}</div>
                    <div className="text-sm text-blue-600">{t.exportDesc}</div>
                  </div>
                </div>
              </button>

              <label className="w-full flex items-center justify-between p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold text-green-900">{t.import}</div>
                    <div className="text-sm text-green-600">{t.importDesc}</div>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>

              <button
                onClick={clearAllData}
                className="w-full flex items-center justify-between p-4 bg-red-100 hover:bg-red-200 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-semibold text-red-900">{t.clear}</div>
                    <div className="text-sm text-red-600">{t.clearDesc}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;