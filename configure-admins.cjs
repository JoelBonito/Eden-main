/**
 * Script para configurar usuários como admin no Firestore
 * 
 * Uso: node configure-admins.js
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin com credenciais do projeto
const serviceAccount = {
    projectId: "gen-lang-client-0295226702",
};

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    ...serviceAccount
});

const db = admin.firestore();

// Emails dos usuários que devem ser admins
const ADMIN_EMAILS = [
    'marcuspalucci@gmail.com',
    'jbento1@gmail.com'
];

async function configureAdmins() {
    console.log('🔧 Configurando administradores...\n');

    for (const email of ADMIN_EMAILS) {
        try {
            console.log(`Processando: ${email}`);

            // Buscar usuário por email no Auth
            const userRecord = await admin.auth().getUserByEmail(email);
            console.log(`  ✓ Usuário encontrado no Auth (UID: ${userRecord.uid})`);

            // Atualizar documento no Firestore
            const userDocRef = db.collection('users').doc(userRecord.uid);
            const userDoc = await userDocRef.get();

            if (userDoc.exists) {
                await userDocRef.update({
                    role: 'admin'
                });
                console.log(`  ✓ Role 'admin' atualizada no Firestore\n`);
            } else {
                console.log(`  ⚠️  Documento não existe no Firestore. Criando...\n`);
                await userDocRef.set({
                    name: userRecord.displayName || 'Admin',
                    email: userRecord.email,
                    role: 'admin',
                    age: 0,
                    language: 'pt'
                });
                console.log(`  ✓ Documento criado com role 'admin'\n`);
            }

        } catch (error) {
            console.error(`  ✗ Erro ao processar ${email}:`, error.message, '\n');
        }
    }

    console.log('✅ Configuração concluída!');
    process.exit(0);
}

configureAdmins().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
});
