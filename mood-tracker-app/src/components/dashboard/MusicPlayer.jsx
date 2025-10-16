// src/components/dashboard/MusicPlayer.jsx
import React, { useState } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Heart, Volume2, Zap } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Music className="w-5 h-5" />
          <span className="font-semibold">September Vibes</span>
        </div>
        <button className="text-amber-600 hover:text-amber-800">
          <Zap className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <Music className="w-8 h-8 text-white" />
          <div className="text-white">
            <div className="font-bold">Autumn Nights</div>
            <div className="text-sm opacity-90">Lo-fi September Mix</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs text-amber-600">
          <span>0:00</span>
          <span>4:32</span>
        </div>
        <div className="relative">
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 w-1/3"></div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button className="text-amber-700 hover:text-amber-900">
            <Heart className="w-5 h-5" />
          </button>
          <button className="text-amber-700 hover:text-amber-900">
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-full p-4 hover:scale-110 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button className="text-amber-700 hover:text-amber-900">
            <SkipForward className="w-5 h-5" />
          </button>
          <button className="text-amber-700 hover:text-amber-900">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;