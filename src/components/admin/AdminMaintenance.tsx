/**
 * Componente de Administração para executar tarefas de manutenção
 * Adicione este componente em uma página restrita a admins
 */

import React, { useState } from 'react';
import { functions } from '../services/firebase';

export const AdminMaintenance: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleCleanCache = async () => {
        if (!confirm('Tem certeza que deseja limpar os caches antigos?')) return;

        setLoading(true);
        setResult(null);

        try {
            const cleanOldCacheFn = functions.httpsCallable('cleanOldCache');
            const response = await cleanOldCacheFn();
            const data = response.data as { success: boolean; deleted: number; kept: number; message: string };

            setResult(`✅ ${data.message}`);
        } catch (error: any) {
            setResult(`❌ Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-bible-card rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">🛠️ Manutenção do Sistema</h2>

            <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Limpeza de Cache Antigo</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Remove caches do Firestore que não possuem data de expiração (criados antes da atualização de TTL).
                    </p>

                    <button
                        onClick={handleCleanCache}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '🔄 Limpando...' : '🧹 Limpar Cache Antigo'}
                    </button>
                </div>

                {result && (
                    <div className={`p-4 rounded-lg ${result.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <pre className="whitespace-pre-wrap font-mono text-sm">{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};
