import { AppError, ErrorCode } from '../types/errors';
import { logger } from './logger';

export const handleApiError = (error: unknown, context: string): AppError => {
  logger.error(`[${context}] Error:`, error);

  if (error instanceof AppError) {
    return error;
  }

  // Firebase / General Cloud Function errors
  const err = error as { code?: string; message?: string };
  if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
    return new AppError(
      ErrorCode.PERMISSION_DENIED,
      'Acesso negado. Você não tem permissão para esta ação.',
      error
    );
  }

  if (err?.message?.includes('network') || err?.code === 'unavailable') {
    return new AppError(ErrorCode.NETWORK_ERROR, 'Erro de rede. Verifique sua conexão.', error);
  }

  if (err?.message?.includes('quota') || err?.code === 'resource-exhausted') {
    return new AppError(
      ErrorCode.AI_GENERATION_FAILED,
      'Limite de uso da IA atingido. Tente novamente mais tarde.',
      error
    );
  }

  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    'Ocorreu um erro inesperado. Tente novamente.',
    error
  );
};
