import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { auth, db } from '../../services/firebase';
import { COUNTRIES } from '../../utils/constants';
import { logger } from '../../utils/logger';

export const CompleteProfileScreen: React.FC = () => {
  const { user, setUser } = useAuth();
  const { t } = useLanguage();

  const [ageInput, setAgeInput] = useState('');
  const [nationalityInput, setNationalityInput] = useState('Brasil');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!user || !auth.currentUser) return;
    const age = parseInt(ageInput);
    if (!ageInput || isNaN(age) || age <= 0) {
      setError('Idade inválida.');
      return;
    }

    try {
      await db.collection('users').doc(auth.currentUser.uid).update({
        age: age,
        nationality: nationalityInput
      });

      setUser({ ...user, age: age, nationality: nationalityInput });
    } catch (err) {
      logger.error(err);
      setError('Erro ao salvar perfil.');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-bible-paper flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-bible-card border border-bible-border p-8 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <i className="fas fa-user-edit text-4xl text-bible-accent mb-6"></i>
        <h1 className="text-2xl font-bold text-bible-text mb-2">Quase lá!</h1>
        <p className="text-bible-text-light mb-8">Por favor, complete seu perfil para continuar.</p>

        <div className="text-left mb-6">
          <div className="mb-4">
            <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
              {t('age')}
            </label>
            <input
              type="number"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-3 text-lg"
              autoFocus
              placeholder="Sua idade"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
              {t('nationality')}
            </label>
            <select
              value={nationalityInput}
              onChange={(e) => setNationalityInput(e.target.value)}
              className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-3 text-lg outline-none focus:border-bible-accent"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full py-4 bg-bible-accent hover:bg-bible-accent-hover text-white rounded-lg font-bold shadow-md transition-all"
        >
          Começar Agora
        </button>

        <button
          onClick={handleLogout}
          className="mt-6 text-xs text-bible-text-light hover:text-bible-text"
        >
          Sair
        </button>
      </div>
    </div>
  );
};
