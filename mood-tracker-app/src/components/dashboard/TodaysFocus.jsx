// src/components/dashboard/TodaysFocus.jsx
import React from 'react';
import { Target, Zap } from 'lucide-react';

const TodaysFocus = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Today's Focus</span>
        </div>
        <button className="text-amber-600 hover:text-amber-800">
          <Zap className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-amber-700">Study Hours</span>
            <span className="text-amber-900 font-semibold">+3 hour</span>
          </div>
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 w-3/4"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-amber-700">Work in Progress</span>
            <span className="text-amber-900 font-semibold">+1 task</span>
          </div>
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-1/2"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-amber-700">Tasks Completed</span>
            <span className="text-amber-900 font-semibold">+5 task</span>
          </div>
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-4/5"></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
          <div className="text-4xl">🎯</div>
          <div className="text-amber-900 font-bold text-2xl">11</div>
          <div className="text-amber-700 text-sm">September Leaves Earned</div>
        </div>
      </div>
    </div>
  );
};

export default TodaysFocus;