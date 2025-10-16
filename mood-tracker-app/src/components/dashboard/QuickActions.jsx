// src/components/dashboard/QuickActions.jsx
import React from 'react';
import { Zap, Plus, Calendar, Settings } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center gap-2 text-amber-700 mb-4">
        <Zap className="w-5 h-5" />
        <span className="font-semibold">Quick Actions</span>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Add Mood Note
        </button>
        <button className="w-full bg-gradient-to-r from-blue-300 to-indigo-300 text-blue-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          Add Calendar Event
        </button>
        <button className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
          <Settings className="w-5 h-5" />
          Open Settings
        </button>
        <button className="w-full bg-gradient-to-r from-green-300 to-emerald-300 text-green-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Motivate Me!
        </button>
      </div>
    </div>
  );
};

export default QuickActions;