// src/utils/dateUtils.js

/**
 * Retourne le nombre de jours dans un mois donné
 * @param {number} month - Le mois (0-11, où 0 = janvier)
 * @param {number} year - L'année (ex: 2025)
 * @returns {number} Le nombre de jours dans ce mois
 */
export const getDaysInMonth = (month, year) => {
  // Créer une date au jour 0 du mois suivant = dernier jour du mois actuel
  const lastDay = new Date(year, month + 1, 0);
  return lastDay.getDate();
};

/**
 * Retourne le jour de la semaine du premier jour du mois
 * @param {number} month - Le mois (0-11)
 * @param {number} year - L'année
 * @returns {number} Le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
 */
export const getFirstDayOfMonth = (month, year) => {
  const firstDay = new Date(year, month, 1);
  return firstDay.getDay();
};

/**
 * Formate une date en chaîne lisible
 * @param {Date} date - La date à formater
 * @param {string} locale - La locale ('fr-FR' ou 'en-US')
 * @returns {string} La date formatée
 */
export const formatDate = (date, locale = 'fr-FR') => {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Vérifie si une date est aujourd'hui
 * @param {Date} date - La date à vérifier
 * @returns {boolean} True si c'est aujourd'hui
 */
export const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Vérifie si une date est dans le futur
 * @param {Date} date - La date à vérifier
 * @returns {boolean} True si la date est dans le futur
 */
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date > today;
};

/**
 * Obtient le nom du mois
 * @param {number} month - Le mois (0-11)
 * @param {string} locale - La locale
 * @returns {string} Le nom du mois
 */
export const getMonthName = (month, locale = 'fr-FR') => {
  const date = new Date(2000, month, 1);
  return date.toLocaleDateString(locale, { month: 'long' });
};

/**
 * Obtient le nom du jour de la semaine
 * @param {number} day - Le jour (0-6, où 0 = dimanche)
 * @param {string} locale - La locale
 * @returns {string} Le nom du jour
 */
export const getDayName = (day, locale = 'fr-FR') => {
  const date = new Date(2000, 0, 2 + day); // 2 janvier 2000 était un dimanche
  return date.toLocaleDateString(locale, { weekday: 'short' });
};

/**
 * Formate un temps en secondes vers format MM:SS
 * @param {number} seconds - Le nombre de secondes
 * @returns {string} Le temps formaté (ex: "25:00")
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};