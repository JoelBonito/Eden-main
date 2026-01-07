import { useState, useCallback, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { db, storage } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { LibraryResource } from '../types';
import { logger } from '../utils/logger';
import { useToast } from '../contexts/ToastContext';
import { useErrorHandler } from './useErrorHandler';

export const useLibrary = () => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const { handleError } = useErrorHandler();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await db.collection('library').orderBy('createdAt', 'desc').get();
      const list = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as LibraryResource
      );
      setResources(list);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteResource = useCallback(async (id: string, fileUrl?: string) => {
    if (!isAdmin) {
      showToast('Apenas administradores podem deletar recursos.', 'warning');
      return;
    }

    try {
      await db.collection('library').doc(id).delete();
      if (fileUrl) {
        try {
          await storage.refFromURL(fileUrl).delete();
        } catch (err) {
          logger.warn('Could not delete file from storage.', err);
        }
      }
      await fetchResources();
    } catch (error) {
      handleError(error);
    }
  }, [isAdmin, fetchResources, handleError, showToast]);

  const uploadResource = useCallback(async (
    file: File | null,
    textFile: File | null,
    textContent: string,
    meta: { title: string; description: string; type: LibraryResource['type'] }
  ) => {
    if (!isAdmin) {
      showToast('Acesso negado.', 'error');
      throw new Error('Acesso negado.');
    }
    setUploading(true);
    try {
      let downloadUrl = '';
      let fileName = '';

      if (file) {
        const fileRef = storage.ref(`library/${Date.now()}_${file.name}`);
        await fileRef.put(file);
        downloadUrl = await fileRef.getDownloadURL();
        fileName = file.name;
      } else if (textFile) {
        fileName = textFile.name;
      }

      const newResource: Omit<LibraryResource, 'id'> = {
        title: meta.title,
        description: meta.description,
        type: meta.type,
        fileUrl: downloadUrl,
        fileName: fileName,
        textContent: textContent,
        uploadedBy: user?.name || 'Unknown',
        createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp
      };

      await db.collection('library').add(newResource);
      await fetchResources();
      showToast('Recurso enviado com sucesso!', 'success');
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      setUploading(false);
    }
  }, [isAdmin, user?.name, fetchResources, handleError, showToast]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return { resources, loading, uploading, fetchResources, deleteResource, uploadResource };
};
