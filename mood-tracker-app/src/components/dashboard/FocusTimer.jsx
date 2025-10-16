// src/components/dashboard/FocusTimer.jsx
import React from 'react';
import { Clock, Play, Pause, SkipForward } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../utils/dateUtils';

const FocusTimer = () => {
  const { time, isRunning, autoStart, toggle, reset, toggleAutoStart } = useTimer();

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-amber-700">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Focus Time</span>
        </div>
        <div className="text-amber-700 text-sm">Session: 0</div>
      </div>

      <div className="text-center mb-8">
        <div className="text-7xl font-bold text-amber-900 mb-2">
          {formatTime(time)}
        </div>
        <div className="text-amber-600">Focus Time</div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={toggle}
          className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-full p-4 hover:scale-110 transition-transform shadow-lg"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button
          onClick={reset}
          className="bg-amber-200 text-amber-800 rounded-full p-4 hover:bg-amber-300 transition-all shadow-lg"
        >
          <Clock className="w-6 h-6" />
        </button>
        <button className="bg-amber-200 text-amber-800 rounded-full p-4 hover:bg-amber-300 transition-all shadow-lg">
          <SkipForward className="w-6 h-6" />
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
        <div>
          <div className="font-semibold">00:00 elapsed</div>
        </div>
        <div>
          <div className="font-semibold">{formatTime(time)} remaining</div>
        </div>
      </div>

      <div className="text-center text-sm text-amber-600 mt-4">
        4 until long break
      </div>
    </div>
  );
};

export default FocusTimer;