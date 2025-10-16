// src/components/dashboard/MoodSelector.jsx
import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Heart, Zap, Save, X } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';
import { useLanguage } from '../../contexts/LanguageContext';

const MoodSelector = () => {
  const { t } = useLanguage();
  const [todayMood, setTodayMood] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [moodNote, setMoodNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [moodHistory, setMoodHistory] = useState(() => getFromStorage('moodHistory', []));

  const moods = [
    { 
      id: 'amazing', 
      emoji: '😄', 
      label: 'Incroyable', 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    { 
      id: 'good', 
      emoji: '🙂', 
      label: 'Bien', 
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    { 
      id: 'okay', 
      emoji: '😐', 
      label: 'Correct', 
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    { 
      id: 'sad', 
      emoji: '😔', 
      label: 'Triste', 
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    { 
      id: 'bad', 
      emoji: '😢', 
      label: 'Difficile', 
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    }
  ];

  const activities = [
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
  ];

  useEffect(() => {
    const today = new Date().toDateString();
    const savedMood = moodHistory.find(m => m.date === today);
    if (savedMood) {
      setTodayMood(savedMood.mood);
      setMoodNote(savedMood.note || '');
      setSelectedActivities(savedMood.activities || []);
    }
  }, []);

  const handleMoodSelect = (moodId) => {
    setTodayMood(moodId);
    setShowDetails(true);
  };

  const handleSaveMood = () => {
    const today = new Date().toDateString();
    const newMoodEntry = {
      date: today,
      mood: todayMood,
      note: moodNote,
      activities: selectedActivities,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = moodHistory.filter(m => m.date !== today);
    updatedHistory.unshift(newMoodEntry);
    
    // Garder seulement les 30 derniers jours
    const last30Days = updatedHistory.slice(0, 30);
    
    setMoodHistory(last30Days);
    saveToStorage('moodHistory', last30Days);
    setShowDetails(false);
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

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-6 shadow-2xl border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Comment te sens-tu aujourd'hui ?
          </h2>
          <p className="text-purple-600 text-sm mt-1">
            Partage ton humeur du jour 🌈
          </p>
        </div>
        
        {moodHistory.length > 0 && (
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-900">{getWeekStreak()}</div>
            <div className="text-xs text-purple-600">jours cette semaine</div>
          </div>
        )}
      </div>

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
                  <div className="text-2xl font-bold">Je me sens {selectedMoodData.label} !</div>
                  <div className="text-sm opacity-90">Merci de partager ton humeur</div>
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
                  💭 Que se passe-t-il aujourd'hui ?
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Raconte-nous ta journée..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              {/* Activités */}
              <div>
                <label className="block text-purple-900 font-semibold mb-2">
                  ⚡ Qu'as-tu fait aujourd'hui ?
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
                Enregistrer mon humeur
              </button>
            </div>
          )}

          {!showDetails && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-200 transition-all"
              >
                Ajouter des détails
              </button>
              <button
                onClick={handleSaveMood}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Enregistrer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Historique récent */}
      {moodHistory.length > 0 && !showDetails && (
        <div className="mt-4 pt-4 border-t-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-purple-900">Dernières humeurs</span>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {moodHistory.slice(0, 7).map((entry, index) => {
              const mood = moods.find(m => m.id === entry.mood);
              return (
                <div
                  key={index}
                  className={`${mood.bgColor} px-3 py-2 rounded-lg flex items-center gap-2 flex-shrink-0`}
                  title={new Date(entry.timestamp).toLocaleDateString('fr-FR')}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className={`text-xs font-semibold ${mood.textColor}`}>
                    {new Date(entry.timestamp).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
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