// src/components/dashboard/FocusTimer.jsx
import React from 'react';
import { Clock, Play, Pause, SkipForward, Coffee, Sunrise, RotateCcw } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../utils/dateUtils';

const FocusTimer = () => {
  const { 
    time, 
    isRunning, 
    autoStart, 
    sessions, 
    mode,
    toggle, 
    reset, 
    toggleAutoStart,
    startFocus,
    startShortBreak,
    startLongBreak,
    resetSessions
  } = useTimer();

  const getModeInfo = () => {
    switch(mode) {
      case 'focus':
        return { name: 'Focus Time', emoji: '🎯', color: 'from-orange-400 to-amber-500' };
      case 'short-break':
        return { name: 'Short Break', emoji: '☕', color: 'from-blue-400 to-blue-500' };
      case 'long-break':
        return { name: 'Long Break', emoji: '🌅', color: 'from-purple-400 to-purple-500' };
      default:
        return { name: 'Focus Time', emoji: '🎯', color: 'from-orange-400 to-amber-500' };
    }
  };

  const modeInfo = getModeInfo();
  const untilLongBreak = 4 - (sessions % 4);

  return (
    <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-amber-700">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Pomodoro Timer</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-700 text-sm">Sessions: {sessions}</span>
          <button
            onClick={resetSessions}
            className="text-amber-600 hover:text-amber-800"
            title="Reset sessions"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={startFocus}
          className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all ${
            mode === 'focus' 
              ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-lg' 
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          🎯 Focus
        </button>
        <button
          onClick={startShortBreak}
          className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all ${
            mode === 'short-break' 
              ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg' 
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          ☕ Short
        </button>
        <button
          onClick={startLongBreak}
          className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all ${
            mode === 'long-break' 
              ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg' 
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          🌅 Long
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="text-2xl mb-2">{modeInfo.emoji}</div>
        <div className="text-7xl font-bold text-amber-900 mb-2">
          {formatTime(time)}
        </div>
        <div className="text-amber-600">{modeInfo.name}</div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${modeInfo.color} transition-all duration-1000`}
            style={{ 
              width: `${100 - (time / (mode === 'focus' ? 1500 : mode === 'short-break' ? 300 : 900) * 100)}%` 
            }}
          ></div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={toggle}
          className={`bg-gradient-to-r ${modeInfo.color} text-white rounded-full p-4 hover:scale-110 transition-transform shadow-lg`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button
          onClick={reset}
          className="bg-amber-200 text-amber-800 rounded-full p-4 hover:bg-amber-300 transition-all shadow-lg"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-amber-100 rounded-2xl mb-4">
        <div>
          <div className="font-semibold text-amber-900">Auto-start next session</div>
          <div className="text-sm text-amber-600">Automatically begin after completion</div>
        </div>
        <button
          onClick={toggleAutoStart}
          className={`w-12 h-6 rounded-full transition-all ${
            autoStart ? 'bg-green-400' : 'bg-amber-300'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            autoStart ? 'translate-x-6' : 'translate-x-1'
          }`}></div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center text-sm text-amber-700">
        <div className="p-2 bg-amber-100/50 rounded-lg">
          <div className="font-semibold">Completed</div>
          <div className="text-lg font-bold text-amber-900">{sessions}</div>
        </div>
        <div className="p-2 bg-amber-100/50 rounded-lg">
          <div className="font-semibold">Until long break</div>
          <div className="text-lg font-bold text-amber-900">{untilLongBreak}</div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;