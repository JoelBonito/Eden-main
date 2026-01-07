import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBible } from '../../contexts/BibleContext';
import { auth, db } from '../../services/firebase';
import { COUNTRIES } from '../../utils/constants';
import { logger } from '../../utils/logger';
import { Language, BibleReference } from '../../types';
// firebase import removido por não ser utilizado diretamente aqui

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const { t, setLanguage } = useLanguage();
  const { setBibleRef } = useBible();

  const [profileForm, setProfileForm] = useState({
    name: '',
    age: '',
    phone: '',
    countryCode: '+55',
    nationality: '',
    newPassword: '',
    confirmPassword: '',
    language: 'pt' as Language
  });
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      // Attempt to split phone if possible, otherwise just use what we have or default
      let ddi = '+55';
      let ph = user.phone || '';
      if (ph.startsWith('+')) {
        // Simple heuristic: assume first 3 digits are DDI if matches common ones, or iterate COUNTRIES
        // For now, simpler: if matches a known DDI code
        const found = COUNTRIES.find((c) => ph.startsWith(c.ddi));
        if (found) {
          ddi = found.ddi;
          ph = ph.substring(found.ddi.length);
        }
      }

      setProfileForm({
        name: user.name || '',
        age: user.age?.toString() || '',
        phone: ph,
        countryCode: ddi,
        nationality: user.nationality || '',
        newPassword: '',
        confirmPassword: '',
        language: (user.language as Language) || 'pt'
      });
    }
  }, [isOpen, user]);

  const applyAgePersonalization = (age: number, lang: Language) => {
    let suggestedTranslation = 'NVI';
    if (lang === 'en') suggestedTranslation = 'NIV';
    else if (lang === 'es') suggestedTranslation = 'NVI-ES';

    if (age < 12 && age > 0) {
      if (lang === 'pt') suggestedTranslation = 'Bíblia Infantil';
      else if (lang === 'en') suggestedTranslation = 'Kids Bible';
      else if (lang === 'es') suggestedTranslation = 'Biblia Niños';
    }
    setBibleRef((prev: BibleReference) => ({ ...prev, translation: suggestedTranslation }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileMessage(null);
    const newAge = parseInt(profileForm.age);
    if (isNaN(newAge)) {
      setProfileMessage({ type: 'error', text: 'Idade inválida.' });
      return;
    }
    const fullPhone = profileForm.phone ? `${profileForm.countryCode}${profileForm.phone}` : '';

    // VISITANTE: Atualiza apenas localmente
    if (!auth.currentUser || user.email === 'guest@dev.local') {
      const updatedUser = {
        ...user,
        name: profileForm.name,
        age: newAge,
        phone: fullPhone,
        language: profileForm.language,
        nationality: profileForm.nationality
      };
      setUser(updatedUser);
      setLanguage(profileForm.language);
      applyAgePersonalization(newAge, profileForm.language);
      setProfileMessage({ type: 'success', text: 'Perfil de visitante atualizado!' });
      return;
    }
    try {
      await db.collection('users').doc(auth.currentUser.uid).update({
        name: profileForm.name,
        age: newAge,
        phone: fullPhone,
        language: profileForm.language,
        nationality: profileForm.nationality
      });
      const updatedUser = {
        ...user,
        name: profileForm.name,
        age: newAge,
        phone: fullPhone,
        language: profileForm.language,
        nationality: profileForm.nationality
      };
      setUser(updatedUser);
      setLanguage(profileForm.language);
      applyAgePersonalization(newAge, profileForm.language);
      setProfileMessage({ type: 'success', text: 'Perfil atualizado!' });
    } catch (err) {
      logger.error(err);
      setProfileMessage({ type: 'error', text: 'Erro ao atualizar.' });
    }
  };

  const handleChangePassword = async () => {
    if (!profileForm.newPassword) return;
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (auth.currentUser) {
      try {
        await auth.currentUser.updatePassword(profileForm.newPassword);
        setProfileMessage({ type: 'success', text: 'Senha alterada!' });
        setProfileForm((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
      } catch (err) {
        const error = err as { message: string };
        setProfileMessage({ type: 'error', text: 'Erro ao mudar senha: ' + error.message });
      }
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-bible-card w-full max-w-md rounded-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-bible-border pb-4">
          <h3 className="font-bold text-xl text-bible-text font-serif">{t('profile')}</h3>
          <button onClick={onClose} className="text-bible-text-light hover:text-bible-text">
            <i className="fas fa-times"></i>
          </button>
        </div>
        {profileMessage && (
          <div
            className={`p-3 rounded mb-4 text-sm font-bold flex items-center ${profileMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            <i
              className={`fas ${profileMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}
            ></i>
            {profileMessage.text}
          </div>
        )}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="bg-bible-secondary/30 p-4 rounded-lg mb-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bible-accent text-white flex items-center justify-center text-2xl font-bold font-serif shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-bible-text-light">Email</p>
              <p className="text-sm font-medium text-bible-text">{user.email}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
              {t('name')}
            </label>
            <input
              className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 outline-none focus:border-bible-accent transition-colors"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
                {t('age')}
              </label>
              <input
                type="number"
                className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 outline-none focus:border-bible-accent transition-colors"
                value={profileForm.age}
                onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
                {t('nationality')}
              </label>
              <select
                className="w-full bg-bible-card border border-bible-border rounded-lg px-2 py-2 text-sm outline-none focus:border-bible-accent h-[42px]"
                value={profileForm.nationality}
                onChange={(e) => setProfileForm({ ...profileForm, nationality: e.target.value })}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
              {t('phone')}
            </label>
            <div className="flex gap-2">
              <select
                className="w-24 bg-bible-card border border-bible-border rounded-lg px-2 py-2 text-sm outline-none focus:border-bible-accent"
                value={profileForm.countryCode}
                onChange={(e) => setProfileForm({ ...profileForm, countryCode: e.target.value })}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.ddi}>
                    {c.flag} {c.ddi}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                className="flex-1 bg-bible-card border border-bible-border rounded-lg px-4 py-2 outline-none focus:border-bible-accent transition-colors"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="99999-9999"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
              Idioma
            </label>
            <select
              className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 outline-none focus:border-bible-accent transition-colors"
              value={profileForm.language}
              onChange={(e) =>
                setProfileForm({ ...profileForm, language: e.target.value as Language })
              }
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-bible-accent text-white font-bold rounded-lg hover:bg-bible-accent-hover transition-all shadow-sm"
          >
            {t('save')}
          </button>
        </form>
        {user?.email !== 'guest@dev.local' && (
          <div className="border-t border-bible-border my-6 pt-6">
            <h4 className="font-bold text-sm text-bible-text mb-4 flex items-center">
              <i className="fas fa-lock text-bible-accent mr-2"></i> Alterar Senha
            </h4>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Nova Senha"
                className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 outline-none focus:border-bible-accent transition-colors text-sm"
                value={profileForm.newPassword}
                onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirmar Senha"
                className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 outline-none focus:border-bible-accent transition-colors text-sm"
                value={profileForm.confirmPassword}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, confirmPassword: e.target.value })
                }
              />
              <button
                onClick={handleChangePassword}
                className="w-full py-2 bg-bible-secondary text-bible-text font-bold rounded-lg hover:bg-bible-hover border border-bible-border transition-all text-sm"
              >
                Atualizar Senha
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
