// src/hooks/useTimer.js
import { useState, useEffect } from 'react';
import { POMODORO_DURATION, SHORT_BREAK, LONG_BREAK } from '../constants';
import { saveToStorage, getFromStorage } from '../utils/storageUtils';

export const useTimer = (initialTime = POMODORO_DURATION) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [sessions, setSessions] = useState(() => getFromStorage('pomodoroSessions', 0));
  const [mode, setMode] = useState('focus'); // 'focus', 'short-break', 'long-break'

  useEffect(() => {
    if (isRunning && time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
    
    if (time === 0 && isRunning) {
      setIsRunning(false);
      
      // Notification sonore
      playCompletionSound();
      
      if (mode === 'focus') {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        saveToStorage('pomodoroSessions', newSessions);
        
        // Afficher notification
        showNotification('Focus session completed! 🎉', 'Time for a break!');
        
        // Auto-start break
        if (autoStart) {
          if (newSessions % 4 === 0) {
            startLongBreak();
          } else {
            startShortBreak();
          }
        }
      } else {
        showNotification('Break completed! ⏰', 'Ready for another focus session?');
        
        if (autoStart) {
          startFocus();
        }
      }
    }
  }, [isRunning, time, autoStart, mode, sessions]);

  const playCompletionSound = () => {
    // Créer un son de notification simple
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '🎯' });
    } else {
      alert(`${title}\n${body}`);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggle = () => {
    if (!isRunning) {
      requestNotificationPermission();
    }
    setIsRunning(!isRunning);
  };
  
  const reset = () => {
    setTime(getTimeForMode(mode));
    setIsRunning(false);
  };

  const getTimeForMode = (newMode) => {
    switch(newMode) {
      case 'focus':
        return POMODORO_DURATION;
      case 'short-break':
        return SHORT_BREAK;
      case 'long-break':
        return LONG_BREAK;
      default:
        return POMODORO_DURATION;
    }
  };

  const startFocus = () => {
    setMode('focus');
    setTime(POMODORO_DURATION);
    setIsRunning(true);
  };

  const startShortBreak = () => {
    setMode('short-break');
    setTime(SHORT_BREAK);
    setIsRunning(true);
  };

  const startLongBreak = () => {
    setMode('long-break');
    setTime(LONG_BREAK);
    setIsRunning(true);
  };

  const toggleAutoStart = () => setAutoStart(!autoStart);

  const resetSessions = () => {
    setSessions(0);
    saveToStorage('pomodoroSessions', 0);
  };

  return {
    time,
    isRunning,
    autoStart,
    sessions,
    mode,
    toggle,
    reset,
    toggleAutoStart,
    startFocus,
    startShortBreak,
    startLongBreak,
    resetSessions
  };
};