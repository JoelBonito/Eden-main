# 👤 Configurar Administradores - Guia Rápido

## ⚠️ Ação Necessária: Configurar Admins no Firestore

As regras de segurança foram deployadas com sucesso! ✅

Agora você precisa configurar os usuários administradores no Firestore.

---

## Opção 1: Via Firebase Console (Mais Rápido - 2 minutos)

### Passo 1: Acessar Firestore
1. Acesse: https://console.firebase.google.com/project/gen-lang-client-0295226702/firestore
2. Faça login com `jbento1@gmail.com`

### Passo 2: Configurar Marcus como Admin
1. Na coleção `users`, procure pelo documento do usuário `marcuspalucci@gmail.com`
   - Você pode usar o campo de busca ou navegar pelos documentos
   - O ID do documento é o UID do usuário
2. Clique no documento para editá-lo
3. Adicione ou atualize o campo:
   - **Campo:** `role`
   - **Valor:** `admin` (tipo: string)
4. Clique em **Salvar**

### Passo 3: Configurar Você mesmo como Admin
1. Na coleção `users`, procure pelo documento do usuário `jbento1@gmail.com`
2. Clique no documento para editá-lo
3. Adicione ou atualize o campo:
   - **Campo:** `role`  
   - **Valor:** `admin` (tipo: string)
4. Clique em **Salvar**

---

## Opção 2: Via Script na Aplicação (Temporário - apenas para setup inicial)

### Adicione este código temporário no App.tsx:

```typescript
// CÓDIGO TEMPORÁRIO - REMOVER APÓS SETUP
const setupAdmins = async () => {
  if (!auth.currentUser) return;
  
  const admins = ['marcuspalucci@gmail.com', 'jbento1@gmail.com'];
  
  for (const email of admins) {
    try {
      // Buscar usuário por email (você precisaria ter os UIDs)
      const userQuery = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({ role: 'admin' });
        console.log(`✓ ${email} configurado como admin`);
      }
    } catch (error) {
      console.error(`Erro ao configurar ${email}:`, error);
    }
  }
};

// Chame uma vez:
// setupAdmins();
```

⚠️ **Importante:** Este método só funciona se:
- Você já tiver os documentos dos usuários no Firestore
- As regras de segurança permitirem (pode dar erro de permissão)

---

## Opção 3: Via Firebase CLI + Script (Mais Técnico)

Se quiser usar o script `configure-admins.cjs`, você precisa:

1. Gerar uma Service Account Key:
   - https://console.firebase.google.com/project/gen-lang-client-0295226702/settings/serviceaccounts/adminsdk
   - Clique em "Gerar nova chave privada"
   - Baixe o arquivo JSON

2. Configurar a variável de ambiente:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/caminho/para/service-account-key.json"
   ```

3. Executar o script:
   ```bash
   node configure-admins.cjs
   ```

⚠️ **NUNCA** commite a service account key no git!

---

## Como Verificar se Funcionou

1. Faça login na aplicação com `jbento1@gmail.com` ou `marcuspalucci@gmail.com`
2. Verifique no console do navegador se não há mais warnings de permissão
3. Funcionalidades de admin devem estar disponíveis

---

## Recomendação

**Use a Opção 1 (Console)** - é a mais rápida e segura para este setup inicial.

Depois de configurar:
- ✅ Firestore Rules: Deployadas
- ✅ Admins: Configurados
- ✅ Fase 1 quase completa!

---

## Próximo Passo Após Configurar Admins

Testar a aplicação e verificar se:
1. Login funciona
2. Usuários normais têm acesso limitado
3. Admins têm acesso completo
4. Firestore Rules bloqueiam acessos não autorizados
