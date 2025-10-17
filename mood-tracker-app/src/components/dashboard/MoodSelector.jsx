// src/components/dashboard/MoodSelector.jsx
import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Heart, Zap, Save, X } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOOD_STATES, MOOD_LABELS } from '../../constants/moods';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const MoodSelector = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [moodNote, setMoodNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Utiliser les humeurs du backend avec les traductions
  const moods = [
    { 
      id: MOOD_STATES.GREAT, 
      emoji: MOOD_LABELS[MOOD_STATES.GREAT].emoji, 
      label: language === 'fr' ? MOOD_LABELS[MOOD_STATES.GREAT].label : 'Great', 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    { 
      id: MOOD_STATES.GOOD, 
      emoji: MOOD_LABELS[MOOD_STATES.GOOD].emoji, 
      label: language === 'fr' ? MOOD_LABELS[MOOD_STATES.GOOD].label : 'Good', 
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    { 
      id: MOOD_STATES.OK, 
      emoji: MOOD_LABELS[MOOD_STATES.OK].emoji, 
      label: language === 'fr' ? MOOD_LABELS[MOOD_STATES.OK].label : 'Okay', 
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    { 
      id: MOOD_STATES.MEH, 
      emoji: MOOD_LABELS[MOOD_STATES.MEH].emoji, 
      label: language === 'fr' ? MOOD_LABELS[MOOD_STATES.MEH].label : 'Meh', 
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    { 
      id: MOOD_STATES.BAD, 
      emoji: MOOD_LABELS[MOOD_STATES.BAD].emoji, 
      label: language === 'fr' ? MOOD_LABELS[MOOD_STATES.BAD].label : 'Bad', 
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    }
  ];

  const activities = language === 'fr' ? [
    '💼 Travail',
    '📚 Études',
    '🏃 Sport',
    '👥 Amis',
    '👨‍👩‍👧‍👦 Famille',
    '🎮 Jeux',
    '📺 Séries',
    '🎵 Musique',
    '🍳 Cuisine',
    '🧘 Méditation',
    '🛏️ Repos',
    '🎨 Créativité'
  ] : [
    '💼 Work',
    '📚 Study',
    '🏃 Exercise',
    '👥 Friends',
    '👨‍👩‍👧‍👦 Family',
    '🎮 Gaming',
    '📺 TV Shows',
    '🎵 Music',
    '🍳 Cooking',
    '🧘 Meditation',
    '🛏️ Rest',
    '🎨 Creativity'
  ];

  // Charger l'humeur du jour depuis l'API
  useEffect(() => {
    const loadTodayMood = async () => {
      if (!user) return;
      
      try {
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        const moods = await apiService.getMoodsByUserAndMonth(user.username, today);
        
        // Chercher l'humeur d'aujourd'hui
        const todayMoodEntry = moods.find(m => m.date === today);
        if (todayMoodEntry) {
          setTodayMood(todayMoodEntry.state);
          setMoodNote(todayMoodEntry.description || '');
          // Note: les activités ne sont pas dans le backend pour l'instant
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'humeur:', error);
      }
    };

    loadTodayMood();
  }, [user]);

  const handleMoodSelect = (moodId) => {
    setTodayMood(moodId);
    setShowDetails(true);
  };

  const handleSaveMood = async () => {
    if (!user) {
      setError('Vous devez être connecté pour sauvegarder votre humeur.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      const moodData = {
        date: today,
        state: todayMood,
        description: moodNote || undefined
      };

      await apiService.createMood(moodData);

      // Sauvegarder aussi localement pour l'historique (temporaire pour compatibilité CalendarWidget)
      const newMoodEntry = {
        date: today, // Format YYYY-MM-DD pour correspondre à l'API
        state: todayMood, // Utiliser 'state' comme dans l'API
        description: moodNote,
        mood: todayMood, // Garder aussi l'ancien format temporairement
        note: moodNote, // Garder aussi l'ancien format temporairement
        activities: selectedActivities,
        timestamp: new Date().toISOString()
      };

      const updatedHistory = moodHistory.filter(m => m.date !== today);
      updatedHistory.unshift(newMoodEntry);
      setMoodHistory(updatedHistory);
      saveToStorage('moodHistory', updatedHistory.slice(0, 30));
      
      setShowDetails(false);
    } catch (error) {
      setError(error.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const selectedMoodData = moods.find(m => m.id === todayMood);

  const getWeekStreak = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    });

    return last7Days.filter(date => 
      moodHistory.some(m => m.date === date)
    ).length;
  };

  const getMoodLabel = (moodId) => {
    const mood = moods.find(m => m.id === moodId);
    return mood ? mood.label : moodId;
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-6 shadow-2xl border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            {t('moodQuestion')}
          </h2>
          <p className="text-purple-600 text-sm mt-1">
            {t('shareMood')} 🌈
          </p>
        </div>
        
        {moodHistory.length > 0 && (
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-900">{getWeekStreak()}</div>
            <div className="text-xs text-purple-600">{t('daysThisWeek')}</div>
          </div>
        )}
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!todayMood ? (
        // Sélection d'humeur
        <div className="grid grid-cols-5 gap-3">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`${mood.bgColor} p-4 rounded-2xl hover:scale-110 transition-all duration-300 transform hover:shadow-xl group`}
            >
              <div className="text-center">
                <div className="text-5xl mb-2 group-hover:animate-bounce">{mood.emoji}</div>
                <div className={`font-semibold text-sm ${mood.textColor}`}>{mood.label}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Humeur sélectionnée
        <div>
          <div className={`bg-gradient-to-r ${selectedMoodData.color} rounded-2xl p-6 text-white mb-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedMoodData.emoji}</div>
                <div>
                  <div className="text-2xl font-bold">
                    {language === 'fr' 
                      ? `Je me sens ${selectedMoodData.label} !`
                      : `I feel ${selectedMoodData.label}!`
                    }
                  </div>
                  <div className="text-sm opacity-90">
                    {language === 'fr' 
                      ? 'Merci de partager ton humeur'
                      : 'Thanks for sharing your mood'
                    }
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setTodayMood(null);
                  setShowDetails(false);
                  setMoodNote('');
                  setSelectedActivities([]);
                }}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="space-y-4 animate-in slide-in-from-top">
              {/* Note */}
              <div>
                <label className="block text-purple-900 font-semibold mb-2">
                  💭 {t('whatHappening')}
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder={t('tellUs')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              {/* Activités */}
              <div>
                <label className="block text-purple-900 font-semibold mb-2">
                  ⚡ {t('whatDidYouDo')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {activities.map(activity => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedActivities.includes(activity)
                          ? `bg-gradient-to-r ${selectedMoodData.color} text-white shadow-lg scale-105`
                          : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton sauvegarder */}
              <button
                onClick={handleSaveMood}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {t('saveMood')}
              </button>
            </div>
          )}

          {!showDetails && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-200 transition-all"
              >
                {t('addDetails')}
              </button>
              <button
                onClick={handleSaveMood}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === 'fr' ? 'Sauvegarde...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('save')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Historique récent */}
      {moodHistory.length > 0 && !showDetails && (
        <div className="mt-4 pt-4 border-t-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-purple-900">{t('lastMoods')}</span>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {moodHistory.slice(0, 7).map((entry, index) => {
              const mood = moods.find(m => m.id === entry.mood);
              return (
                <div
                  key={index}
                  className={`${mood.bgColor} px-3 py-2 rounded-lg flex items-center gap-2 flex-shrink-0`}
                  title={new Date(entry.timestamp).toLocaleDateString(
                    language === 'fr' ? 'fr-FR' : 'en-US'
                  )}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className={`text-xs font-semibold ${mood.textColor}`}>
                    {new Date(entry.timestamp).toLocaleDateString(
                      language === 'fr' ? 'fr-FR' : 'en-US', 
                      { 
                        day: '2-digit', 
                        month: 'short' 
                      }
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;