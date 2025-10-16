// src/components/moods/MoodForm.jsx
import React, { useState } from 'react';
import { Calendar, MessageSquare, Save, X } from 'lucide-react';
import { MOOD_STATES, MOOD_LABELS, getAllMoodStates } from '../../constants/moods';
import apiService from '../../services/api';

const MoodForm = ({ isOpen, onClose, onMoodCreated, initialData = null }) => {
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    state: initialData?.state || '',
    description: initialData?.description || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const moodStates = getAllMoodStates();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.state) {
      setError('Veuillez sélectionner une humeur.');
      setIsLoading(false);
      return;
    }

    if (!formData.date) {
      setError('Veuillez sélectionner une date.');
      setIsLoading(false);
      return;
    }

    // Validation de la longueur de la description (max 1000 caractères selon le backend)
    if (formData.description && formData.description.length > 1000) {
      setError('La description ne peut pas dépasser 1000 caractères.');
      setIsLoading(false);
      return;
    }

    try {
      const moodData = {
        date: formData.date,
        state: formData.state,
        description: formData.description || undefined
      };

      await apiService.createMood(moodData);
      
      // Réinitialiser le formulaire
      setFormData({
        date: new Date().toISOString().split('T')[0],
        state: '',
        description: ''
      });

      // Notifier le composant parent
      if (onMoodCreated) {
        onMoodCreated();
      }

      // Fermer le modal
      onClose();

    } catch (error) {
      setError(error.message || 'Erreur lors de la création de l\'humeur.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            📝 Enregistrer mon humeur
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* État de l'humeur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Comment vous sentez-vous ?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodStates.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, state: mood.value })}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    formData.state === mood.value
                      ? `border-${mood.color}-500 bg-${mood.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Description (optionnelle)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Que s'est-il passé aujourd'hui ? Comment vous sentez-vous ?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
              maxLength="1000"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.description.length}/1000 caractères
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodForm;