// src/components/layout/Header.jsx
import React from 'react';
import { Calendar, Target, Settings, Sun, Moon, Coffee } from 'lucide-react';

const Header = () => {
  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-amber-900 flex items-center gap-2">
            <Sun className="w-8 h-8 text-amber-600" />
            September Dashboard
            <Moon className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-amber-700 mt-1 flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            September mornings bring fresh starts
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg">
            <Calendar className="w-5 h-5 text-amber-700" />
          </button>
          <button className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg">
            <Target className="w-5 h-5 text-amber-700" />
          </button>
          <button className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg">
            <Settings className="w-5 h-5 text-amber-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header; 