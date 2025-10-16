// src/components/dashboard/CurrentTime.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Sun } from 'lucide-react';

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center gap-2 text-amber-700 mb-4">
        <Clock className="w-5 h-5" />
        <span className="font-semibold">Current Time</span>
      </div>
      <div className="text-5xl font-bold text-amber-900 mb-2">
        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-amber-700 mb-4">
        {currentTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-amber-900">--°C</span>
        <Sun className="w-10 h-10 text-amber-500" />
      </div>
      <div className="text-sm text-amber-600 mt-1">Unavailable</div>
    </div>
  );
};

export default CurrentTime;