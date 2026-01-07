import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../utils/logger';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bible-paper flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-bible-card border border-bible-border p-8 rounded-2xl shadow-xl">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-6"></i>
            <h1 className="text-2xl font-bold text-bible-text mb-2">Ops! Algo deu errado.</h1>
            <p className="text-bible-text-light mb-8">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-bible-accent hover:bg-bible-accent-hover text-white rounded-lg font-bold transition-all"
            >
              Recarregar Página
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-h-40">
                {this.state.error.message}
                <br />
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
