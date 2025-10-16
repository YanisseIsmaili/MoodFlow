// src/pages/Dashboard.jsx
import React, { useRef } from 'react';
import Header from '../components/layout/Header';
import MoodSelector from '../components/dashboard/MoodSelector';
import CurrentTime from '../components/dashboard/CurrentTime';
import MusicPlayer from '../components/dashboard/MusicPlayer';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import FocusTimer from '../components/dashboard/FocusTimer';
import QuickActions from '../components/dashboard/QuickActions';
import MoodBoard from '../components/dashboard/MoodBoard';
import CalendarWidget from '../components/dashboard/CalendarWidget';

const Dashboard = ({ onOpenSettings }) => {
  const moodBoardRef = useRef(null);
  const calendarRef = useRef(null);

  const scrollToMoodBoard = () => {
    moodBoardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-8">
      <Header onOpenSettings={onOpenSettings} />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Mood Selector - EN HAUT */}
        <MoodSelector />

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ligne 1 - Widgets principaux */}
          <CurrentTime />
          <MusicPlayer />
          <TodaysFocus />

          {/* Ligne 2 - Timer Focus et Actions rapides */}
          <div className="lg:col-span-2">
            <FocusTimer />
          </div>
          <QuickActions 
            onAddNote={scrollToMoodBoard}
            onAddEvent={scrollToCalendar}
          />

          {/* Ligne 3 - Mood Board */}
          <div ref={moodBoardRef} className="lg:col-span-3">
            <MoodBoard />
          </div>

          {/* Ligne 4 - Calendrier */}
          <div ref={calendarRef} className="lg:col-span-3">
            <CalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;