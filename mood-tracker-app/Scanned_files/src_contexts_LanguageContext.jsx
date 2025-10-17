// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Header
    septemberDashboard: "MoodFlow",
    septemberMornings: "Track your emotions and boost your wellbeing",
    
    // Current Time
    currentTime: "Current Time",
    feelsLike: "Feels like",
    wind: "Wind",
    humidity: "Humidity",
    weatherBy: "Weather by OpenWeatherMap",
    weatherUnavailable: "Weather unavailable",
    enableLocation: "Enable location or check internet connection",
    
    // Mood Selector
    moodQuestion: "How are you feeling today?",
    shareMood: "Share your mood of the day",
    amazing: "Amazing",
    good: "Good",
    okay: "Okay",
    sad: "Sad",
    difficult: "Bad",
    daysThisWeek: "days this week",
    whatHappening: "What's happening today?",
    tellUs: "Tell us about your day...",
    whatDidYouDo: "What did you do today?",
    saveMood: "Save my mood",
    addDetails: "Add details",
    save: "Save",
    lastMoods: "Last moods",
    iFeelGreat: "I feel",
    thankYouSharing: "Thanks for sharing your mood",
    
    // Music Player
    septemberVibes: "September Vibes",
    loading: "Loading...",
    selectMode: "Select Mode:",
    singleTracks: "Single Tracks",
    playlists: "Playlists",
    availablePlaylists: "Available Playlists:",
    playlistMode: "Playlist Mode",
    
    // Today's Focus
    todaysFocus: "Today's Focus",
    studyHours: "Study Hours",
    workInProgress: "Work in Progress",
    tasksCompleted: "Tasks Completed",
    septemberLeavesEarned: "September Leaves Earned",
    
    // Focus Timer
    pomodoroTimer: "Pomodoro Timer",
    sessions: "Sessions",
    resetSessions: "Reset sessions",
    focus: "Focus",
    short: "Short",
    long: "Long",
    focusTime: "Focus Time",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    autoStartNext: "Auto-start next session",
    autoStartDesc: "Automatically begin after completion",
    completed: "Completed",
    untilLongBreak: "Until long break",
    
    // Quick Actions
    quickActions: "Quick Actions",
    addMoodNote: "Add Mood Note",
    addCalendarEvent: "Add Calendar Event",
    openSettings: "Open Settings",
    motivateMe: "Motivate Me!",
    settingsSoon: "Settings panel coming soon!",
    
    // Mood Board
    interactiveMoodBoard: "Interactive Mood Board",
    notes: "notes",
    addNote: "Add Note",
    typeNote: "Type your note and press Enter...",
    noNotes: "No notes yet",
    addFirstNote: "Add your first note above!",
    dragTip: "Tip: Click and drag notes to move them",
    
    // Calendar
    addEvent: "Add Event",
    eventFor: "Add Event for",
    eventTitle: "Event title...",
    noEventsOrMood: "No events or mood recorded",
    legend: "Legend:",
    event: "Event",
    events: "events",
    mood: "Mood",
    
    // Settings
    settings: "Settings",
    settingsSubtitle: "Customize your MoodTracker experience",
    language: "Language",
    languageDesc: "Choose your preferred language",
    theme: "Theme",
    themeDesc: "Choose your display theme",
    comingSoon: "Coming Soon",
    notifications: "Notifications",
    notificationsDesc: "Enable browser notifications",
    stats: "Statistics",
    statsDesc: "Your activity summary",
    moods: "Moods recorded",
    calendarEvents: "Calendar events",
    moodBoardNotes: "Mood board notes",
    pomodoroSessions: "Pomodoro sessions",
    dataManagement: "Data Management",
    export: "Export Data",
    exportDesc: "Download all your data",
    import: "Import Data",
    importDesc: "Restore from backup",
    clear: "Clear All Data",
    clearDesc: "Delete everything (dangerous)",
    backToDashboard: "Back to Dashboard",
    confirmImport: "This will replace all your current data. Are you sure?",
    importSuccess: "Data imported successfully! Reloading...",
    importError: "Error importing data. Please check the file format.",
    confirmClear1: "⚠️ This will delete ALL your data permanently. Are you sure?",
    confirmClear2: "⚠️ Last chance! This action cannot be undone!",
    clearSuccess: "All data cleared. Reloading...",
    close: "Close",
    
    // Login
    loginSubtitle: "Track your emotions and boost your wellbeing",
    welcomeBack: "Welcome Back",
    email: "Email",
    emailPlaceholder: "Enter your email",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    login: "Sign In",
    loggingIn: "Signing in...",
    loginError: "Invalid email or password",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    loginFooter: "Your emotions matter",
    welcome: "Welcome",
    logout: "Logout",
    
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
    december: "December",
    
    // Activities
    work: "Work",
    study: "Study",
    exercise: "Exercise",
    friends: "Friends",
    family: "Family",
    gaming: "Gaming",
    tvShows: "TV Shows",
    music: "Music",
    cooking: "Cooking",
    meditation: "Meditation",
    rest: "Rest",
    creativity: "Creativity",
  },
  
  fr: {
    // Header
    septemberDashboard: "MoodFlow",
    septemberMornings: "Suivez vos émotions et améliorez votre bien-être",
    
    // Current Time
    currentTime: "Heure Actuelle",
    feelsLike: "Ressenti",
    wind: "Vent",
    humidity: "Humidité",
    weatherBy: "Météo par OpenWeatherMap",
    weatherUnavailable: "Météo indisponible",
    enableLocation: "Activez la localisation ou vérifiez votre connexion",
    
    // Mood Selector
    moodQuestion: "Comment te sens-tu aujourd'hui ?",
    shareMood: "Partage ton humeur du jour",
    amazing: "Super Bien",
    good: "Bien",
    okay: "Normal",
    sad: "Triste",
    difficult: "Mal",
    daysThisWeek: "jours cette semaine",
    whatHappening: "Que se passe-t-il aujourd'hui ?",
    tellUs: "Raconte-nous ta journée...",
    whatDidYouDo: "Qu'as-tu fait aujourd'hui ?",
    saveMood: "Enregistrer mon humeur",
    addDetails: "Ajouter des détails",
    save: "Enregistrer",
    lastMoods: "Dernières humeurs",
    iFeelGreat: "Je me sens",
    thankYouSharing: "Merci de partager ton humeur",
    
    // Music Player
    septemberVibes: "Ambiance Septembre",
    loading: "Chargement...",
    selectMode: "Sélectionner le mode :",
    singleTracks: "Morceaux Individuels",
    playlists: "Playlists",
    availablePlaylists: "Playlists disponibles :",
    playlistMode: "Mode Playlist",
    
    // Today's Focus
    todaysFocus: "Focus du Jour",
    studyHours: "Heures d'étude",
    workInProgress: "Travaux en cours",
    tasksCompleted: "Tâches terminées",
    septemberLeavesEarned: "Feuilles de Septembre Gagnées",
    
    // Focus Timer
    pomodoroTimer: "Minuteur Pomodoro",
    sessions: "Sessions",
    resetSessions: "Réinitialiser sessions",
    focus: "Focus",
    short: "Court",
    long: "Long",
    focusTime: "Temps de Focus",
    shortBreak: "Pause Courte",
    longBreak: "Pause Longue",
    autoStartNext: "Démarrage automatique",
    autoStartDesc: "Commencer automatiquement après la fin",
    completed: "Terminées",
    untilLongBreak: "avant pause longue",
    
    // Quick Actions
    quickActions: "Actions Rapides",
    addMoodNote: "Ajouter une Note",
    addCalendarEvent: "Ajouter un Événement",
    openSettings: "Paramètres",
    motivateMe: "Motive-moi !",
    settingsSoon: "Panneau de paramètres bientôt disponible !",
    
    // Mood Board
    interactiveMoodBoard: "Tableau d'Humeur Interactif",
    notes: "notes",
    addNote: "Ajouter Note",
    typeNote: "Tapez votre note et appuyez sur Entrée...",
    noNotes: "Aucune note pour le moment",
    addFirstNote: "Ajoutez votre première note ci-dessus !",
    dragTip: "Astuce : Cliquez et faites glisser les notes pour les déplacer",
    
    // Calendar
    addEvent: "Ajouter Événement",
    eventFor: "Ajouter événement pour",
    eventTitle: "Titre de l'événement...",
    noEventsOrMood: "Aucun événement ou humeur enregistré",
    legend: "Légende :",
    event: "Événement",
    events: "événements",
    mood: "Humeur",
    
    // Settings
    settings: "Paramètres",
    settingsSubtitle: "Personnalisez votre expérience MoodTracker",
    language: "Langue",
    languageDesc: "Choisissez votre langue préférée",
    theme: "Thème",
    themeDesc: "Choisissez votre thème d'affichage",
    comingSoon: "Bientôt disponible",
    notifications: "Notifications",
    notificationsDesc: "Activer les notifications du navigateur",
    stats: "Statistiques",
    statsDesc: "Résumé de votre activité",
    moods: "Humeurs enregistrées",
    calendarEvents: "Événements calendrier",
    moodBoardNotes: "Notes mood board",
    pomodoroSessions: "Sessions Pomodoro",
    dataManagement: "Gestion des données",
    export: "Exporter les données",
    exportDesc: "Télécharger toutes vos données",
    import: "Importer les données",
    importDesc: "Restaurer depuis une sauvegarde",
    clear: "Effacer toutes les données",
    clearDesc: "Tout supprimer (dangereux)",
    backToDashboard: "Retour au tableau de bord",
    confirmImport: "Cela remplacera toutes vos données actuelles. Êtes-vous sûr ?",
    importSuccess: "Données importées avec succès ! Rechargement...",
    importError: "Erreur lors de l'importation. Vérifiez le format du fichier.",
    confirmClear1: "⚠️ Cela supprimera TOUTES vos données définitivement. Êtes-vous sûr ?",
    confirmClear2: "⚠️ Dernière chance ! Cette action est irréversible !",
    clearSuccess: "Toutes les données ont été effacées. Rechargement...",
    close: "Fermer",
    
    // Login
    loginSubtitle: "Suivez vos émotions et améliorez votre bien-être",
    welcomeBack: "Bon Retour",
    email: "Email",
    emailPlaceholder: "Entrez votre email",
    password: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    login: "Se Connecter",
    loggingIn: "Connexion...",
    loginError: "Email ou mot de passe invalide",
    noAccount: "Pas de compte ?",
    signUp: "S'inscrire",
    loginFooter: "Vos émotions comptent",
    welcome: "Bienvenue",
    logout: "Déconnexion",
    
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
    december: "Décembre",
    
    // Activities
    work: "Travail",
    study: "Études",
    exercise: "Sport",
    friends: "Amis",
    family: "Famille",
    gaming: "Jeux",
    tvShows: "Séries",
    music: "Musique",
    cooking: "Cuisine",
    meditation: "Méditation",
    rest: "Repos",
    creativity: "Créativité",
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