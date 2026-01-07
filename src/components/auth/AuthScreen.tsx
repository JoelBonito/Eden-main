import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../utils/logger';
import { useLanguage } from '../../contexts/LanguageContext';
import { auth, db } from '../../services/firebase';
import { UserProfile } from '../../types';
import { COUNTRIES } from '../../utils/constants';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, setUser } = useAuth();
  const { t, currentLang, setLanguage } = useLanguage();

  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    phone: '',
    countryCode: '+55',
    nationality: 'Brasil'
  });
  const [authError, setAuthError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authView === 'login') {
        if (!authForm.email || !authForm.password) {
          setAuthError('Preencha todos os campos.');
          return;
        }
        await auth.signInWithEmailAndPassword(authForm.email, authForm.password);
      } else {
        if (!authForm.name || !authForm.age || !authForm.email || !authForm.password) {
          setAuthError('Preencha todos os campos.');
          return;
        }
        if (authForm.password !== authForm.confirmPassword) {
          setAuthError('Senhas não coincidem.');
          return;
        }
        const age = parseInt(authForm.age);
        if (isNaN(age)) {
          setAuthError('Idade inválida.');
          return;
        }
        const fullPhone = authForm.phone ? `${authForm.countryCode}${authForm.phone}` : '';
        const userCredential = await auth.createUserWithEmailAndPassword(
          authForm.email,
          authForm.password
        );
        if (userCredential.user) {
          const profileData: UserProfile = {
            name: authForm.name,
            age: age,
            email: authForm.email,
            role: 'user',
            language: currentLang,
            phone: fullPhone,
            nationality: authForm.nationality
          };
          await db.collection('users').doc(userCredential.user.uid).set(profileData);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError(String(error));
      }
    }
  };

  const handleGoogleSignInWrapper = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const err = error as { code?: string; message: string };
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      name: 'Visitante (Dev)',
      email: 'guest@dev.local',
      age: 25,
      role: 'user',
      language: currentLang,
      nationality: 'Brasil'
    };
    setUser(guestUser);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage('Digite seu email.');
      return;
    }
    try {
      await auth.sendPasswordResetEmail(resetEmail);
      setResetMessage('Email enviado!');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
      }, 3000);
    } catch (err) {
      logger.error(err);
      setResetMessage('Erro ao enviar email.');
    }
  };

  return (
    <div className="min-h-screen bg-layer-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorativo Opcional - Mantendo limpo por enquanto */}

      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <button
          onClick={() => setLanguage('pt')}
          className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden transition-all ${currentLang === 'pt' ? 'border-bible-accent ring-2 ring-bible-accent/30 scale-110' : 'border-bible-border opacity-70 grayscale'}`}
        >
          <img
            src="https://flagcdn.com/br.svg"
            alt="Português"
            className="w-full h-full object-cover"
          />
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden transition-all ${currentLang === 'en' ? 'border-bible-accent ring-2 ring-bible-accent/30 scale-110' : 'border-bible-border opacity-70 grayscale'}`}
        >
          <img
            src="https://flagcdn.com/us.svg"
            alt="English"
            className="w-full h-full object-cover"
          />
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden transition-all ${currentLang === 'es' ? 'border-bible-accent ring-2 ring-bible-accent/30 scale-110' : 'border-bible-border opacity-70 grayscale'}`}
        >
          <img
            src="https://flagcdn.com/es.svg"
            alt="Español"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      <div className="max-w-md w-full px-4 sm:px-0 bg-layer-2 border border-bible-border/30 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4 flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <img
              src="/eden-logo-login.png"
              alt="ÉDEN"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          {/* Removido título texto para focar na logo visual */}
          <p className="text-bible-text-light font-sans tracking-wide">{t('loginTitle')}</p>
        </div>

        {showForgotPassword ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center mb-4">
              <button onClick={() => setShowForgotPassword(false)}>
                <i className="fas fa-arrow-left"></i>
              </button>
              <h3 className="ml-3 font-bold">Recuperar</h3>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-bible-text-light mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2"
                />
              </div>
              {resetMessage && (
                <div className="p-3 bg-blue-50 text-blue-800 text-sm">{resetMessage}</div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-bible-accent text-white rounded-lg font-bold"
              >
                Enviar
              </button>
            </form>
          </div>
        ) : (
          <>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authView === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
                      {t('name')}
                    </label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
                        {t('age')}
                      </label>
                      <input
                        type="number"
                        value={authForm.age}
                        onChange={(e) => setAuthForm({ ...authForm, age: e.target.value })}
                        className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
                        {t('nationality')}
                      </label>
                      <select
                        value={authForm.nationality}
                        onChange={(e) => setAuthForm({ ...authForm, nationality: e.target.value })}
                        className="w-full bg-bible-card border border-bible-border rounded-lg px-2 py-2 text-bible-text text-sm outline-none focus:border-bible-accent h-[42px]"
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
                        value={authForm.countryCode}
                        onChange={(e) => setAuthForm({ ...authForm, countryCode: e.target.value })}
                        className="w-24 bg-bible-card border border-bible-border rounded-lg px-2 py-2 text-sm outline-none focus:border-bible-accent"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.ddi}>
                            {c.flag} {c.ddi}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={authForm.phone}
                        onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                        placeholder="99999-9999"
                        className="flex-1 bg-bible-card border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent"
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-1">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent"
                />
                {authView === 'login' && (
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetMessage('');
                      }}
                      className="text-xs text-bible-accent hover:text-bible-accent-hover font-bold"
                    >
                      {t('forgotPass')}
                    </button>
                  </div>
                )}
              </div>
              {authError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 mb-4">
                  <i className="fas fa-exclamation-circle mr-2"></i> {authError}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-bible-accent hover:bg-bible-accent-hover text-white rounded-lg font-bold transition-all shadow-md"
              >
                {authView === 'login' ? t('loginBtn') : t('registerBtn')}
              </button>
            </form>
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-bible-border"></div>
              <span className="px-3 text-bible-text-light text-xs uppercase font-bold">OU</span>
              <div className="flex-1 border-t border-bible-border"></div>
            </div>
            <button
              onClick={handleGoogleSignInWrapper}
              disabled={isGoogleLoading}
              className={`w-full py-3 bg-bible-card hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg font-bold transition-all flex items-center justify-center gap-3 mb-3 shadow-sm ${isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGoogleLoading ? (
                <i className="fas fa-circle-notch fa-spin text-bible-accent"></i>
              ) : (
                <i className="fab fa-google text-red-500"></i>
              )}{' '}
              {t('googleBtn')}
            </button>
            <button
              onClick={handleGuestLogin}
              className="w-full py-3 bg-bible-secondary hover:bg-bible-hover text-bible-text rounded-lg font-bold transition-all flex items-center justify-center gap-2 border border-bible-border shadow-sm"
            >
              <i className="fas fa-user-secret"></i> {t('guestBtn')}
            </button>
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthView(authView === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-bible-text-light hover:text-bible-text text-sm font-medium"
              >
                {authView === 'login' ? t('noAccount') : t('hasAccount')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
