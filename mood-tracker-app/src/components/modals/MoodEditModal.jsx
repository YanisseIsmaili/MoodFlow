// src/components/modals/MoodEditModal.jsx
import React, { useState, useEffect } from 'react';
import { Heart, Calendar, X, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { MOOD_STATES } from '../../constants/moods';
import apiService from '../../services/api';

const MoodEditModal = ({ isOpen, onClose, date, moodHistory = [], setMoodHistory }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const moods = [
    { 
      id: MOOD_STATES.GREAT, 
      emoji: '😄', 
      label: language === 'fr' ? 'Excellent' : 'Great', 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    { 
      id: MOOD_STATES.GOOD, 
      emoji: '😊', 
      label: language === 'fr' ? 'Bien' : 'Good', 
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    { 
      id: MOOD_STATES.OK, 
      emoji: '😐', 
      label: language === 'fr' ? 'Correct' : 'OK', 
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    { 
      id: MOOD_STATES.MEH, 
      emoji: '😕', 
      label: language === 'fr' ? 'Bof' : 'Meh', 
      color: 'from-orange-400 to-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    { 
      id: MOOD_STATES.BAD, 
      emoji: '😞', 
      label: language === 'fr' ? 'Mauvais' : 'Bad', 
      color: 'from-red-400 to-red-500',
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
      // Convertir la date au format YYYY-MM-DD
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('🔍 Recherche humeur pour:', dateStr);
      console.log('📚 Dans historique:', moodHistory);
      
      const existingMood = moodHistory.find(m => m.date === dateStr);
      
      if (existingMood) {
        console.log('✅ Humeur trouvée:', existingMood);
        setSelectedMood(existingMood.state || existingMood.mood);
        setMoodNote(existingMood.description || existingMood.note || '');
        setSelectedActivities(existingMood.activities || []);
      } else {
        console.log('❌ Aucune humeur trouvée, réinitialisation');
        setSelectedMood(null);
        setMoodNote('');
        setSelectedActivities([]);
      }
    }
  }, [date, isOpen, moodHistory]);

  const handleSave = async () => {
    if (!selectedMood) {
      setError(language === 'fr' ? 'Veuillez sélectionner une humeur' : 'Please select a mood');
      return;
    }

    if (!user?.username) {
      setError(language === 'fr' ? 'Vous devez être connecté' : 'You must be logged in');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Convertir la date au format YYYY-MM-DD
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      console.log('💾 Sauvegarde humeur pour:', dateStr);

      const moodData = {
        date: dateStr,
        state: selectedMood,
        description: moodNote || undefined,
        username: user.username
      };

      // Envoyer à l'API
      await apiService.createMood(moodData);

      console.log('✅ Humeur sauvegardée dans la DB');

      // Mettre à jour l'historique local
      const newMoodEntry = {
        date: dateStr,
        state: selectedMood,
        description: moodNote,
        activities: selectedActivities,
        timestamp: new Date().toISOString()
      };

      const updatedHistory = moodHistory.filter(m => m.date !== dateStr);
      updatedHistory.unshift(newMoodEntry);
      
      if (setMoodHistory) {
        setMoodHistory(updatedHistory);
      }

      // Recharger la page après un court délai pour voir les changements
      setTimeout(() => {
        window.location.reload();
      }, 500);

      onClose();
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      setError(error.message || (language === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving mood'));
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
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl flex items-center justify-between z-10">
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
          {/* Erreur */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

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
                  💭 {language === 'fr' ? 'Que s\'est-il passé ?' : 'What happened?'}
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder={language === 'fr' ? 'Raconte ta journée...' : 'Tell us about your day...'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              {/* Activités */}
              <div className="animate-in slide-in-from-top">
                <label className="block text-purple-900 font-semibold mb-2">
                  ⚡ {language === 'fr' ? 'Qu\'as-tu fait ?' : 'What did you do?'}
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
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedMood || isLoading}
            className={`flex-2 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              selectedMood && !isLoading
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {language === 'fr' ? 'Enregistrement...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {language === 'fr' ? 'Enregistrer' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodEditModal;