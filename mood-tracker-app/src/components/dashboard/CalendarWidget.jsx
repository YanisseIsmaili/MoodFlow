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
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all relative ${
                day === selectedDay
                  ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold shadow-lg scale-110' 
                  : 'bg-amber-100/50 hover:bg-amber-200 text-amber-900'
              }`}
            >
              <span>{day}</span>
              {hasEvents && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-amber-100 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-amber-900">
            Events for {MONTH_NAMES[selectedMonth]} {selectedDay}
          </div>
          {selectedDayEvents.length > 0 && (
            <span className="text-xs bg-amber-300 text-amber-900 px-2 py-1 rounded-full">
              {selectedDayEvents.length}
            </span>
          )}
        </div>
        {selectedDayEvents.length > 0 ? (
          <div className="space-y-2">
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
        ) : (
          <div className="text-amber-700">No events scheduled</div>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;