// src/components/dashboard/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX, Zap, List } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const MusicPlayer = () => {
  const { t } = useLanguage();
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [usePlaylist, setUsePlaylist] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  // Playlists YouTube
  const playlists = [
    {
      name: 'My Custom Mix',
      playlistId: 'RDQMwbpzXXO29_k',
      thumbnail: 'https://img.youtube.com/vi/XDpoBc8t6gE/mqdefault.jpg'
    },
    {
      name: 'Lofi Hip Hop Radio',
      playlistId: 'PLOzDu-IDtnP7_jsksF25tKYz7vVWAUg5-',
      thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg'
    },
    {
      name: 'Chill Gaming Music',
      playlistId: 'PLYzdijVivW_SWvh2cuHOtS9_MGvpCYKje',
      thumbnail: 'https://img.youtube.com/vi/4xDzrJKXOOY/mqdefault.jpg'
    }
  ];

  const singleVideos = [
    {
      title: 'Lofi Study Session',
      artist: 'Lofi Girl',
      videoId: 'jfKfPfyJRdk',
      thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg'
    },
    {
      title: 'Jazz Cafe Ambience',
      artist: 'Coffee Shop Music',
      videoId: 'DSGyEsJ17cI',
      thumbnail: 'https://img.youtube.com/vi/DSGyEsJ17cI/mqdefault.jpg'
    },
    {
      title: 'Peaceful Piano',
      artist: 'Relaxing Piano',
      videoId: '8plwv25NYRo',
      thumbnail: 'https://img.youtube.com/vi/8plwv25NYRo/mqdefault.jpg'
    },
    {
      title: 'Study Music',
      artist: 'Focus Beats',
      videoId: '5qap5aO4i9A',
      thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg'
    }
  ];

  const [selectedPlaylist, setSelectedPlaylist] = useState(0);
  const currentPlaylist = playlists[selectedPlaylist];
  const currentSong = singleVideos[currentTrack];

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  }, []);

  const initPlayer = () => {
    const playerConfig = {
      height: '0',
      width: '0',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    };

    if (usePlaylist) {
      playerConfig.playerVars.listType = 'playlist';
      playerConfig.playerVars.list = currentPlaylist.playlistId;
    } else {
      playerConfig.videoId = currentSong.videoId;
    }

    const newPlayer = new window.YT.Player('youtube-player', playerConfig);
    setPlayer(newPlayer);
  };

  const onPlayerReady = (event) => {
    setIsReady(true);
    setDuration(event.target.getDuration());
    event.target.setVolume(volume);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      if (!usePlaylist) {
        handleNext();
      }
    }
  };

  useEffect(() => {
    if (!player || !isPlaying) return;

    const interval = setInterval(() => {
      if (player.getCurrentTime) {
        setCurrentTime(player.getCurrentTime());
        if (player.getDuration) {
          setDuration(player.getDuration());
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPlaying]);

  const switchMode = (toPlaylist) => {
    setUsePlaylist(toPlaylist);
    setIsReady(false);
    if (player && player.destroy) {
      player.destroy();
    }
    setTimeout(() => initPlayer(), 100);
  };

  const switchPlaylist = (index) => {
    setSelectedPlaylist(index);
    if (player && player.loadPlaylist) {
      player.loadPlaylist({
        listType: 'playlist',
        list: playlists[index].playlistId
      });
      setTimeout(() => player.playVideo(), 500);
    }
  };

  useEffect(() => {
    if (!usePlaylist && player && player.loadVideoById && isReady) {
      player.loadVideoById(currentSong.videoId);
      setDuration(0);
      setTimeout(() => {
        if (player.getDuration) {
          setDuration(player.getDuration());
        }
      }, 1000);
    }
  }, [currentTrack, player, usePlaylist, isReady]);

  useEffect(() => {
    if (player && player.setVolume) {
      player.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted, player]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleNext = () => {
    if (usePlaylist && player && player.nextVideo) {
      player.nextVideo();
    } else {
      setCurrentTrack((prev) => (prev + 1) % singleVideos.length);
    }
  };

  const handlePrev = () => {
    if (usePlaylist && player && player.previousVideo) {
      player.previousVideo();
    } else {
      setCurrentTrack((prev) => (prev - 1 + singleVideos.length) % singleVideos.length);
    }
  };

  const handleSeek = (e) => {
    if (!player || !player.seekTo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    player.seekTo(percentage * duration, true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const displayInfo = usePlaylist 
    ? { 
        title: currentPlaylist.name, 
        artist: 'YouTube Playlist',
        thumbnail: currentPlaylist.thumbnail 
      }
    : currentSong;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div id="youtube-player" style={{ display: 'none' }}></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Music className="w-5 h-5" />
          <span className="font-semibold">{t('septemberVibes')}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isReady && (
            <span className="text-xs text-amber-600 animate-pulse">{t('loading')}</span>
          )}
          <button 
            onClick={() => setShowPlaylistSelector(!showPlaylistSelector)}
            className="text-amber-600 hover:text-amber-800"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showPlaylistSelector && (
        <div className="mb-4 p-4 bg-white rounded-xl border-2 border-amber-300 space-y-2">
          <div className="font-bold text-amber-900 mb-2">{t('selectMode')}</div>
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => switchMode(false)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                !usePlaylist 
                  ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              🎵 {t('singleTracks')}
            </button>
            <button
              onClick={() => switchMode(true)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                usePlaylist 
                  ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              📋 {t('playlists')}
            </button>
          </div>

          {usePlaylist && (
            <div className="space-y-2">
              <div className="font-semibold text-amber-900 text-sm">{t('availablePlaylists')}</div>
              {playlists.map((pl, index) => (
                <button
                  key={index}
                  onClick={() => switchPlaylist(index)}
                  className={`w-full p-2 rounded-lg text-left transition-all ${
                    index === selectedPlaylist
                      ? 'bg-amber-200 border-2 border-amber-400'
                      : 'bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <div className="font-semibold text-amber-900">{pl.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl p-4 mb-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 flex-shrink-0">
            <img 
              src={displayInfo.thumbnail} 
              alt={displayInfo.title}
              className={`w-full h-full object-cover rounded-lg ${isPlaying ? 'animate-pulse' : ''}`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="text-white flex-1 min-w-0">
            <div className="font-bold truncate">{displayInfo.title}</div>
            <div className="text-sm opacity-90 truncate">{displayInfo.artist}</div>
            {usePlaylist && (
              <div className="text-xs opacity-75 mt-1">🔄 {t('playlistMode')}</div>
            )}
          </div>
          {!usePlaylist && (
            <div className="text-white text-xs bg-white/20 px-2 py-1 rounded-full flex-shrink-0">
              {currentTrack + 1}/{singleVideos.length}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs text-amber-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="relative cursor-pointer group" onClick={handleSeek}>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`transition-colors ${isLiked ? 'text-red-500' : 'text-amber-700'} hover:text-red-600`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button 
            onClick={handlePrev}
            disabled={!isReady}
            className="text-amber-700 hover:text-amber-900 transition-transform hover:scale-110 disabled:opacity-50"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            disabled={!isReady}
            className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-full p-4 hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!isReady}
            className="text-amber-700 hover:text-amber-900 transition-transform hover:scale-110 disabled:opacity-50"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleMute}
            disabled={!isReady}
            className="text-amber-700 hover:text-amber-900 disabled:opacity-50"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <VolumeX className="w-4 h-4 text-amber-600" />
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            disabled={!isReady}
            className="flex-1 h-1 bg-amber-200 rounded-full appearance-none cursor-pointer disabled:opacity-50"
          />
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-amber-700 w-8 text-right">{volume}%</span>
        </div>

        {!usePlaylist && (
          <div className="flex gap-1 justify-center mt-2">
            {singleVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTrack(index);
                  if (player && player.playVideo) {
                    setTimeout(() => player.playVideo(), 500);
                  }
                }}
                disabled={!isReady}
                className={`w-2 h-2 rounded-full transition-all disabled:opacity-50 ${
                  index === currentTrack 
                    ? 'bg-orange-500 w-4' 
                    : 'bg-amber-300 hover:bg-amber-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;