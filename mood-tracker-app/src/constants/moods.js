// src/constants/moods.js

// États des humeurs correspondant au backend
export const MOOD_STATES = {
  BAD: 'BAD',
  MEH: 'MEH', 
  OK: 'OK',
  GOOD: 'GOOD',
  GREAT: 'GREAT'
};

// Traductions et émojis pour l'interface
export const MOOD_LABELS = {
  [MOOD_STATES.BAD]: {
    label: 'Mauvais',
    emoji: '😞',
    color: 'red'
  },
  [MOOD_STATES.MEH]: {
    label: 'Bof',
    emoji: '😕',
    color: 'orange'
  },
  [MOOD_STATES.OK]: {
    label: 'Correct',
    emoji: '😐',
    color: 'yellow' 
  },
  [MOOD_STATES.GOOD]: {
    label: 'Bien',
    emoji: '😊',
    color: 'green'
  },
  [MOOD_STATES.GREAT]: {
    label: 'Excellent',
    emoji: '😄',
    color: 'emerald'
  }
};

// Fonction utilitaire pour valider un état d'humeur
export const isValidMoodState = (state) => {
  return Object.values(MOOD_STATES).includes(state);
};

// Fonction pour obtenir tous les états disponibles
export const getAllMoodStates = () => {
  return Object.entries(MOOD_LABELS).map(([state, info]) => ({
    value: state,
    ...info
  }));
};