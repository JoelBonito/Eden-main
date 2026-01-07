import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { AuthProvider } from './contexts/AuthContext';
import { BibleProvider } from './contexts/BibleContext';
import { AudioProvider } from './contexts/AudioContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BibleProvider>
          <LanguageProvider>
            <ToastProvider>
              <AudioProvider>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </AudioProvider>
            </ToastProvider>
          </LanguageProvider>
        </BibleProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
