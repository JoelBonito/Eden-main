import { useState, useCallback, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { db, auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { StudyRestorePoint } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useErrorHandler } from './useErrorHandler';

export const useRestorePoints = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { handleError } = useErrorHandler();
  const [restorePoints, setRestorePoints] = useState<StudyRestorePoint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRestorePoints = useCallback(async () => {
    // Visitantes não carregam do Firestore, mas podem ter locais na sessão?
    // O hook recria quando monta? Se for hook global, sim.
    // Mas o estado local de visitante se perde no refresh.
    if (!auth.currentUser || user?.email === 'guest@dev.local') return;

    setLoading(true);
    try {
      const snap = await db
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('restore_points')
        .orderBy('timestamp', 'desc')
        .get();
      const points = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as StudyRestorePoint);
      setRestorePoints(points);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveRestorePoint = useCallback(async (data: Omit<StudyRestorePoint, 'id' | 'timestamp'>) => {
    // VISITANTE: Salva apenas localmente na memória (State hooks resetam no refresh, visitante perde dados. Aceitável)
    if (user?.email === 'guest@dev.local') {
      const newPoint: StudyRestorePoint = {
        id: `local-${Date.now()}`,
        timestamp: { toDate: () => new Date() } as firebase.firestore.Timestamp,
        ...data
      };
      setRestorePoints((prev) => [newPoint, ...prev]);
      showToast('Ponto de restauração salvo localmente (Sessão de Visitante).', 'info');
      return;
    }

    if (!auth.currentUser) {
      showToast('Entre para salvar pontos de restauração permanentemente.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const newPoint = {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        ...data
      };
      const docRef = await db
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('restore_points')
        .add(newPoint);

      // Optimistic update: adiciona localmente sem refetch
      const optimisticPoint: StudyRestorePoint = {
        id: docRef.id,
        timestamp: { toDate: () => new Date() } as firebase.firestore.Timestamp,
        ...data
      };
      setRestorePoints((prev) => [optimisticPoint, ...prev]);
      showToast('Ponto de restauração salvo!', 'success');
    } catch (e) {
      handleError(e);
      // Em caso de erro, refaz o fetch para garantir consistência
      await fetchRestorePoints();
    } finally {
      setLoading(false);
    }
  }, [user, fetchRestorePoints, handleError, showToast]);

  const deleteRestorePoint = useCallback(async (id: string) => {
    if (user?.email === 'guest@dev.local') {
      setRestorePoints((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    if (!auth.currentUser) return;
    try {
      await db
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('restore_points')
        .doc(id)
        .delete();
      // Optimistic update ou refetch? Refetch garante consistência
      fetchRestorePoints();
    } catch (e) {
      handleError(e);
    }
  }, [user, fetchRestorePoints, handleError]);

  // Auto fetch on mount/user change
  useEffect(() => {
    fetchRestorePoints();
  }, [fetchRestorePoints]);

  return { restorePoints, loading, fetchRestorePoints, saveRestorePoint, deleteRestorePoint };
};
