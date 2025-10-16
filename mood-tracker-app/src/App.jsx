import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Music, Target, Zap, Settings, Plus, Play, Pause, SkipBack, SkipForward, Heart, Volume2, Sun, Moon, Coffee } from 'lucide-react';

const SeptemberDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [notes, setNotes] = useState([
    { id: 1, text: 'Remember to review Chapter 7', color: '#fef08a', x: 100, y: 50 },
    { id: 2, text: 'Coffee at 2pm ☕', color: '#f9a8d4', x: 350, y: 100 }
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(9); // October = 9 (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isFocusRunning && focusTime > 0) {
      const timer = setTimeout(() => setFocusTime(focusTime - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (focusTime === 0) {
      setIsFocusRunning(false);
      alert('Focus session completed! 🎉');
    }
  }, [isFocusRunning, focusTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addNote = () => {
    if (newNoteText.trim()) {
      const colors = ['#fef08a', '#f9a8d4', '#bfdbfe', '#bbf7d0', '#fed7aa'];
      setNotes([...notes, {
        id: Date.now(),
        text: newNoteText,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 400,
        y: Math.random() * 100
      }]);
      setNewNoteText('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const getDaysInMonth = (month, year) => {
    return new Array(new Date(year, month + 1, 0).getDate()).fill(null).map((_, i) => i + 1);
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const days = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const emptyDays = Array(firstDay).fill(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 flex items-center gap-2">
              <Sun className="w-8 h-8 text-amber-600" />
              September Dashboard
              <Moon className="w-6 h-6 text-amber-500" />
            </h1>
            <p className="text-amber-700 mt-1 flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              September mornings bring fresh starts
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg">
              <Calendar className="w-5 h-5 text-amber-700" />
            </button>
            <button className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg">
              <Target className="w-5 h-5 text-amber-700" />
            </button>
            <button className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg">
              <Settings className="w-5 h-5 text-amber-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Time Widget */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 mb-4">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Current Time</span>
          </div>
          <div className="text-5xl font-bold text-amber-900 mb-2">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-amber-700 mb-4">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-amber-900">--°C</span>
            <Sun className="w-10 h-10 text-amber-500" />
          </div>
          <div className="text-sm text-amber-600 mt-1">Unavailable</div>
        </div>

        {/* Music Player */}
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

        {/* Today's Focus */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Today's Focus</span>
            </div>
            <button className="text-amber-600 hover:text-amber-800">
              <Zap className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-amber-700">Study Hours</span>
                <span className="text-amber-900 font-semibold">+3 hour</span>
              </div>
              <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 w-3/4"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-amber-700">Work in Progress</span>
                <span className="text-amber-900 font-semibold">+1 task</span>
              </div>
              <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-1/2"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-amber-700">Tasks Completed</span>
                <span className="text-amber-900 font-semibold">+5 task</span>
              </div>
              <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-4/5"></div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
              <div className="text-4xl">🎯</div>
              <div className="text-amber-900 font-bold text-2xl">11</div>
              <div className="text-amber-700 text-sm">September Leaves Earned</div>
            </div>
          </div>
        </div>

        {/* Focus Time */}
        <div className="lg:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-amber-700">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Focus Time</span>
            </div>
            <div className="text-amber-700 text-sm">
              Session: 0
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-amber-900 mb-2">
              {formatTime(focusTime)}
            </div>
            <div className="text-amber-600">Focus Time</div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setIsFocusRunning(!isFocusRunning)}
              className="bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-full p-4 hover:scale-110 transition-transform shadow-lg"
            >
              {isFocusRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <button
              onClick={() => setFocusTime(25 * 60)}
              className="bg-amber-200 text-amber-800 rounded-full p-4 hover:bg-amber-300 transition-all shadow-lg"
            >
              <Clock className="w-6 h-6" />
            </button>
            <button className="bg-amber-200 text-amber-800 rounded-full p-4 hover:bg-amber-300 transition-all shadow-lg">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-100 rounded-2xl mb-4">
            <div>
              <div className="font-semibold text-amber-900">Auto-start next session</div>
              <div className="text-sm text-amber-600">Automatically begin after completion</div>
            </div>
            <button
              onClick={() => setAutoStart(!autoStart)}
              className={`w-12 h-6 rounded-full transition-all ${
                autoStart ? 'bg-green-400' : 'bg-amber-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                autoStart ? 'translate-x-6' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-sm text-amber-700">
            <div>
              <div className="font-semibold">00:00 elapsed</div>
            </div>
            <div>
              <div className="font-semibold">25:00 remaining</div>
            </div>
          </div>

          <div className="text-center text-sm text-amber-600 mt-4">
            4 until long break
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 mb-4">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Quick Actions</span>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Add Mood Note
            </button>
            <button className="w-full bg-gradient-to-r from-blue-300 to-indigo-300 text-blue-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Add Calendar Event
            </button>
            <button className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
              <Settings className="w-5 h-5" />
              Open Settings
            </button>
            <button className="w-full bg-gradient-to-r from-green-300 to-emerald-300 text-green-900 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Motivate Me!
            </button>
          </div>
        </div>

        {/* Interactive Mood Board */}
        <div className="lg:col-span-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Interactive Mood Board</span>
              <span className="text-xs bg-amber-200 text-amber-700 px-2 py-1 rounded-full">+ notes</span>
            </div>
            <button
              onClick={addNote}
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNote()}
              placeholder="Type your note and press Enter..."
              className="w-full px-4 py-3 bg-white/60 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 text-amber-900 placeholder-amber-400"
            />
          </div>

          <div className="relative h-64 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-2xl overflow-hidden">
            {notes.map(note => (
              <div
                key={note.id}
                className="absolute p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform cursor-move"
                style={{
                  backgroundColor: note.color,
                  left: `${note.x}px`,
                  top: `${note.y}px`,
                  maxWidth: '200px'
                }}
              >
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
                <p className="text-sm font-medium text-gray-800">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(selectedYear - 1);
                  } else {
                    setSelectedMonth(selectedMonth - 1);
                  }
                }}
                className="text-amber-700 hover:text-amber-900"
              >
                ‹
              </button>
              <div className="flex items-center gap-2 text-amber-700">
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-xl">{monthNames[selectedMonth]} {selectedYear}</span>
              </div>
              <button
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                }}
                className="text-amber-700 hover:text-amber-900"
              >
                ›
              </button>
            </div>
            <button className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-amber-700 py-2">
                {day}
              </div>
            ))}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {days.map(day => (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all ${
                  day === 16 
                    ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold shadow-lg scale-110' 
                    : 'bg-amber-100/50 hover:bg-amber-200 text-amber-900'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-100 rounded-2xl">
            <div className="font-semibold text-amber-900 mb-2">Events for October 16</div>
            <div className="text-amber-700">No events scheduled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeptemberDashboard;