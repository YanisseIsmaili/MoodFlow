// src/hooks/useNotes.js
import { useState } from 'react';
import { NOTE_COLORS } from '../constants';

export const useNotes = (initialNotes = []) => {
  const [notes, setNotes] = useState(initialNotes);

  const addNote = (text) => {
    if (!text.trim()) return;

    const newNote = {
      id: Date.now(),
      text,
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      x: Math.random() * 400,
      y: Math.random() * 100
    };

    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  return {
    notes,
    addNote,
    deleteNote,
    updateNote
  };
};