// src/context/DashboardContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};

const WIDGET_TYPES = {
  MOOD_SELECTOR: 'mood-selector',
  CURRENT_TIME: 'current-time',
  MUSIC_PLAYER: 'music-player',
  TODAYS_FOCUS: 'todays-focus',
  FOCUS_TIMER: 'focus-timer',
  QUICK_ACTIONS: 'quick-actions',
  MOOD_BOARD: 'mood-board',
  CALENDAR: 'calendar'
};

const DEFAULT_WIDGETS = [
  { id: WIDGET_TYPES.MOOD_SELECTOR, visible: true, order: 0 },
  { id: WIDGET_TYPES.CURRENT_TIME, visible: true, order: 1 },
  { id: WIDGET_TYPES.MUSIC_PLAYER, visible: true, order: 2 },
  { id: WIDGET_TYPES.TODAYS_FOCUS, visible: true, order: 3 },
  { id: WIDGET_TYPES.FOCUS_TIMER, visible: true, order: 4 },
  { id: WIDGET_TYPES.QUICK_ACTIONS, visible: true, order: 5 },
  { id: WIDGET_TYPES.MOOD_BOARD, visible: true, order: 6 },
  { id: WIDGET_TYPES.CALENDAR, visible: true, order: 7 }
];

export const DashboardProvider = ({ children }) => {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboard-widgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wiggleWidget, setWiggleWidget] = useState(null);

  // Mode édition automatique quand le menu est ouvert
  const editMode = sidebarOpen;

  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidget = (id) => {
    setWidgets(prev => 
      prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w)
    );
  };

  const moveWidget = (draggedId, targetId) => {
    setWidgets(prev => {
      const draggedIndex = prev.findIndex(w => w.id === draggedId);
      const targetIndex = prev.findIndex(w => w.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const newWidgets = [...prev];
      const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
      newWidgets.splice(targetIndex, 0, draggedWidget);
      
      // Réorganiser les order
      return newWidgets.map((w, index) => ({ ...w, order: index }));
    });
  };

  const triggerWiggle = (id) => {
    setWiggleWidget(id);
    setTimeout(() => setWiggleWidget(null), 1000);
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
  };

  const value = {
    widgets,
    sidebarOpen,
    setSidebarOpen,
    wiggleWidget,
    editMode,
    toggleWidget,
    moveWidget,
    triggerWiggle,
    resetLayout,
    WIDGET_TYPES
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};