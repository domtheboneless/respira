import React from 'react';
import { Language } from '../types';

interface Props {
  countdown: number;
  language: Language;
  onReopen: () => void;
  onCancel: () => void;
}

const ActiveTimerBanner: React.FC<Props> = ({ countdown, language, onReopen, onCancel }) => {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slideUp">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 border-2 border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-xs opacity-80 font-medium">
              {language === 'en' ? 'Timer active' : 'Timer attivo'}
            </span>
            <span className="text-2xl font-mono font-bold tracking-wider">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onReopen}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-bold transition-all"
          >
            {language === 'en' ? 'Open' : 'Apri'}
          </button>
          <button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveTimerBanner;
