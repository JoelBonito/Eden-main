/**
 * Script para limpar caches antigos do Firestore (sem campo expiresAt)
 * Execute com: node scripts/cleanOldCache.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Você precisa baixar isso do console Firebase

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanOldCache() {
    console.log('🧹 Iniciando limpeza de cache antigo...\n');

    try {
        // Buscar todos os documentos da coleção bible_cache
        const snapshot = await db.collection('bible_cache').get();

        let deletedCount = 0;
        let keptCount = 0;
        const batch = db.batch();

        snapshot.forEach((doc) => {
            const data = doc.data();

            // Se não tem expiresAt, marca para deletar
            if (!data.expiresAt) {
                batch.delete(doc.ref);
                deletedCount++;
                console.log(`❌ Deletando cache sem TTL: ${doc.id}`);
            } else {
                keptCount++;
                console.log(`✅ Mantendo cache válido: ${doc.id} (expira em ${data.expiresAt.toDate()})`);
            }
        });

        // Executa o batch delete
        if (deletedCount > 0) {
            await batch.commit();
            console.log(`\n✅ Limpeza concluída!`);
            console.log(`   - ${deletedCount} caches antigos deletados`);
            console.log(`   - ${keptCount} caches válidos mantidos`);
        } else {
            console.log('\n✨ Nenhum cache antigo encontrado. Tudo limpo!');
        }

    } catch (error) {
        console.error('❌ Erro ao limpar cache:', error);
        process.exit(1);
    }

    process.exit(0);
}

cleanOldCache();
