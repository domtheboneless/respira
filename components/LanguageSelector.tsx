
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ current, onSelect }) => {
  return (
    <div className="flex gap-2 justify-center my-4">
      <button 
        onClick={() => onSelect('en')}
        className={`px-4 py-2 rounded-full border transition-all ${current === 'en' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}
      >
        🇺🇸 English
      </button>
      <button 
        onClick={() => onSelect('it')}
        className={`px-4 py-2 rounded-full border transition-all ${current === 'it' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}
      >
        🇮🇹 Italiano
      </button>
    </div>
  );
};

export default LanguageSelector;
