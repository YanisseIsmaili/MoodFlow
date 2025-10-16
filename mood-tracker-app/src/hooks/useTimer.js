// src/hooks/useTimer.js
import { useState, useEffect } from 'react';
import { POMODORO_DURATION } from '../constants';

export const useTimer = (initialTime = POMODORO_DURATION) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [autoStart, setAutoStart] = useState(false);

  useEffect(() => {
    if (isRunning && time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
    
    if (time === 0) {
      setIsRunning(false);
      alert('Focus session completed! 🎉');
      if (autoStart) {
        reset();
        setIsRunning(true);
      }
    }
  }, [isRunning, time, autoStart]);

  const toggle = () => setIsRunning(!isRunning);
  
  const reset = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  const toggleAutoStart = () => setAutoStart(!autoStart);

  return {
    time,
    isRunning,
    autoStart,
    toggle,
    reset,
    toggleAutoStart
  };
};