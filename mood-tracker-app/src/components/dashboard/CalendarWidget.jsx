// src/components/dashboard/CalendarWidget.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utils/dateUtils';
import { MONTH_NAMES, DAY_NAMES } from '../../constants';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';

const CalendarWidget = () => {
  const [selectedMonth, setSelectedMonth] = useState(9); // October
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState(16);
  const [events, setEvents] = useState(() => getFromStorage('calendarEvents', {}));
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00');

  // Récupérer l'historique des humeurs
  const moodHistory = getFromStorage('moodHistory', []);

  useEffect(() => {
    saveToStorage('calendarEvents', events);
  }, [events]);

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

  // Récupérer l'humeur pour un jour donné
  const getMoodForDay = (day) => {
    const dateStr = new Date(selectedYear, selectedMonth, day).toDateString();
    return moodHistory.find(m => m.date === dateStr);
  };

  // Obtenir l'emoji et la couleur de l'humeur
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

  const selectedDayEvents = getDayEvents(selectedDay);
  const selectedDayMood = getMoodForDay(selectedDay);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
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
              {MONTH_NAMES[selectedMonth]} {selectedYear}
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
          onClick={() => setShowAddEvent(true)}
          className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {showAddEvent && (
        <div className="mb-4 p-4 bg-white rounded-xl border-2 border-amber-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-amber-900">
              Add Event for {MONTH_NAMES[selectedMonth]} {selectedDay}
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
            placeholder="Event title..."
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
            Add Event
          </button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {DAY_NAMES.map(day => (
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
          
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all relative ${
                day === selectedDay
                  ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold shadow-lg scale-110' 
                  : moodDisplay
                  ? `${moodDisplay.color} text-white hover:scale-105`
                  : 'bg-amber-100/50 hover:bg-amber-200 text-amber-900'
              }`}
            >
              <span className={moodDisplay ? 'text-lg font-bold' : ''}>{day}</span>
              
              {/* Emoji de l'humeur */}
              {moodDisplay && day !== selectedDay && (
                <span className="text-xl mt-1">{moodDisplay.emoji}</span>
              )}
              
              {/* Indicateur d'événements */}
              {hasEvents && (
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
            {MONTH_NAMES[selectedMonth]} {selectedDay}, {selectedYear}
          </div>
          {(selectedDayEvents.length > 0 || selectedDayMood) && (
            <span className="text-xs bg-amber-300 text-amber-900 px-2 py-1 rounded-full">
              {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}
              {selectedDayMood && ' • ' + (selectedDayMood.mood === 'amazing' ? 'Incroyable' : 
                                          selectedDayMood.mood === 'good' ? 'Bien' : 
                                          selectedDayMood.mood === 'okay' ? 'Correct' : 
                                          selectedDayMood.mood === 'sad' ? 'Triste' : 'Difficile')}
            </span>
          )}
        </div>

        {/* Afficher l'humeur du jour */}
        {selectedDayMood && (
          <div className="mb-4 p-3 bg-white rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getMoodDisplay(selectedDayMood.mood)?.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  Humeur : {selectedDayMood.mood === 'amazing' ? 'Incroyable' : 
                           selectedDayMood.mood === 'good' ? 'Bien' : 
                           selectedDayMood.mood === 'okay' ? 'Correct' : 
                           selectedDayMood.mood === 'sad' ? 'Triste' : 'Difficile'}
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

        {/* Afficher les événements */}
        {selectedDayEvents.length > 0 ? (
          <div className="space-y-2">
            <div className="font-semibold text-amber-900 text-sm">Événements :</div>
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
          <div className="text-amber-700">No events or mood recorded</div>
        )}
      </div>

      {/* Légende */}
      <div className="mt-4 pt-4 border-t border-amber-200">
        <div className="text-xs text-amber-700 font-semibold mb-2">Légende :</div>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-amber-700">Incroyable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-amber-700">Bien</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span className="text-amber-700">Correct</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span className="text-amber-700">Triste</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-amber-700">Difficile</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
            <span className="text-amber-700">Événement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;