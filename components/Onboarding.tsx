
import React, { useState } from 'react';
import { Language, UserStats, Translation } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  language: Language;
  onComplete: (stats: UserStats) => void;
}

const Onboarding: React.FC<Props> = ({ language, onComplete }) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    cigarettesPerDay: 20,
    pricePerPack: 6.00,
    packSize: 20,
    dreamGoal: '',
    dreamCost: 1000,
    currency: language === 'it' ? '€' : '$'
  });

  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      onComplete({
        ...formData,
        quitDate: new Date().toISOString()
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">{t.onboarding_q1}</h2>
            <input 
              type="number" 
              value={formData.cigarettesPerDay}
              onChange={(e) => setFormData({...formData, cigarettesPerDay: Number(e.target.value)})}
              className="w-full p-4 border rounded-xl text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{t.onboarding_q2}</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-gray-400">{formData.currency}</span>
              <input 
                type="number" 
                step="0.1"
                value={formData.pricePerPack}
                onChange={(e) => setFormData({...formData, pricePerPack: Number(e.target.value)})}
                className="w-full p-4 border rounded-xl text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{t.onboarding_q3}</h2>
            <input 
              type="number" 
              value={formData.packSize}
              onChange={(e) => setFormData({...formData, packSize: Number(e.target.value)})}
              className="w-full p-4 border rounded-xl text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{t.onboarding_q4}</h2>
            <textarea 
              placeholder={t.onboarding_dream_placeholder}
              value={formData.dreamGoal}
              onChange={(e) => setFormData({...formData, dreamGoal: e.target.value})}
              className="w-full p-4 border rounded-xl text-lg h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{t.onboarding_q5}</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-gray-400">{formData.currency}</span>
              <input 
                type="number" 
                placeholder={t.onboarding_dream_cost_placeholder}
                value={formData.dreamCost}
                onChange={(e) => setFormData({...formData, dreamCost: Number(e.target.value)})}
                className="w-full p-4 border rounded-xl text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl mt-10">
      <div className="mb-8 h-2 bg-gray-100 rounded-full">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
          style={{ width: `${((step + 1) / 5) * 100}%` }}
        ></div>
      </div>
      
      {renderStep()}

      <button 
        onClick={next}
        disabled={step === 3 && !formData.dreamGoal}
        className="w-full mt-8 bg-indigo-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {step === 4 ? t.cta_start : t.cta_next}
      </button>
    </div>
  );
};

export default Onboarding;
