# 🔐 Instruções de Segurança - Firebase

## ⚠️ AÇÃO URGENTE NECESSÁRIA

As credenciais Firebase atuais **foram expostas publicamente** e precisam ser rotacionadas imediatamente.

---

## 1. Rotação de Credenciais Firebase

### Passo 1: Acessar Firebase Console
1. Acesse: https://console.firebase.google.com
2. Selecione o projeto: `gen-lang-client-0295226702`

### Passo 2: Regenerar API Key
1. Navegue para: **Configurações do Projeto** (ícone de engrenagem) → **Geral**
2. Role até a seção **Seus apps**
3. Localize o app Web: `1:824983678812:web:38cadefc613fe4d08a9b99`
4. Clique em **Config** (ou no ícone de engrenagem do app)
5. **IMPORTANTE:** Antes de regenerar, documente as credenciais antigas
6. Regenere a **API Key** (pode ser necessário suporte do Firebase)

### Passo 3: Atualizar .env.local
Após obter as novas credenciais, atualize o arquivo `.env.local`:

```env
VITE_FIREBASE_API_KEY=sua-nova-chave-aqui
VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0295226702.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0295226702
VITE_FIREBASE_STORAGE_BUCKET=gen-lang-client-0295226702.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=824983678812
VITE_FIREBASE_APP_ID=nova-app-id-se-gerada
VITE_FIREBASE_MEASUREMENT_ID=G-02X1R8K5FK
```

### Passo 4: Testar Localmente
```bash
npm run dev
```

Verifique se:
- ✅ Login funciona
- ✅ Firestore lê/escreve dados
- ✅ Storage funciona

---

## 2. Deploy das Firestore Security Rules

### Opção A: Via Firebase Console (Recomendado para primeira vez)

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto
3. Navegue para: **Firestore Database** → **Regras**
4. Cole o conteúdo do arquivo `firestore.rules` (raiz do projeto)
5. Clique em **Publicar**

### Opção B: Via Firebase CLI

```bash
# Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar projeto (apenas primeira vez)
firebase init firestore

# Deploy das regras
firebase deploy --only firestore:rules
```

---

## 3. Configurar Custom Claims para Admins

As regras de segurança agora usam `role == 'admin'` no documento do usuário.

### Opção A: Manualmente via Firestore Console

1. Acesse: **Firestore Database**
2. Navegue para: `users/{uid-do-admin}`
3. Edite o documento e adicione/atualize:
   ```json
   {
     "role": "admin"
   }
   ```

### Opção B: Via Cloud Function (Mais Seguro - Recomendado)

Crie uma Cloud Function que só você pode executar:

```typescript
// functions/src/index.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

export const setAdminRole = functions.https.onCall(async (data, context) => {
  // Verificar se quem está chamando é um admin autorizado
  const callerEmail = context.auth?.token.email;
  const authorizedEmails = ['seu-email-principal@gmail.com'];
  
  if (!authorizedEmails.includes(callerEmail || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Não autorizado');
  }
  
  const { email } = data;
  const userRecord = await admin.auth().getUserByEmail(email);
  
  // Set custom claim
  await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
  
  // Atualizar Firestore
  await admin.firestore().collection('users').doc(userRecord.uid).update({
    role: 'admin'
  });
  
  return { success: true };
});
```

---

## 4. Remover ADMIN_EMAILS Hardcoded

Após migrar para Custom Claims/Firestore role, remover:

**Arquivo:** `constants.ts`
```typescript
// DELETAR ESTA LINHA:
export const ADMIN_EMAILS = ['marcuspalucci@gmail.com'];
```

**Arquivo:** `App.tsx` (linha 234)
```typescript
// SUBSTITUIR:
const isAdmin = user?.role === 'admin' || ADMIN_EMAILS.includes(user?.email || '');

// POR:
const isAdmin = user?.role === 'admin';
```

---

## 5. Configurar Gemini API Key

### Obter sua chave:
1. Acesse: https://aistudio.google.com/apikey
2. Crie ou copie sua API Key
3. Atualize no `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=sua-chave-gemini-aqui
   ```

### ⚠️ IMPORTANTE:
A API Key do Gemini **NÃO deve ficar exposta** no frontend. Este é um problema de segurança que será resolvido na **Fase 1.5 - Backend para Gemini**.

Temporariamente, a chave ficará no frontend, mas em produção você DEVE criar Cloud Functions ou API Routes.

---

## 6. Verificação Final

Após completar todos os passos:

- [ ] ✅ Credenciais Firebase rotacionadas
- [ ] ✅ `.env.local` atualizado com novas credenciais
- [ ] ✅ Firestore Rules deployed
- [ ] ✅ Admins configurados via `role` no Firestore
- [ ] ✅ `ADMIN_EMAILS` removido do código
- [ ] ✅ Gemini API Key configurada
- [ ] ✅ Aplicação funcionando localmente
- [ ] 🔄 **(Pendente)** Mover Gemini para backend (Fase 1.5)

---

## 7. Próximos Passos (Fase 1.5)

Para segurança total, a chamada de IA deve sair do frontend:

1. Criar Cloud Functions no Firebase
2. Mover toda lógica de `geminiService.ts` para o backend
3. Frontend faz requisições HTTP para as functions
4. API Key do Gemini fica APENAS no backend

Veja: `doc/implementation_plan.md` → Fase 1.4
