// src/components/dashboard/DraggableWidget.jsx
import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const DraggableWidget = ({ id, children, className = '' }) => {
  const { editMode, wiggleWidget, triggerWiggle, setSidebarOpen, moveWidget } = useDashboard();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const isWiggling = wiggleWidget === id;

  const handleCardClick = (e) => {
    if (editMode) return;
    
    const target = e.target;
    const isInteractive = target.tagName === 'BUTTON' || 
                         target.tagName === 'INPUT' || 
                         target.tagName === 'A' ||
                         target.tagName === 'SELECT' ||
                         target.tagName === 'TEXTAREA' ||
                         target.closest('button, input, a, select, textarea, [role="button"], [onclick]');
    
    if (!isInteractive) {
      e.stopPropagation();
      setSidebarOpen(true);
    }
  };

  const handleCornerClick = (e) => {
    if (!editMode) {
      e.stopPropagation();
      triggerWiggle(id);
    }
  };

  const handleDragStart = (e) => {
    if (!editMode) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('widgetId', id);
    e.dataTransfer.setData('source', 'dashboard');
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!editMode) return;

    const draggedId = e.dataTransfer.getData('widgetId');
    const source = e.dataTransfer.getData('source');

    if (source === 'dashboard' && draggedId !== id) {
      moveWidget(draggedId, id);
    }
  };

  return (
    <div
      draggable={editMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCardClick}
      className={`
        relative transition-all duration-300
        ${className}
        ${editMode ? 'cursor-move' : ''}
        ${isDragging ? 'opacity-30 scale-95' : ''}
        ${isDragOver && editMode ? 'scale-105 ring-4 ring-blue-400' : ''}
        ${isWiggling ? 'animate-wiggle' : ''}
      `}
    >
      {/* Corner zones */}
      {!editMode && (
        <>
          <div 
            className="absolute top-0 left-0 w-8 h-8 cursor-pointer z-10 hover:bg-orange-100 rounded-tl-lg transition-colors"
            onClick={handleCornerClick}
          />
          <div 
            className="absolute top-0 right-0 w-8 h-8 cursor-pointer z-10 hover:bg-orange-100 rounded-tr-lg transition-colors"
            onClick={handleCornerClick}
          />
          <div 
            className="absolute bottom-0 left-0 w-8 h-8 cursor-pointer z-10 hover:bg-orange-100 rounded-bl-lg transition-colors"
            onClick={handleCornerClick}
          />
          <div 
            className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer z-10 hover:bg-orange-100 rounded-br-lg transition-colors"
            onClick={handleCornerClick}
          />
        </>
      )}

      {/* Edit indicator */}
      {editMode && (
        <div className="absolute -top-3 -left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
          ⬍ Drag
        </div>
      )}

      {children}
    </div>
  );
};

export default DraggableWidget;