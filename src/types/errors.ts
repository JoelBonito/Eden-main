export enum ErrorCode {
  BIBLE_FETCH_FAILED = 'BIBLE_FETCH_FAILED',
  AI_GENERATION_FAILED = 'AI_GENERATION_FAILED',
  AUTH_ERROR = 'AUTH_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}
