// src/components/layout/Header.jsx
import React from 'react';
import { Calendar, Edit, Settings, Sun, Moon, Coffee, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';

const Header = ({ onOpenSettings }) => {
  const { t } = useLanguage();
  const { logout, user } = useAuth();
  const { setSidebarOpen } = useDashboard();
  
  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-amber-900 flex items-center gap-2">
            <Sun className="w-8 h-8 text-amber-600" />
            {t('septemberDashboard')}
            <Moon className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-amber-700 mt-1 flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            {t('septemberMornings')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-amber-700 text-sm mr-2">
              {t('welcome')}, {user.username}
            </div>
          )}
          <button className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg">
            <Calendar className="w-5 h-5 text-amber-700" />
          </button>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg"
            title="Ouvrir le menu d'édition"
          >
            <Edit className="w-5 h-5 text-amber-700" />
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg"
          >
            <Settings className="w-5 h-5 text-amber-700" />
          </button>
          <button 
            onClick={logout}
            className="p-3 bg-white/60 rounded-xl hover:bg-white/80 transition-all shadow-lg"
            title={t('logout')}
          >
            <LogOut className="w-5 h-5 text-amber-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;