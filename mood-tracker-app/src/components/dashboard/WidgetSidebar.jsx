// src/components/dashboard/WidgetSidebar.jsx
import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';

const WIDGET_INFO = {
  'mood-selector': { name: 'Comment te sens-tu ?', icon: '💜' },
  'current-time': { name: 'Current Time', icon: '🕐' },
  'music-player': { name: 'September Vibes', icon: '🎵' },
  'todays-focus': { name: "Today's Focus", icon: '⚡' },
  'focus-timer': { name: 'Pomodoro Timer', icon: '⏰' },
  'quick-actions': { name: 'Quick Actions', icon: '⚡' },
  'mood-board': { name: 'Interactive Mood Board', icon: '📝' },
  'calendar': { name: 'Calendar', icon: '📅' }
};

const WidgetSidebar = () => {
  const { widgets, sidebarOpen, setSidebarOpen, toggleWidget, resetLayout } = useDashboard();
  const [dragOverZone, setDragOverZone] = useState(false);

  const hiddenWidgets = widgets.filter(w => !w.visible);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverZone(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverZone(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const widgetId = e.dataTransfer.getData('widgetId');
    const source = e.dataTransfer.getData('source');
    
    if (widgetId && source === 'dashboard') {
      toggleWidget(widgetId);
    }
    
    setDragOverZone(false);
  };

  const handleWidgetDragStart = (e, widgetId) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('widgetId', widgetId);
    e.dataTransfer.setData('source', 'sidebar');
  };

  return (
    <>
      {/* Sidebar sans overlay blur */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50
          rounded-l-2xl border-l-4 border-orange-400
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          ${dragOverZone ? 'bg-orange-50 ring-4 ring-orange-400 ring-inset' : ''}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <h2 className="text-2xl font-bold text-gray-800">Widgets</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          {sidebarOpen && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg text-sm text-center">
              <p className="font-semibold text-blue-800">🎯 Mode Édition Actif</p>
              <p className="text-xs text-blue-700 mt-1">
                Réorganisez : glissez carte sur carte | Masquez : glissez ici →
              </p>
            </div>
          )}

          {/* Drop zone indicator */}
          {dragOverZone && (
            <div className="mb-4 p-4 bg-orange-200 border-2 border-dashed border-orange-500 rounded-lg text-center">
              <p className="text-orange-800 font-bold">⬇️ Déposez ici pour masquer</p>
            </div>
          )}

          {/* Hidden widgets */}
          <div className="flex-1 overflow-y-auto space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 sticky top-0 bg-white py-2">
              CARTES MASQUÉES ({hiddenWidgets.length})
            </h3>
            
            {hiddenWidgets.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">✨</p>
                <p className="text-sm">Toutes les cartes sont visibles</p>
                <p className="text-xs mt-1">Glissez une carte ici pour la masquer</p>
              </div>
            ) : (
              hiddenWidgets.map(widget => {
                const info = WIDGET_INFO[widget.id];
                return (
                  <div
                    key={widget.id}
                    draggable={sidebarOpen}
                    onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      bg-gray-50 border-gray-200
                      ${sidebarOpen ? 'cursor-move hover:bg-gray-100 hover:border-blue-300' : 'cursor-pointer'}
                      hover:scale-105 hover:shadow-md
                    `}
                    onClick={() => !sidebarOpen && toggleWidget(widget.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">{info.name}</p>
                          <p className="text-xs text-gray-500">
                            {sidebarOpen ? '← Glissez vers dashboard' : 'Clic pour afficher'}
                          </p>
                        </div>
                      </div>
                      {sidebarOpen && (
                        <div className="text-2xl">⬌</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* All widgets list (closed mode) */}
          {!sidebarOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">TOUTES LES CARTES</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {widgets.map(widget => {
                  const info = WIDGET_INFO[widget.id];
                  return (
                    <button
                      key={widget.id}
                      onClick={() => toggleWidget(widget.id)}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{info.icon}</span>
                        <span className="text-sm text-gray-700">{info.name}</span>
                      </div>
                      <span className={`text-xl ${widget.visible ? 'text-green-500' : 'text-gray-300'}`}>
                        {widget.visible ? '👁️' : '🙈'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={resetLayout}
            className="mt-4 w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            🔄 Réinitialiser
          </button>
        </div>
      </div>
    </>
  );
};

export default WidgetSidebar;