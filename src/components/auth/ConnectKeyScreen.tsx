import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { logger } from '../../utils/logger';

interface AIStudioClient {
  openSelectKey: () => Promise<void>;
  hasSelectedApiKey: () => Promise<boolean>;
}

interface Props {
  onConnect: () => void;
}

export const ConnectKeyScreen: React.FC<Props> = ({ onConnect }) => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const handleSelectKey = async () => {
    try {
      const aiStudio = (window as unknown as { aistudio: AIStudioClient }).aistudio;
      if (aiStudio) {
        await aiStudio.openSelectKey();
        const hasKey = await aiStudio.hasSelectedApiKey();
        if (hasKey) onConnect();
      } else {
        logger.warn('AI Studio client not found on window.');
      }
    } catch (error) {
      logger.error('Error selecting key:', error);
    }
  };

  return (
    <div className="min-h-screen bg-bible-paper flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-bible-card border border-bible-border p-8 rounded-2xl shadow-xl">
        <i className="fas fa-key text-4xl text-bible-accent mb-6"></i>
        <h1 className="text-2xl font-bold text-bible-text mb-2">{t('connectKey')}</h1>
        <p className="text-bible-text-light mb-8">
          Olá, <span className="text-bible-text font-bold">{user?.name}</span>.
        </p>

        <button
          onClick={handleSelectKey}
          className="w-full py-3 bg-bible-accent hover:bg-bible-accent-hover text-white rounded-lg font-bold transition-all mb-4"
        >
          {t('selectKey')}
        </button>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => signOut()}
            className="text-xs text-bible-text-light hover:text-bible-text"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};
