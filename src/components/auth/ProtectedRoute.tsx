import React from 'react';
// Navigate import removido por não ser utilizado diretamente aqui
import { useAuth } from '../../contexts/AuthContext';
import { AuthScreen } from './AuthScreen';
import { CompleteProfileScreen } from './CompleteProfileScreen';
import { ConnectKeyScreen } from './ConnectKeyScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApiKey?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireApiKey = true
}) => {
  const { user, loading } = useAuth();
  const [apiKeyReady, setApiKeyReady] = React.useState(false);

  React.useEffect(() => {
    const checkApiKey = async () => {
      const aiStudio = (
        window as unknown as { aistudio: { hasSelectedApiKey: () => Promise<boolean> } }
      ).aistudio;
      if (aiStudio) {
        const hasKey = Boolean(await aiStudio.hasSelectedApiKey());
        setApiKeyReady(hasKey);
      } else {
        setApiKeyReady(true);
      }
    };
    if (requireApiKey) {
      checkApiKey();
    } else {
      setApiKeyReady(true);
    }
  }, [requireApiKey]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bible-paper flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-bible-accent mb-4"></i>
          <p className="text-bible-text-light font-serif">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <AuthScreen />;
  }

  // Incomplete profile
  if (user.age === 0) {
    return <CompleteProfileScreen />;
  }

  // API Key not connected (if required)
  if (requireApiKey && !apiKeyReady) {
    return <ConnectKeyScreen onConnect={() => setApiKeyReady(true)} />;
  }

  // Authenticated and ready
  return <>{children}</>;
};
