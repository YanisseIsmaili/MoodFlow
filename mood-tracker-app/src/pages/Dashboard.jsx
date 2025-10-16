// src/page/Dashboard.jsx
import React, { useRef, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Header from '../components/layout/Header';
import DraggableWidget from '../components/dashboard/DraggableWidget';
import WidgetSidebar from '../components/dashboard/WidgetSidebar';
import MoodSelector from '../components/dashboard/MoodSelector';
import CurrentTime from '../components/dashboard/CurrentTime';
import MusicPlayer from '../components/dashboard/MusicPlayer';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import FocusTimer from '../components/dashboard/FocusTimer';
import QuickActions from '../components/dashboard/QuickActions';
import MoodBoard from '../components/dashboard/MoodBoard';
import CalendarWidget from '../components/dashboard/CalendarWidget';

const Dashboard = ({ onOpenSettings }) => {
  const { widgets, editMode, WIDGET_TYPES, toggleWidget } = useDashboard();
  const moodBoardRef = useRef(null);
  const calendarRef = useRef(null);
  const [dragOverDashboard, setDragOverDashboard] = useState(false);

  const scrollToMoodBoard = () => {
    moodBoardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const visibleWidgets = widgets
    .filter(w => w.visible)
    .sort((a, b) => a.order - b.order);

  const handleDragOver = (e) => {
    if (!editMode) return;
    e.preventDefault();
    setDragOverDashboard(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverDashboard(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!editMode) return;

    const widgetId = e.dataTransfer.getData('widgetId');
    const source = e.dataTransfer.getData('source');
    
    if (widgetId && source === 'sidebar') {
      toggleWidget(widgetId);
    }
    
    setDragOverDashboard(false);
  };

  const renderWidget = (widgetId) => {
    switch(widgetId) {
      case WIDGET_TYPES.MOOD_SELECTOR:
        return <MoodSelector />;
      case WIDGET_TYPES.CURRENT_TIME:
        return <CurrentTime />;
      case WIDGET_TYPES.MUSIC_PLAYER:
        return <MusicPlayer />;
      case WIDGET_TYPES.TODAYS_FOCUS:
        return <TodaysFocus />;
      case WIDGET_TYPES.FOCUS_TIMER:
        return <FocusTimer />;
      case WIDGET_TYPES.QUICK_ACTIONS:
        return <QuickActions onAddNote={scrollToMoodBoard} onAddEvent={scrollToCalendar} />;
      case WIDGET_TYPES.MOOD_BOARD:
        return <MoodBoard />;
      case WIDGET_TYPES.CALENDAR:
        return <CalendarWidget />;
      default:
        return null;
    }
  };

  const getWidgetClass = (widgetId) => {
    if (widgetId === WIDGET_TYPES.FOCUS_TIMER) return 'lg:col-span-2';
    if (widgetId === WIDGET_TYPES.MOOD_SELECTOR || 
        widgetId === WIDGET_TYPES.MOOD_BOARD || 
        widgetId === WIDGET_TYPES.CALENDAR) return 'lg:col-span-3';
    return '';
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-8 pb-20"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Header onOpenSettings={onOpenSettings} />
      
      {editMode && (
        <div className="max-w-7xl mx-auto mb-4 p-4 bg-blue-500 text-white rounded-lg text-center font-semibold">
          <p className="text-lg">✏️ Mode Édition Actif</p>
          <p className="text-sm mt-1">
            Glissez carte sur carte pour réorganiser | Glissez vers menu → pour masquer
          </p>
        </div>
      )}

      {editMode && dragOverDashboard && (
        <div className="max-w-7xl mx-auto mb-4 p-8 bg-green-100 border-4 border-dashed border-green-500 rounded-lg text-center animate-pulse">
          <p className="text-2xl font-bold text-green-700">⬇️ Déposez ici pour afficher</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {visibleWidgets.map((widget) => (
            <div key={widget.id} className={getWidgetClass(widget.id)}>
              <DraggableWidget id={widget.id}>
                {renderWidget(widget.id)}
              </DraggableWidget>
            </div>
          ))}
        </div>

        {visibleWidgets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Aucune carte visible</p>
            <p className="text-gray-600">
              {editMode 
                ? "Glissez des cartes depuis le menu pour les afficher" 
                : "Cliquez sur l'espace vide d'une carte pour ouvrir le menu"}
            </p>
          </div>
        )}
      </div>

      <WidgetSidebar />
    </div>
  );
};

export default Dashboard;