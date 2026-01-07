/**
 * Cloud Function para limpar caches antigos
 * Adicione ao functions/index.js e chame via HTTP
 */

const { onCall } = require('firebase-functions/v2/https');
const { getFirestore } = require('firebase-admin/firestore');

exports.cleanOldCache = onCall({ cors: true }, async (request) => {
    // Apenas admins podem executar
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Autenticação necessária');
    }

    const db = getFirestore();

    try {
        const snapshot = await db.collection('bible_cache').get();

        let deletedCount = 0;
        let keptCount = 0;
        const batch = db.batch();

        snapshot.forEach((doc) => {
            const data = doc.data();

            if (!data.expiresAt) {
                batch.delete(doc.ref);
                deletedCount++;
            } else {
                keptCount++;
            }
        });

        if (deletedCount > 0) {
            await batch.commit();
        }

        return {
            success: true,
            deleted: deletedCount,
            kept: keptCount,
            message: `Limpeza concluída: ${deletedCount} caches antigos deletados, ${keptCount} mantidos`
        };

    } catch (error) {
        console.error('Erro ao limpar cache:', error);
        throw new HttpsError('internal', error.message);
    }
});
