# 🚀 Deploy Cloud Functions - Guia Completo

## Status Atual

✅ **Cloud Functions criadas:**
- `getBibleContent` - Buscar conteúdo bíblico via Gemini
- `generateStoryboard` - Gerar storyboard de cenas
- `findBiblicalLocations` - Encontrar localizações geográficas

⏳ **Pendente:** Configurar GEMINI_API_KEY e fazer deploy

---

## Passo 1: Configurar GEMINI_API_KEY

### Opção A: Via Firebase Secrets (Recomendado)

```bash
firebase functions:secrets:set GEMINI_API_KEY --project gen-lang-client-0295226702
```

Quando solicitado, cole sua Gemini API Key (a mesma que está no `.env.local`)

### Opção B: Via Firebase Config

```bash
# Obter a chave do .env.local
GEMINI_KEY=$(grep VITE_GEMINI_API_KEY .env.local | cut -d '=' -f2)

# Configurar via Firebase
firebase functions:config:set gemini.api_key="$GEMINI_KEY" --project gen-lang-client-0295226702
```

E atualizar `functions/index.js` linha 8 para:
```javascript
const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);
```

---

## Passo 2: Deploy das Functions

```bash
firebase deploy --only functions --project gen-lang-client-0295226702
```

**Tempo estimado:** 3-5 minutos

---

## Passo 3: Atualizar Frontend

Após deploy bem-sucedido, você precisa atualizar o `services/geminiService.ts` para chamar as Cloud Functions ao invés de fazer chamadas diretas ao Gemini.

### 3.1 Instalar SDK

```bash
npm install firebase
```

### 3.2 Atualizar geminiService.ts

**Antes:**
```typescript
import { GoogleGenAI } from '@google/genai';
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Depois:**
```typescript
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

export async function getBibleContent(book: string, chapter: number, translation: string = 'NVI') {
  const func = httpsCallable(functions, 'getBibleContent');
  const result = await func({ book, chapter, translation });
  return result.data;
}
```

---

## Passo 4: Testar

1. Faça login na aplicação
2. Tente buscar um capítulo bíblico
3. Verifique no console se a chamada está indo para as Cloud Functions
4. Logs das functions: https://console.firebase.google.com/project/gen-lang-client-0295226702/functions/logs

---

## Verificação

✅ **Como saber se funcionou:**
- No Network tab (F12), você verá requisições para:
  - `https://us-central1-gen-lang-client-0295226702.cloudfunctions.net/getBibleContent`
- A Gemini API Key NÃO estará mais no bundleware do frontend
- Apenas usuários autenticados podem chamar as functions

---

## Troubleshooting

### Erro: "Missing or insufficient permissions"
- As Cloud Functions já verificam autenticação via `checkAuth()`
- Certifique-se de estar logado

### Erro: "GEMINI_API_KEY not set"
- Execute o Passo 1 novamente
- Verifique: `firebase functions:config:get --project gen-lang-client-0295226702`

### Erro: "Function not found"
- Faça deploy novamente
- Verifique se o deploy completou sem erros

---

## Custo

**Firebase Functions** (Pricing):
- **Primeiras 2 milhões de invocações/mês:** GRÁTIS
- **Depois:** $0.40 por milhão

Para este app com poucos usuários, deve ficar no free tier.

---

## Próximos Passos

Depois de testar as primeiras 3 functions, você pode:
1. Migrar as outras functions do `geminiService.ts` (generateVisualSummary, searchBibleReferences, etc.)
2. Adicionar caching no backend para reduzir chamadas ao Gemini
3. Implementar rate limiting por usuário

---

## Comandos Rápidos

```bash
# Ver logs em tempo real
firebase functions:log --project gen-lang-client-0295226702

# Deletar uma function
firebase functions:delete FUNCTION_NAME --project gen-lang-client-0295226702

# Redeploy apenas uma function
firebase deploy --only functions:getBibleContent --project gen-lang-client-0295226702
```
