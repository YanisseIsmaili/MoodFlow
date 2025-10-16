// src/pages/Dashboard.jsx
import React from 'react';
import Header from '../components/layout/Header';
import CurrentTime from '../components/dashboard/CurrentTime';
import MusicPlayer from '../components/dashboard/MusicPlayer';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import FocusTimer from '../components/dashboard/FocusTimer';
import QuickActions from '../components/dashboard/QuickActions';
import MoodBoard from '../components/dashboard/MoodBoard';
import CalendarWidget from '../components/dashboard/CalendarWidget';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-8">
      <Header />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ligne 1 - Widgets principaux */}
        <CurrentTime />
        <MusicPlayer />
        <TodaysFocus />

        {/* Ligne 2 - Timer Focus et Actions rapides */}
        <div className="lg:col-span-2">
          <FocusTimer />
        </div>
        <QuickActions />

        {/* Ligne 3 - Mood Board */}
        <div className="lg:col-span-3">
          <MoodBoard />
        </div>

        {/* Ligne 4 - Calendrier */}
        <div className="lg:col-span-3">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;