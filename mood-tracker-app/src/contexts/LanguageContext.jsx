// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Mood Selector
    moodQuestion: "How are you feeling today?",
    shareMood: "Share your mood of the day",
    amazing: "Amazing",
    good: "Good",
    okay: "Okay",
    sad: "Sad",
    difficult: "Difficult",
    daysThisWeek: "days this week",
    whatHappening: "What's happening today?",
    tellUs: "Tell us about your day...",
    whatDidYouDo: "What did you do today?",
    saveMood: "Save my mood",
    addDetails: "Add details",
    save: "Save",
    lastMoods: "Last moods",
    
    // Header
    septemberDashboard: "September Dashboard",
    septemberMornings: "September mornings bring fresh starts",
    
    // Current Time
    currentTime: "Current Time",
    clearSky: "Clear Sky",
    feelsLike: "Feels like",
    wind: "Wind",
    humidity: "Humidity",
    weatherBy: "Weather by OpenWeatherMap",
    weatherUnavailable: "Weather unavailable",
    enableLocation: "Enable location or check internet connection",
    
    // Music Player
    septemberVibes: "September Vibes",
    
    // Today's Focus
    todaysFocus: "Today's Focus",
    studyHours: "Study Hours",
    workInProgress: "Work in Progress",
    tasksCompleted: "Tasks Completed",
    septemberLeavesEarned: "September Leaves Earned",
    
    // Focus Timer
    focusTime: "Focus Time",
    session: "Session",
    autoStart: "Auto-start next session",
    autoStartDesc: "Automatically begin after completion",
    elapsed: "elapsed",
    remaining: "remaining",
    untilLongBreak: "until long break",
    pomodoroTimer: "Pomodoro Timer",
    sessions: "Sessions",
    focus: "Focus",
    shortBreak: "Short",
    longBreak: "Long",
    completed: "Completed",
    
    // Quick Actions
    quickActions: "Quick Actions",
    addMoodNote: "Add Mood Note",
    addCalendarEvent: "Add Calendar Event",
    openSettings: "Open Settings",
    motivateMe: "Motivate Me!",
    
    // Mood Board
    interactiveMoodBoard: "Interactive Mood Board",
    notes: "notes",
    addNote: "Add Note",
    typeNote: "Type your note and press Enter...",
    noNotes: "No notes yet",
    addFirstNote: "Add your first note above!",
    dragTip: "💡 Tip: Click and drag notes to move them",
    
    // Calendar
    addEvent: "Add Event",
    eventTitle: "Event title...",
    noEvents: "No events or mood recorded",
    legend: "Legend:",
    event: "Event",
    
    // Days
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    
    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December"
  },
  fr: {
    // Mood Selector
    moodQuestion: "Comment te sens-tu aujourd'hui ?",
    shareMood: "Partage ton humeur du jour",
    amazing: "Incroyable",
    good: "Bien",
    okay: "Correct",
    sad: "Triste",
    difficult: "Difficile",
    daysThisWeek: "jours cette semaine",
    whatHappening: "Que se passe-t-il aujourd'hui ?",
    tellUs: "Raconte-nous ta journée...",
    whatDidYouDo: "Qu'as-tu fait aujourd'hui ?",
    saveMood: "Enregistrer mon humeur",
    addDetails: "Ajouter des détails",
    save: "Enregistrer",
    lastMoods: "Dernières humeurs",
    
    // Header
    septemberDashboard: "Tableau de bord Septembre",
    septemberMornings: "Les matins de septembre apportent de nouveaux départs",
    
    // Current Time
    currentTime: "Heure Actuelle",
    clearSky: "Ciel Dégagé",
    feelsLike: "Ressenti",
    wind: "Vent",
    humidity: "Humidité",
    weatherBy: "Météo par OpenWeatherMap",
    weatherUnavailable: "Météo indisponible",
    enableLocation: "Activez la localisation ou vérifiez votre connexion",
    
    // Music Player
    septemberVibes: "Ambiance Septembre",
    
    // Today's Focus
    todaysFocus: "Focus du Jour",
    studyHours: "Heures d'étude",
    workInProgress: "Travaux en cours",
    tasksCompleted: "Tâches terminées",
    septemberLeavesEarned: "Feuilles de Septembre Gagnées",
    
    // Focus Timer
    focusTime: "Temps de Focus",
    session: "Session",
    autoStart: "Démarrage automatique",
    autoStartDesc: "Commencer automatiquement après la fin",
    elapsed: "écoulé",
    remaining: "restant",
    untilLongBreak: "avant pause longue",
    pomodoroTimer: "Minuteur Pomodoro",
    sessions: "Sessions",
    focus: "Focus",
    shortBreak: "Court",
    longBreak: "Long",
    completed: "Terminées",
    
    // Quick Actions
    quickActions: "Actions Rapides",
    addMoodNote: "Ajouter une Note",
    addCalendarEvent: "Ajouter un Événement",
    openSettings: "Paramètres",
    motivateMe: "Motive-moi !",
    
    // Mood Board
    interactiveMoodBoard: "Tableau d'Humeur Interactif",
    notes: "notes",
    addNote: "Ajouter Note",
    typeNote: "Tapez votre note et appuyez sur Entrée...",
    noNotes: "Aucune note pour le moment",
    addFirstNote: "Ajoutez votre première note ci-dessus !",
    dragTip: "💡 Astuce : Cliquez et faites glisser les notes pour les déplacer",
    
    // Calendar
    addEvent: "Ajouter Événement",
    eventTitle: "Titre de l'événement...",
    noEvents: "Aucun événement ou humeur enregistré",
    legend: "Légende :",
    event: "Événement",
    
    // Days
    sun: "Dim",
    mon: "Lun",
    tue: "Mar",
    wed: "Mer",
    thu: "Jeu",
    fri: "Ven",
    sat: "Sam",
    
    // Months
    january: "Janvier",
    february: "Février",
    march: "Mars",
    april: "Avril",
    may: "Mai",
    june: "Juin",
    july: "Juillet",
    august: "Août",
    september: "Septembre",
    october: "Octobre",
    november: "Novembre",
    december: "Décembre"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const settings = getFromStorage('appSettings', { language: 'en' });
    return settings.language;
  });

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};