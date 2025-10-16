// src/components/dashboard/CalendarWidget.jsx
import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utils/dateUtils';
import { MONTH_NAMES, DAY_NAMES } from '../../constants';

const CalendarWidget = () => {
  const [selectedMonth, setSelectedMonth] = useState(9); // October
  const [selectedYear, setSelectedYear] = useState(2025);

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
        <button className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAY_NAMES.map(day => (
          <div key={day} className="text-center font-semibold text-amber-700 py-2">
            {day}
          </div>
        ))}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        {days.map(day => (
          <div
            key={day}
            className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all ${
              day === 16 
                ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold shadow-lg scale-110' 
                : 'bg-amber-100/50 hover:bg-amber-200 text-amber-900'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-amber-100 rounded-2xl">
        <div className="font-semibold text-amber-900 mb-2">
          Events for {MONTH_NAMES[selectedMonth]} 16
        </div>
        <div className="text-amber-700">No events scheduled</div>
      </div>
    </div>
  );
};

export default CalendarWidget;