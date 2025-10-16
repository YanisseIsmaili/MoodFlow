// src/components/dashboard/MoodBoard.jsx
import React, { useState, useRef } from 'react';
import { Target, Plus } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';

const MoodBoard = () => {
  const initialNotes = getFromStorage('moodBoardNotes', [
    { id: 1, text: 'Remember to review Chapter 7', color: '#fef08a', x: 100, y: 50 },
    { id: 2, text: 'Coffee at 2pm ☕', color: '#f9a8d4', x: 350, y: 100 }
  ]);
  
  const { notes, addNote, deleteNote, updateNote } = useNotes(initialNotes);
  const [newNoteText, setNewNoteText] = useState('');
  const [draggingNote, setDraggingNote] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  // Sauvegarder les notes quand elles changent
  React.useEffect(() => {
    saveToStorage('moodBoardNotes', notes);
  }, [notes]);

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

  const handleMouseDown = (e, note) => {
    e.preventDefault();
    const boardRect = boardRef.current.getBoundingClientRect();
    
    setDraggingNote(note.id);
    setOffset({
      x: e.clientX - boardRect.left - note.x,
      y: e.clientY - boardRect.top - note.y
    });
  };

  const handleMouseMove = (e) => {
    if (draggingNote === null || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const maxWidth = boardRect.width - 220; // 200px note width + 20px margin
    const maxHeight = boardRect.height - 120; // ~100px note height + 20px margin

    let newX = e.clientX - boardRect.left - offset.x;
    let newY = e.clientY - boardRect.top - offset.y;

    // Limiter aux bordures du board
    newX = Math.max(0, Math.min(newX, maxWidth));
    newY = Math.max(0, Math.min(newY, maxHeight));

    updateNote(draggingNote, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggingNote(null);
  };

  React.useEffect(() => {
    if (draggingNote !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingNote, offset]);

  return (
    <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Interactive Mood Board</span>
          <span className="text-xs bg-amber-200 text-amber-700 px-2 py-1 rounded-full">
            {notes.length} notes
          </span>
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

      <div 
        ref={boardRef}
        className="relative h-96 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-2xl overflow-hidden"
        style={{ cursor: draggingNote ? 'grabbing' : 'default' }}
      >
        {notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-amber-600">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Aucune note pour le moment</p>
              <p className="text-sm">Ajoutez votre première note ci-dessus !</p>
            </div>
          </div>
        )}

        {notes.map(note => (
          <div
            key={note.id}
            className={`absolute p-4 rounded-lg shadow-lg transition-shadow ${
              draggingNote === note.id 
                ? 'shadow-2xl scale-105 cursor-grabbing z-50' 
                : 'hover:shadow-xl cursor-grab'
            }`}
            style={{
              backgroundColor: note.color,
              left: `${note.x}px`,
              top: `${note.y}px`,
              width: '200px',
              userSelect: 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, note)}
          >
            <button
              onClick={() => deleteNote(note.id)}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md z-10"
            >
              ×
            </button>
            
            <div className="absolute top-2 left-2 opacity-30">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-800 break-words pt-4">
              {note.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-amber-600">
        <span>💡 Astuce : Cliquez et faites glisser les notes pour les déplacer</span>
        <span className="font-semibold">{notes.length} / ∞ notes</span>
      </div>
    </div>
  );
};

export default MoodBoard;