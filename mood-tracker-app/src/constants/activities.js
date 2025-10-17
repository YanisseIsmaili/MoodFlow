// src/constants/activities.js

// Correspond aux clés de l'énum ActivityEnum côté backend
export const ACTIVITY_KEYS = [
  'WORK',
  'STUDY',
  'EXERCISE',
  'FRIENDS',
  'FAMILY',
  'GAMING',
  'TVSHOWS',
  'MUSIC',
  'COOKING',
  'MEDITATION',
  'REST',
  'CREATIVITY'
];

export const ACTIVITIES = {
  WORK: { label_en: 'Work', label_fr: 'Travail', icon: '💼' },
  STUDY: { label_en: 'Study', label_fr: 'Études', icon: '📚' },
  EXERCISE: { label_en: 'Exercise', label_fr: 'Sport', icon: '🏃' },
  FRIENDS: { label_en: 'Friends', label_fr: 'Amis', icon: '👥' },
  FAMILY: { label_en: 'Family', label_fr: 'Famille', icon: '👨‍👩‍👧‍👦' },
  GAMING: { label_en: 'Gaming', label_fr: 'Jeux', icon: '🎮' },
  TVSHOWS: { label_en: 'TV Shows', label_fr: 'Séries', icon: '📺' },
  MUSIC: { label_en: 'Music', label_fr: 'Musique', icon: '🎵' },
  COOKING: { label_en: 'Cooking', label_fr: 'Cuisine', icon: '🍳' },
  MEDITATION: { label_en: 'Meditation', label_fr: 'Méditation', icon: '🧘' },
  REST: { label_en: 'Rest', label_fr: 'Repos', icon: '🛏️' },
  CREATIVITY: { label_en: 'Creativity', label_fr: 'Créativité', icon: '🎨' }
};

export const getActivityLabel = (key, lang = 'en') => {
  const act = ACTIVITIES[key];
  if (!act) return key;
  return lang === 'fr' ? `${act.icon} ${act.label_fr}` : `${act.icon} ${act.label_en}`;
};
