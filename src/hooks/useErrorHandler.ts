import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { AppError } from '../types/errors';

export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof AppError) {
        showToast(error.message, 'error');
      } else if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('Ocorreu um erro inesperado.', 'error');
      }
    },
    [showToast]
  );

  return { handleError };
};
