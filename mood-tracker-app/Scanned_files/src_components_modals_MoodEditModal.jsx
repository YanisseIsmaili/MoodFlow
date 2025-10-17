// src/components/modals/MoodEditModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Heart, Calendar } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';
import { useLanguage } from '../../contexts/LanguageContext';

const MoodEditModal = ({ isOpen, onClose, date }) => {
  const { t, language } = useLanguage();
  const [moodHistory, setMoodHistory] = useState(() => getFromStorage('moodHistory', []));
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);

  const moods = [
    { 
      id: 'amazing', 
      emoji: '😄', 
      label: language === 'fr' ? 'Super Bien' : 'Amazing', 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    { 
      id: 'good', 
      emoji: '🙂', 
      label: language === 'fr' ? 'Bien' : 'Good', 
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    { 
      id: 'okay', 
      emoji: '😐', 
      label: language === 'fr' ? 'Normal' : 'Okay', 
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    { 
      id: 'sad', 
      emoji: '😔', 
      label: language === 'fr' ? 'Triste' : 'Sad', 
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    { 
      id: 'bad', 
      emoji: '😢', 
      label: language === 'fr' ? 'Mal' : 'Bad', 
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

  // Charger les données existantes pour cette date
  useEffect(() => {
    if (date && isOpen) {
      const existingMood = moodHistory.find(m => m.date === date);
      if (existingMood) {
        setSelectedMood(existingMood.mood);
        setMoodNote(existingMood.note || '');
        setSelectedActivities(existingMood.activities || []);
      } else {
        // Réinitialiser pour une nouvelle date
        setSelectedMood(null);
        setMoodNote('');
        setSelectedActivities([]);
      }
    }
  }, [date, isOpen, moodHistory]);

  const handleSave = () => {
    if (!selectedMood) {
      alert(language === 'fr' ? 'Veuillez sélectionner une humeur' : 'Please select a mood');
      return;
    }

    const newMoodEntry = {
      date: date,
      mood: selectedMood,
      note: moodNote,
      activities: selectedActivities,
      timestamp: new Date().toISOString()
    };

    // Supprimer l'ancienne entrée pour cette date si elle existe
    const updatedHistory = moodHistory.filter(m => m.date !== date);
    updatedHistory.unshift(newMoodEntry);
    
    // Garder seulement les 30 derniers jours
    const last30Days = updatedHistory.slice(0, 30);
    
    setMoodHistory(last30Days);
    saveToStorage('moodHistory', last30Days);
    
    // Fermer le modal
    onClose();
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(
      language === 'fr' ? 'fr-FR' : 'en-US',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  if (!isOpen || !date) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7" />
            <div>
              <h2 className="text-2xl font-bold">
                {language === 'fr' ? 'Modifier l\'humeur' : 'Edit Mood'}
              </h2>
              <p className="text-sm opacity-90 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(date)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sélection d'humeur */}
          <div>
            <h3 className="text-lg font-bold text-purple-900 mb-3">
              {language === 'fr' ? 'Comment te sentais-tu ?' : 'How were you feeling?'}
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {moods.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`${mood.bgColor} p-4 rounded-2xl transition-all duration-300 transform ${
                    selectedMood === mood.id
                      ? 'scale-110 ring-4 ring-purple-400 shadow-xl'
                      : 'hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-2">{mood.emoji}</div>
                    <div className={`font-semibold text-sm ${mood.textColor}`}>{mood.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <>
              {/* Note */}
              <div className="animate-in slide-in-from-top">
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
              <div className="animate-in slide-in-from-top">
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-purple-100 p-4 rounded-b-3xl border-t-2 border-purple-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
          >
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedMood}
            className={`flex-2 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              selectedMood
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            {language === 'fr' ? 'Enregistrer' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodEditModal;