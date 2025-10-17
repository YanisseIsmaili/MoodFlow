// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Edit, Settings, Sun, Moon, Coffee, LogOut, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';
import MoodStatsModal from '../modals/MoodStatsModal';
import { MOOD_STATES } from '../../constants/moods';
import apiService from '../../services/api';

const Header = ({ onOpenSettings }) => {
  const { t, language } = useLanguage();
  const { logout, user } = useAuth();
  const { setSidebarOpen } = useDashboard();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [moodScore, setMoodScore] = useState(0);
  const [dominantMood, setDominantMood] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger le score d'humeur (humeur dominante)
  useEffect(() => {
    if (!user?.username) return;
    
    const loadMoodScore = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const monthDate = `${year}-${month}-01`;
        
        const moods = await apiService.getMoodsByUserAndMonth(user.username, monthDate);
        
        // Calculer les statistiques par humeur
        if (moods.length > 0) {
          const stats = {
            [MOOD_STATES.GREAT]: 0,
            [MOOD_STATES.GOOD]: 0,
            [MOOD_STATES.OK]: 0,
            [MOOD_STATES.MEH]: 0,
            [MOOD_STATES.BAD]: 0
          };
          
          moods.forEach(mood => {
            if (mood.state && stats[mood.state] !== undefined) {
              stats[mood.state]++;
            }
          });
          
          // Trouver l'humeur la plus fréquente
          const maxMood = Object.entries(stats).reduce((prev, current) => 
            current[1] > prev[1] ? current : prev
          );
          
          // Calculer son pourcentage
          const percentage = (maxMood[1] / moods.length) * 100;
          setMoodScore(Math.round(percentage));
          setDominantMood(maxMood[0]);
        } else {
          setMoodScore(0);
          setDominantMood(null);
        }
      } catch (error) {
        console.error('❌ Erreur chargement score:', error);
        setMoodScore(0);
        setDominantMood(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadMoodScore();
    
    const handleFocus = () => loadMoodScore();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.username, isStatsOpen]);

  // Déterminer la couleur, l'icône et l'emoji selon l'humeur dominante
  const getScoreDisplay = () => {
    if (loading || !dominantMood) {
      return {
        color: 'from-gray-400 to-gray-500',
        icon: TrendingUp,
        emoji: '📊',
        pulse: false
      };
    }
    
    switch(dominantMood) {
      case MOOD_STATES.GREAT:
        return { color: 'from-green-400 to-emerald-500', icon: Sparkles, emoji: '😄', pulse: true };
      case MOOD_STATES.GOOD:
        return { color: 'from-blue-400 to-cyan-500', icon: TrendingUp, emoji: '😊', pulse: false };
      case MOOD_STATES.OK:
        return { color: 'from-yellow-400 to-amber-500', icon: TrendingUp, emoji: '😐', pulse: false };
      case MOOD_STATES.MEH:
        return { color: 'from-orange-400 to-orange-500', icon: TrendingUp, emoji: '😕', pulse: false };
      case MOOD_STATES.BAD:
        return { color: 'from-red-400 to-red-500', icon: TrendingUp, emoji: '😞', pulse: false };
      default:
        return { color: 'from-gray-400 to-gray-500', icon: TrendingUp, emoji: '📊', pulse: false };
    }
  };

  const scoreDisplay = getScoreDisplay();
  
  return (
    <>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 flex items-center gap-2">
              <Sun className="w-8 h-8 text-amber-600" />
              MoodFlow
              <Moon className="w-6 h-6 text-amber-500" />
            </h1>
            <p className="text-amber-700 mt-1 flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              {language === 'fr' ? 'Suivez vos émotions et améliorez votre bien-être' : 'Track your emotions and improve your wellbeing'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-amber-700 text-sm mr-2 font-medium">
                {language === 'fr' ? 'Bienvenue' : 'Welcome'}, {user.firstName || user.name}
              </div>
            )}
            
            {/* Bouton Stats avec état dynamique */}
            <button 
              onClick={() => setIsStatsOpen(true)}
              className={`
                relative group
                p-3 rounded-xl transition-all shadow-lg hover:scale-110
                bg-gradient-to-r ${scoreDisplay.color}
                ${scoreDisplay.pulse ? 'animate-pulse' : ''}
              `}
              title={language === 'fr' ? `Humeur dominante: ${moodScore}%` : `Dominant mood: ${moodScore}%`}
            >
              <div className="text-2xl">{scoreDisplay.emoji}</div>
              
              <div className="absolute -top-2 -right-2 bg-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-current group-hover:scale-110 transition-transform">
                <span className={`bg-gradient-to-r ${scoreDisplay.color} bg-clip-text text-transparent`}>
                  {loading ? '...' : `${moodScore}%`}
                </span>
              </div>

              {scoreDisplay.pulse && (
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              )}
            </button>
            
            {/* Bouton Édition avec icône crayon */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg hover:scale-105"
              title={language === 'fr' ? "Ouvrir le menu d'édition" : "Open edit menu"}
            >
              <Edit className="w-5 h-5 text-amber-700" />
            </button>
            
            <button 
              onClick={onOpenSettings}
              className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg hover:scale-105"
            >
              <Settings className="w-5 h-5 text-amber-700" />
            </button>
            
            <button 
              onClick={logout}
              className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg hover:scale-105"
              title={language === 'fr' ? 'Déconnexion' : 'Logout'}
            >
              <LogOut className="w-5 h-5 text-amber-700" />
            </button>
          </div>
        </div>
      </div>

      <MoodStatsModal 
        isOpen={isStatsOpen} 
        onClose={() => setIsStatsOpen(false)} 
      />
    </>
  );
};

export default Header;