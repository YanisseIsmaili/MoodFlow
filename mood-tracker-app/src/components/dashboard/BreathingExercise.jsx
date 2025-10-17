// src/components/dashboard/BreathingExercise.jsx
import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Settings, Sparkles } from 'lucide-react';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, rest
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(4);
  const [circleSize, setCircleSize] = useState(160);
  const [showSettings, setShowSettings] = useState(false);

  const [durations, setDurations] = useState({
    inhale: 10,
    hold: 20,
    exhale: 35,
    rest: 2
  });

  const [difficulty, setDifficulty] = useState('hard'); // easy, medium, hard

  const presets = {
    easy: { inhale: 4, hold: 4, exhale: 6, rest: 2 },
    medium: { inhale: 6, hold: 10, exhale: 12, rest: 2 },
    hard: { inhale: 10, hold: 20, exhale: 35, rest: 2 }
  };

  const applyPreset = (level) => {
    setDifficulty(level);
    setDurations(presets[level]);
    handleReset();
  };

  const phaseTexts = {
    inhale: { 
      fr: 'Inspire', 
      icon: '🌬️', 
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-200'
    },
    hold: { 
      fr: 'Retiens', 
      icon: '⏸️', 
      color: 'from-purple-400 to-indigo-400',
      bgColor: 'bg-purple-200'
    },
    exhale: { 
      fr: 'Expire', 
      icon: '💨', 
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-200'
    },
    rest: { 
      fr: 'Repos', 
      icon: '✨', 
      color: 'from-pink-400 to-rose-400',
      bgColor: 'bg-pink-200'
    }
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            const phases = ['inhale', 'hold', 'exhale', 'rest'];
            const currentIndex = phases.indexOf(phase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            
            if (nextPhase === 'inhale') {
              setCycle(prev => {
                const newCycle = prev + 1;
                if (newCycle >= totalCycles) {
                  setIsActive(false);
                  return 0;
                }
                return newCycle;
              });
            }
            
            setPhase(nextPhase);
            return durations[nextPhase];
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase, durations, totalCycles]);

  useEffect(() => {
    if (phase === 'inhale') {
      setCircleSize(240);
    } else if (phase === 'exhale') {
      setCircleSize(120);
    } else {
      setCircleSize(180);
    }
  }, [phase]);

  const handleStart = () => {
    setIsActive(true);
    if (cycle === 0) {
      setPhase('inhale');
      setCount(durations.inhale);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCycle(0);
    setPhase('inhale');
    setCount(durations.inhale);
    setCircleSize(160);
  };

  return (
    <div className="card">
      {/* Header - Style identique aux autres cartes */}
      <div className="card-header">
        <Wind className="w-5 h-5" />
        <span className="font-semibold">Exercice de Respiration</span>
        <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full ml-auto">
          10-20-35
        </span>
      </div>

      {/* Paramètres */}
      {showSettings && (
        <div className="mb-6 p-4 bg-amber-100/50 rounded-2xl border-2 border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-amber-900">Durées (secondes)</span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-amber-600 hover:text-amber-800"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(durations).map(key => (
              <div key={key} className="flex flex-col">
                <label className="text-xs text-amber-700 mb-1 capitalize">{key}</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={durations[key]}
                  onChange={(e) => setDurations({...durations, [key]: parseInt(e.target.value) || 1})}
                  className="input-field py-2 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs text-amber-700 mb-1 block">Nombre de cycles</label>
            <input
              type="number"
              min="1"
              max="10"
              value={totalCycles}
              onChange={(e) => setTotalCycles(parseInt(e.target.value) || 1)}
              className="input-field py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Cercle de respiration */}
      <div className="flex flex-col items-center justify-center mb-4 py-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Cercles animés */}
          <div
            className={`absolute rounded-full bg-gradient-to-br ${phaseTexts[phase].color} opacity-20 transition-all duration-1000 ease-in-out blur-xl`}
            style={{
              width: `${circleSize + 40}px`,
              height: `${circleSize + 40}px`,
            }}
          />
          <div
            className={`absolute rounded-full bg-gradient-to-br ${phaseTexts[phase].color} opacity-30 transition-all duration-1000 ease-in-out`}
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
            }}
          />
          
          {/* Contenu central */}
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-2">
              {phaseTexts[phase].icon}
            </div>
            <div className="text-6xl font-bold text-amber-900 mb-1">
              {count}
            </div>
            <div className={`text-lg font-bold ${phaseTexts[phase].bgColor} px-4 py-2 rounded-full text-amber-900`}>
              {phaseTexts[phase].fr}
            </div>
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Cycle {cycle + 1} / {totalCycles}
          </span>
          <span className="text-sm font-bold text-amber-600 bg-amber-200 px-3 py-1 rounded-full">
            {Math.round(((cycle + (phase === 'rest' ? 1 : 0.5)) / totalCycles) * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((cycle + (phase === 'rest' ? 1 : 0.5)) / totalCycles) * 100}%` }}
          />
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex gap-3">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            {cycle === 0 ? 'Commencer' : 'Reprendre'}
          </button>
        ) : (
          <button
            onClick={() => setIsActive(false)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="bg-amber-200 text-amber-700 p-3 rounded-xl font-bold hover:bg-amber-300 transition-all"
          title="Réinitialiser"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-amber-200 text-amber-700 p-3 rounded-xl font-bold hover:bg-amber-300 transition-all"
          title="Paramètres"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Message de fin */}
      {cycle === totalCycles && !isActive && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl text-center border-2 border-green-300">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-bold text-green-700">Bravo ! Exercice terminé</p>
          <p className="text-sm text-green-600 mt-1">Vous avez complété {totalCycles} cycles</p>
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;