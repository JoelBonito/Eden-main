/**
 * Logger utilitário para centralizar os logs da aplicação.
 * Em produção, logs informativos (log/warn) podem ser silenciados se necessário.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Erros sempre são mostrados, mas via logger para centralização
    console.error(...args);
  }
};
