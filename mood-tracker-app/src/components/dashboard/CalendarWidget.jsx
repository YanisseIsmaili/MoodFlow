// src/components/dashboard/CalendarWidget.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Edit, Lock } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utils/dateUtils';
import { MONTH_NAMES, DAY_NAMES } from '../../constants';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';
import { useLanguage } from '../../contexts/LanguageContext';
import MoodEditModal from '../modals/MoodEditModal';

const CalendarWidget = () => {
  const { t, language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(9); // October
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState(16);
  const [events, setEvents] = useState(() => getFromStorage('calendarEvents', {}));
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00');
  const [showMoodEditModal, setShowMoodEditModal] = useState(false);
  const [editingDate, setEditingDate] = useState(null);

  const moodHistory = getFromStorage('moodHistory', []);

  useEffect(() => {
    saveToStorage('calendarEvents', events);
  }, [events]);

  // Fonction pour vérifier si une date est dans le futur
  const isDateInFuture = (day) => {
    const selectedDate = new Date(selectedYear, selectedMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const emptyDays = Array(firstDay).fill(null);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getEventKey = (day) => {
    return `${selectedYear}-${selectedMonth}-${day}`;
  };

  const getDayEvents = (day) => {
    return events[getEventKey(day)] || [];
  };

  const getMoodForDay = (day) => {
    const dateStr = new Date(selectedYear, selectedMonth, day).toDateString();
    return moodHistory.find(m => m.date === dateStr);
  };

  const getMoodDisplay = (moodId) => {
    const moods = {
      amazing: { emoji: '😄', color: 'bg-green-400' },
      good: { emoji: '🙂', color: 'bg-blue-400' },
      okay: { emoji: '😐', color: 'bg-yellow-400' },
      sad: { emoji: '😔', color: 'bg-orange-400' },
      bad: { emoji: '😢', color: 'bg-red-400' }
    };
    return moods[moodId] || null;
  };

  const getMoodLabelForCalendar = (moodId) => {
    const labels = {
      en: {
        amazing: 'Amazing',
        good: 'Good',
        okay: 'Okay',
        sad: 'Sad',
        bad: 'Bad'
      },
      fr: {
        amazing: 'Super Bien',
        good: 'Bien',
        okay: 'Normal',
        sad: 'Triste',
        bad: 'Mal'
      }
    };
    return labels[language][moodId] || moodId;
  };

  const addEvent = () => {
    if (!newEventTitle.trim()) return;

    const eventKey = getEventKey(selectedDay);
    const newEvent = {
      id: Date.now(),
      title: newEventTitle,
      time: newEventTime
    };

    setEvents(prev => ({
      ...prev,
      [eventKey]: [...(prev[eventKey] || []), newEvent]
    }));

    setNewEventTitle('');
    setNewEventTime('10:00');
    setShowAddEvent(false);
  };

  const deleteEvent = (day, eventId) => {
    const eventKey = getEventKey(day);
    setEvents(prev => ({
      ...prev,
      [eventKey]: prev[eventKey].filter(e => e.id !== eventId)
    }));
  };

  // Gestion du double-clic pour éditer une humeur
  const handleDayDoubleClick = (day) => {
    // Empêcher l'édition des jours futurs
    if (isDateInFuture(day)) {
      alert(
        language === 'fr' 
          ? '⏰ Vous ne pouvez pas modifier une date future !' 
          : '⏰ You cannot edit a future date!'
      );
      return;
    }
    
    const date = new Date(selectedYear, selectedMonth, day);
    const dateStr = date.toDateString();
    setEditingDate(dateStr);
    setShowMoodEditModal(true);
  };

  // Gestion du simple clic
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const selectedDayEvents = getDayEvents(selectedDay);
  const selectedDayMood = getMoodForDay(selectedDay);

  // Traduire les mois et jours
  const monthNames = language === 'fr' ? [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ] : MONTH_NAMES;

  const dayNames = language === 'fr' ? 
    ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'] : 
    DAY_NAMES;

  return (
    <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="text-amber-700 hover:text-amber-900 text-2xl font-bold"
          >
            ‹
          </button>
          <div className="flex items-center gap-2 text-amber-700">
            <Calendar className="w-5 h-5" />
            <span className="font-bold text-xl">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
          </div>
          <button
            onClick={handleNextMonth}
            className="text-amber-700 hover:text-amber-900 text-2xl font-bold"
          >
            ›
          </button>
        </div>
        <button 
          onClick={() => {
            if (isDateInFuture(selectedDay)) {
              alert(
                language === 'fr' 
                  ? '⏰ Vous ne pouvez pas ajouter un événement à une date future !' 
                  : '⏰ You cannot add an event to a future date!'
              );
              return;
            }
            setShowAddEvent(true);
          }}
          className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('addEvent')}
        </button>
      </div>

      {/* Info tooltip */}
      <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800 flex items-center gap-2">
          <Edit className="w-4 h-4" />
          {language === 'fr' 
            ? '💡 Double-cliquez sur un jour passé ou présent pour modifier ou ajouter une humeur'
            : '💡 Double-click on a past or present day to edit or add a mood'
          }
        </p>
      </div>

      {showAddEvent && (
        <div className="mb-4 p-4 bg-white rounded-xl border-2 border-amber-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-amber-900">
              {t('eventFor')} {monthNames[selectedMonth]} {selectedDay}
            </h3>
            <button 
              onClick={() => setShowAddEvent(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder={t('eventTitle')}
            className="w-full px-3 py-2 border border-amber-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="time"
            value={newEventTime}
            onChange={(e) => setNewEventTime(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={addEvent}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {t('addEvent')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-amber-700 py-2">
            {day}
          </div>
        ))}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        {days.map(day => {
          const hasEvents = getDayEvents(day).length > 0;
          const dayMood = getMoodForDay(day);
          const moodDisplay = dayMood ? getMoodDisplay(dayMood.mood) : null;
          const isFuture = isDateInFuture(day);
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              onDoubleClick={() => handleDayDoubleClick(day)}
              disabled={isFuture}
              className={`group aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative ${
                isFuture
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : day === selectedDay
                  ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold shadow-lg scale-110 ring-2 ring-orange-600' 
                  : moodDisplay
                  ? `${moodDisplay.color} text-white hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:shadow-xl cursor-pointer`
                  : 'bg-amber-100/50 hover:bg-amber-200 text-amber-900 hover:scale-105 hover:shadow-md cursor-pointer'
              }`}
              title={
                isFuture 
                  ? (language === 'fr' ? 'Date future - non modifiable' : 'Future date - cannot edit')
                  : (language === 'fr' ? 'Double-cliquez pour modifier' : 'Double-click to edit')
              }
            >
              <span className={moodDisplay && !isFuture ? 'text-lg font-bold' : ''}>{day}</span>
              
              {moodDisplay && day !== selectedDay && !isFuture && (
                <span className="text-xl mt-1">{moodDisplay.emoji}</span>
              )}
              
              {/* Icône d'édition au survol - cachée pour les jours futurs */}
              {!isFuture && (
                <div className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  day === selectedDay ? 'text-white' : 'text-amber-700'
                }`}>
                  <Edit className="w-3 h-3 drop-shadow" />
                </div>
              )}
              
              {/* Icône de cadenas pour les jours futurs */}
              {isFuture && (
                <div className="absolute top-1 right-1 text-gray-400">
                  <Lock className="w-3 h-3" />
                </div>
              )}
              
              {hasEvents && !isFuture && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {getDayEvents(day).slice(0, 3).map((_, idx) => (
                    <div key={idx} className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-amber-100 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-amber-900">
            {monthNames[selectedMonth]} {selectedDay}, {selectedYear}
          </div>
          {(selectedDayEvents.length > 0 || selectedDayMood) && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-300 text-amber-900 px-2 py-1 rounded-full">
                {selectedDayEvents.length} {selectedDayEvents.length !== 1 ? t('events') : t('event')}
                {selectedDayMood && ' • ' + getMoodLabelForCalendar(selectedDayMood.mood)}
              </span>
              {!isDateInFuture(selectedDay) && (
                <button
                  onClick={() => handleDayDoubleClick(selectedDay)}
                  className="text-amber-600 hover:text-amber-800 transition-colors"
                  title={language === 'fr' ? 'Modifier l\'humeur' : 'Edit mood'}
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {selectedDayMood && (
          <div className="mb-4 p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getMoodDisplay(selectedDayMood.mood)?.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {t('mood')} : {getMoodLabelForCalendar(selectedDayMood.mood)}
                </div>
                {selectedDayMood.note && (
                  <p className="text-sm text-gray-600 mt-1">{selectedDayMood.note}</p>
                )}
                {selectedDayMood.activities && selectedDayMood.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedDayMood.activities.map((activity, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedDayEvents.length > 0 ? (
          <div className="space-y-2">
            <div className="font-semibold text-amber-900 text-sm">
              {language === 'fr' ? 'Événements :' : 'Events:'}
            </div>
            {selectedDayEvents.map(event => (
              <div 
                key={event.id}
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
              >
                <div>
                  <div className="font-medium text-amber-900">{event.title}</div>
                  <div className="text-sm text-amber-600">{event.time}</div>
                </div>
                <button
                  onClick={() => deleteEvent(selectedDay, event.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : !selectedDayMood && (
          <div className="text-amber-700 text-center py-4">
            {isDateInFuture(selectedDay) ? (
              <>
                <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>{language === 'fr' ? 'Date future' : 'Future date'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'fr' 
                    ? 'Vous pourrez ajouter une humeur ce jour-là' 
                    : 'You can add a mood on this day'}
                </p>
              </>
            ) : (
              <>
                <p>{t('noEventsOrMood')}</p>
                <button
                  onClick={() => handleDayDoubleClick(selectedDay)}
                  className="mt-2 text-sm text-amber-600 hover:text-amber-800 underline"
                >
                  {language === 'fr' ? 'Ajouter une humeur' : 'Add a mood'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-amber-200">
        <div className="text-xs text-amber-700 font-semibold mb-2">{t('legend')}:</div>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-amber-700">{t('amazing')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-amber-700">{t('good')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span className="text-amber-700">{t('okay')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span className="text-amber-700">{t('sad')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-amber-700">{t('difficult')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
            <span className="text-amber-700">{t('event')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-gray-400" />
            <span className="text-amber-700">{language === 'fr' ? 'Futur' : 'Future'}</span>
          </div>
        </div>
      </div>

      {/* Modal d'édition de l'humeur */}
      <MoodEditModal
        isOpen={showMoodEditModal}
        onClose={() => {
          setShowMoodEditModal(false);
          setEditingDate(null);
        }}
        date={editingDate}
      />
    </div>
  );
};

export default CalendarWidget;