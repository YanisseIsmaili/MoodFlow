import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, Smile, Frown, Meh, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { MOOD_STATES, MOOD_LABELS } from '../../constants/moods';
import apiService from '../../services/api';

const MoodStatsModal = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    [MOOD_STATES.GREAT]: 0,
    [MOOD_STATES.GOOD]: 0,
    [MOOD_STATES.OK]: 0,
    [MOOD_STATES.MEH]: 0,
    [MOOD_STATES.BAD]: 0
  });
  const [period, setPeriod] = useState('month'); // week, month, year
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !user?.username) return;
    
    const loadStats = async () => {
      setLoading(true);
      try {
        // Charger les humeurs du mois actuel
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const monthDate = `${year}-${month}-01`;
        
        const moods = await apiService.getMoodsByUserAndMonth(user.username, monthDate);
        
        // Calculer les statistiques
        const newStats = {
          [MOOD_STATES.GREAT]: 0,
          [MOOD_STATES.GOOD]: 0,
          [MOOD_STATES.OK]: 0,
          [MOOD_STATES.MEH]: 0,
          [MOOD_STATES.BAD]: 0
        };
        
        moods.forEach(mood => {
          if (mood.state && newStats[mood.state] !== undefined) {
            newStats[mood.state]++;
          }
        });
        
        setStats(newStats);
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [isOpen, user?.username, period]);

  if (!isOpen) return null;

  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  
  const moodData = [
    { 
      state: MOOD_STATES.GREAT, 
      count: stats[MOOD_STATES.GREAT],
      color: '#10b981',
      emoji: '😄',
      label: language === 'fr' ? 'Excellent' : 'Great'
    },
    { 
      state: MOOD_STATES.GOOD, 
      count: stats[MOOD_STATES.GOOD],
      color: '#3b82f6',
      emoji: '😊',
      label: language === 'fr' ? 'Bien' : 'Good'
    },
    { 
      state: MOOD_STATES.OK, 
      count: stats[MOOD_STATES.OK],
      color: '#fbbf24',
      emoji: '😐',
      label: language === 'fr' ? 'Correct' : 'OK'
    },
    { 
      state: MOOD_STATES.MEH, 
      count: stats[MOOD_STATES.MEH],
      color: '#fb923c',
      emoji: '😕',
      label: language === 'fr' ? 'Bof' : 'Meh'
    },
    { 
      state: MOOD_STATES.BAD, 
      count: stats[MOOD_STATES.BAD],
      color: '#ef4444',
      emoji: '😞',
      label: language === 'fr' ? 'Mauvais' : 'Bad'
    }
  ].filter(item => item.count > 0);

  // Calculer les angles pour le camembert
  let currentAngle = -90;
  const segments = moodData.map(item => {
    const percentage = (item.count / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage: percentage.toFixed(1),
      startAngle,
      endAngle: currentAngle
    };
  });

  const PieChart = () => {
    const size = 300;
    const center = size / 2;
    const radius = size / 2 - 20;

    const polarToCartesian = (angle) => {
      const radian = (angle * Math.PI) / 180;
      return {
        x: center + radius * Math.cos(radian),
        y: center + radius * Math.sin(radian)
      };
    };

    const createArc = (startAngle, endAngle) => {
      const start = polarToCartesian(startAngle);
      const end = polarToCartesian(endAngle);
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    };

    return (
      <svg width={size} height={size} className="mx-auto">
        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={createArc(segment.startAngle, segment.endAngle)}
              fill={segment.color}
              stroke="white"
              strokeWidth="3"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          </g>
        ))}
        {/* Centre blanc */}
        <circle cx={center} cy={center} r={radius * 0.5} fill="white" />
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="text-3xl font-bold fill-amber-900"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          className="text-sm fill-amber-700"
        >
          {language === 'fr' ? 'humeurs' : 'moods'}
        </text>
      </svg>
    );
  };

  // Trouver l'humeur dominante
  const dominantMood = segments.reduce((prev, current) => 
    current.count > prev.count ? current : prev
  , segments[0] || { emoji: '😐', label: '-', percentage: 0 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'fr' ? 'Statistiques d\'Humeur' : 'Mood Statistics'}
                </h2>
                <p className="text-sm text-white/90">
                  {language === 'fr' ? 'Analyse de vos émotions' : 'Analysis of your emotions'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : total === 0 ? (
            <div className="text-center py-20">
              <Meh className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-700">
                {language === 'fr' ? 'Aucune humeur enregistrée' : 'No moods recorded'}
              </p>
              <p className="text-gray-500 mt-2">
                {language === 'fr' ? 'Commencez à suivre vos émotions !' : 'Start tracking your emotions!'}
              </p>
            </div>
          ) : (
            <>
              {/* Résumé rapide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{dominantMood.emoji}</div>
                    <div>
                      <p className="text-sm text-purple-700 font-semibold">
                        {language === 'fr' ? 'Humeur dominante' : 'Dominant mood'}
                      </p>
                      <p className="text-lg font-bold text-purple-900">{dominantMood.label}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-10 h-10 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-700 font-semibold">
                        {language === 'fr' ? 'Jours suivis' : 'Days tracked'}
                      </p>
                      <p className="text-lg font-bold text-blue-900">{total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border-2 border-amber-200">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-10 h-10 text-amber-600" />
                    <div>
                      <p className="text-sm text-amber-700 font-semibold">
                        {language === 'fr' ? 'Score positif' : 'Positive score'}
                      </p>
                      <p className="text-lg font-bold text-amber-900">
                        {((stats[MOOD_STATES.GREAT] + stats[MOOD_STATES.GOOD]) / total * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Camembert */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6">
                <PieChart />
              </div>

              {/* Légende détaillée */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-800 mb-4">
                  {language === 'fr' ? 'Répartition détaillée' : 'Detailed breakdown'}
                </h3>
                {segments.map((segment, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="text-2xl">{segment.emoji}</span>
                      <span className="font-semibold text-gray-800">{segment.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {segment.percentage}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {segment.count} {language === 'fr' ? 'jours' : 'days'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Barre de progression globale */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">
                    {language === 'fr' ? 'Bien-être général' : 'Overall wellbeing'}
                  </span>
                  <span className="text-sm font-bold text-green-700">
                    {((stats[MOOD_STATES.GREAT] + stats[MOOD_STATES.GOOD]) / total * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${((stats[MOOD_STATES.GREAT] + stats[MOOD_STATES.GOOD]) / total * 100)}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MoodStatsModal;