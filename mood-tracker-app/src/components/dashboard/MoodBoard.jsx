// src/components/dashboard/MoodBoard.jsx
import React, { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';

const MoodBoard = () => {
  const initialNotes = [
    { id: 1, text: 'Remember to review Chapter 7', color: '#fef08a', x: 100, y: 50 },
    { id: 2, text: 'Coffee at 2pm ☕', color: '#f9a8d4', x: 350, y: 100 }
  ];
  
  const { notes, addNote, deleteNote } = useNotes(initialNotes);
  const [newNoteText, setNewNoteText] = useState('');

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      addNote(newNoteText);
      setNewNoteText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Interactive Mood Board</span>
          <span className="text-xs bg-amber-200 text-amber-700 px-2 py-1 rounded-full">+ notes</span>
        </div>
        <button
          onClick={handleAddNote}
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
          onKeyPress={handleKeyPress}
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
  );
};

export default MoodBoard;