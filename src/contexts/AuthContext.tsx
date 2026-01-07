import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { auth, db } from '../services/firebase';
import firebase from 'firebase/compat/app';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: UserProfile | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to load or create user document with exponential backoff
  const loadOrCreateUserDocument = async (
    authUser: firebase.User,
    attempts = 0
  ): Promise<UserProfile | null> => {
    // Visitantes não usam Firestore (hardcoded logic mantida do original)
    if (user?.email === 'guest@dev.local') return user;

    const maxAttempts = 3;
    const delays = [800, 1500, 3000];

    try {
      logger.log(
        `[AUTH] Carregando perfil Firestore para UID: ${authUser.uid} (Tentativa ${attempts + 1})`
      );
      // Force token refresh to ensure Firestore rules are met with propagated token
      await authUser.getIdToken(true);

      const userDocRef = db.collection('users').doc(authUser.uid);
      const doc = await userDocRef.get();

      if (doc.exists) {
        logger.log('[AUTH] Perfil encontrado com sucesso no Firestore.');
        return doc.data() as UserProfile;
      } else {
        logger.log('[AUTH] Perfil não existe no Firestore. Criando novo documento...');
        const newProfile: UserProfile = {
          name: authUser.displayName || 'Novo Usuário',
          email: authUser.email || '',
          age: 0,
          nationality: 'Brasil', // Default
          role: 'user',
          language: 'pt', // Default
          phone: ''
        };
        await userDocRef.set(newProfile);
        logger.log('[AUTH] Novo perfil criado com sucesso no Firestore.');
        return newProfile;
      }
    } catch (error: unknown) {
      const e = error as { code?: string; message?: string };
      if (
        attempts < maxAttempts &&
        (e.code === 'permission-denied' || e.message?.toLowerCase().includes('permission'))
      ) {
        logger.warn(
          `[AUTH] Erro de permissão ao acessar Firestore. Tentando novamente em ${delays[attempts]}ms...`
        );
        await new Promise((r) => setTimeout(r, delays[attempts]));
        return loadOrCreateUserDocument(authUser, attempts + 1);
      }
      logger.error(
        '[AUTH] Falha definitiva ao carregar/criar documento no Firestore após retries.',
        e
      );
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      // VISITANTE: Se o usuário atual for visitante, ignoramos a mudança de estado do Firebase Auth (a menos que seja logout explícito)
      if (!currentUser && user?.email === 'guest@dev.local') {
        return;
      }

      logger.log(
        '[AUTH] Estado alterado no Firebase Auth. Usuário:',
        currentUser?.email || 'Nenhum'
      );

      if (currentUser) {
        setLoading(true);
        // Aguarda propagação inicial (apenas fora de testes)
        if (process.env.NODE_ENV !== 'test') {
          await new Promise((r) => setTimeout(r, 1000));
        }
        const userData = await loadOrCreateUserDocument(currentUser);
        if (userData) {
          setUser(userData);
        }
        setLoading(false);
      } else {
        if (user?.email !== 'guest@dev.local') {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user?.email]);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, setUser, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
