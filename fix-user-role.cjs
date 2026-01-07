const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "gen-lang-client-0295226702"
});

const db = admin.firestore();

async function checkAndFixUser() {
    const uid = 'f2WzvY0F30hoMYnla04Wm2c77XQ2'; // jbento1@gmail.com
    const userRef = db.collection('users').doc(uid);

    try {
        const doc = await userRef.get();

        if (doc.exists) {
            console.log('📄 Documento encontrado:');
            console.log(JSON.stringify(doc.data(), null, 2));

            // Atualizar para adicionar role admin
            await userRef.update({ role: 'admin' });
            console.log('\n✅ Campo "role: admin" atualizado!');

            // Verificar novamente
            const updatedDoc = await userRef.get();
            console.log('\n📄 Documento atualizado:');
            console.log(JSON.stringify(updatedDoc.data(), null, 2));
        } else {
            console.log('❌ Documento não encontrado. Criando...');
            await userRef.set({
                email: 'jbento1@gmail.com',
                name: 'Joel Bento',
                role: 'admin',
                age: 0,
                language: 'pt'
            });
            console.log('✅ Documento criado com role admin!');
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }

    process.exit(0);
}

checkAndFixUser();
