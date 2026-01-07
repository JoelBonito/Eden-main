# 👤 Como Configurar Administradores

## Visão Geral

O sistema de administração agora usa o campo `role` no documento do usuário no Firestore, ao invés de uma lista hardcoded de emails.

---

## Configurar um Usuário como Admin

### Opção 1: Via Firebase Console (Recomendado)

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto: `gen-lang-client-0295226702`
3. Vá em: **Firestore Database**
4. Navegue até a coleção: `users`
5. Encontre o documento do usuário que você quer tornar admin
   - Você pode procurar pelo email ou UID
6. Clique no documento para editar
7. Adicione ou atualize o campo:
   ```json
   {
     "role": "admin"
   }
   ```
8. Salve as alterações

### Opção 2: Via Cloud Function (Mais seguro para produção)

Crie uma Cloud Function que só pode ser executada por um super-admin:

```typescript
// functions/src/setAdmin.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const setAdminRole = functions.https.onCall(async (data, context) => {
  // Verificar se quem está chamando é autorizado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  // Lista de super-admins que podem criar outros admins
  const SUPER_ADMINS = ['marcuspalucci@gmail.com'];
  
  if (!SUPER_ADMINS.includes(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Apenas super-admins podem criar admins');
  }

  const { email } = data;

  try {
    // Buscar usuário por email
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Atualizar Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).update({
      role: 'admin'
    });
    
    return { 
      success: true, 
      message: `Usuário ${email} agora é admin` 
    };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

**Para chamar essa function do frontend:**

```typescript
const functions = firebase.functions();
const setAdminRole = functions.httpsCallable('setAdminRole');

try {
  const result = await setAdminRole({ email: 'novo-admin@example.com' });
  console.log(result.data.message);
} catch (error) {
  console.error('Erro ao definir admin:', error);
}
```

---

## Remover Permissões de Admin

Para remover as permissões de admin de um usuário:

1. Vá no Firestore Console
2. Abra o documento do usuário em `users/{uid}`
3. Altere o campo `role` para:
   ```json
   {
     "role": "user"
   }
   ```
4. Salve

---

## Verificar se Usuário é Admin

No código, você pode verificar assim:

```typescript
const isAdmin = user?.role === 'admin';

if (isAdmin) {
  // Mostrar funcionalidades de admin
}
```

---

## Primeiros Admins a Configurar

**Marcus Palucci:**
- Email: `marcuspalucci@gmail.com`
- Ação: Definir `role: "admin"` no Firestore

**Joel Bento (você):**
- Email: `jbento1@gmail.com`
- Ação: Definir `role: "admin"` no Firestore (se necessário)

---

## Segurança

✅ **Firestore Rules** já protegem o campo `role`:
- Usuários **NÃO podem** alterar seu próprio `role`
- Apenas admins podem modificar roles (via Cloud Function segura)
- As regras em `firestore.rules` garantem isso

⚠️ **Importante:**
- Nunca deixe um documento sem `role` definido
- Use `role: "user"` como padrão para usuários normais
- Use `role: "admin"` apenas para administradores

---

## Estrutura do Documento de Usuário

```typescript
interface UserProfile {
  name: string;
  email: string;
  age: number;
  phone?: string;
  nationality?: string;
  language?: 'pt' | 'en' | 'es';
  role: 'admin' | 'user';  // ← Campo de permissão
}
```

---

## Próximos Passos

1. ✅ Código atualizado para usar `role`
2. ⏳ Configure os primeiros admins no Firestore
3. ⏳ (Opcional) Implemente Cloud Function para gerenciar admins
