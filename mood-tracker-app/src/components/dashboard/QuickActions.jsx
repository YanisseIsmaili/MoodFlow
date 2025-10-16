// src/components/dashboard/QuickActions.jsx
import React, { useState } from 'react';
import { Zap, Plus, Calendar, Settings } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const QuickActions = ({ onAddNote, onAddEvent }) => {
  const { t } = useLanguage();
  const [showMotivation, setShowMotivation] = useState(false);

  const motivationalQuotes = [
    "Believe you can and you're halfway there! 💪",
    "The only way to do great work is to love what you do. ❤️",
    "Don't watch the clock; do what it does. Keep going. ⏰",
    "Success is not final, failure is not fatal. 🚀",
    "The future depends on what you do today. 🌟",
    "Dream big, work hard, stay focused. 🎯",
    "You are capable of amazing things! ✨"
  ];

  
  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const handleMotivate = () => {
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 5000);
  };

  const handleSettings = () => {
    alert(`⚙️ ${t('settingsSoon')}`);
  };

  return (
    <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center gap-2 text-amber-700 mb-4">
        <Zap className="w-5 h-5" />
        <span className="font-semibold">{t('quickActions')}</span>
      </div>

      {showMotivation && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 animate-bounce">
          <p className="text-center text-green-800 font-semibold">
            {getRandomQuote()}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button 
          onClick={onAddNote}
          className="w-full bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('addMoodNote')}
        </button>
        
        <button 
          onClick={onAddEvent}
          className="w-full bg-gradient-to-r from-blue-300 to-indigo-300 text-blue-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          {t('addCalendarEvent')}
        </button>
        
        <button 
          onClick={handleSettings}
          className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2"
        >
          <Settings className="w-5 h-5" />
          {t('openSettings')}
        </button>
        
        <button 
          onClick={handleMotivate}
          className="w-full bg-gradient-to-r from-green-300 to-emerald-300 text-green-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {t('motivateMe')}
        </button>
      </div>
    </div>
  );
};

export default QuickActions;