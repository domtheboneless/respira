
import React, { useState } from 'react';
import { Language, UserStats } from '../types';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../supabaseClient';
import { profileService } from '../services/profileService';

interface Props {
  language: Language;
  onAuthComplete: (userId: string, stats: UserStats) => void;
  pendingStats?: UserStats;
  onSwitchToOnboarding?: () => void;
}

const Auth: React.FC<Props> = ({ language, onAuthComplete, pendingStats, onSwitchToOnboarding }) => {
  const t = TRANSLATIONS[language];
  const [isLogin, setIsLogin] = useState(!pendingStats);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // v2: signInWithPassword, returns { data: { user, session }, error }
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        
        const user = data.user;
        if (user) {
          const stats = await profileService.getProfile(user.id);
          if (stats) {
            onAuthComplete(user.id, stats);
          } else {
             // Profile not found - User requested NOT to redirect to onboarding automatically.
             // We show an error instead, implying the data should be there.
             setError(t.auth_error_no_profile);
          }
        }
      } else {
        if (!pendingStats) return;

        // v2: signUp, returns { data: { user, session }, error }
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        const user = data.user;
        if (user) {
          await profileService.upsertProfile(user.id, pendingStats);
          onAuthComplete(user.id, pendingStats);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.auth_error_not_found);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl mt-10 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {isLogin ? t.auth_login_title : t.auth_register_title}
      </h2>
      {!isLogin && <p className="text-gray-500 mb-6">{t.auth_save_progress}</p>}
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth_email}</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth_password}</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {loading ? '...' : (isLogin ? t.auth_login_btn : t.auth_register_btn)}
        </button>
      </form>

      <div className="mt-6 text-center">
        {isLogin ? (
          <button 
            onClick={onSwitchToOnboarding}
            className="text-indigo-600 font-medium hover:underline"
          >
            {t.auth_no_account}
          </button>
        ) : (
          <button 
            onClick={() => setIsLogin(true)}
            className="text-indigo-600 font-medium hover:underline"
          >
            {t.auth_have_account}
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
