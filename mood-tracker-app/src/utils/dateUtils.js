export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getDaysInMonth = (month, year) => {
  return new Array(new Date(year, month + 1, 0).getDate())
    .fill(null)
    .map((_, i) => i + 1);
};

export const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

export const formatDate = (date, options = {}) => {
  return new Date(date).toLocaleDateString('fr-FR', options);
};

export const getCurrentTime = () => {
  return new Date();
};