# 📋 Instruções de Deploy e Manutenção do Banco de Dados

## ✅ Status das Operações

### 1. Deploy dos Índices do Firestore ⚠️ REQUER AÇÃO MANUAL

**Status**: Falhou por falta de permissões

**O que fazer**:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione o projeto `gen-lang-client-0295226702`
3. Vá em **Firestore Database** → **Indexes**
4. Clique em **Add Index** e crie os seguintes índices manualmente:

#### Índice 1: restore_points
- Collection ID: `restore_points`
- Fields to index:
  - `timestamp` → Descending
- Query scope: Collection

#### Índice 2: library
- Collection ID: `library`
- Fields to index:
  - `createdAt` → Descending
- Query scope: Collection

#### Índice 3: history
- Collection ID: `history`
- Fields to index:
  - `uid` → Ascending
  - `timestamp` → Descending
- Query scope: Collection

**OU** solicite permissões de **Editor** ou **Owner** no projeto e execute:
```bash
firebase deploy --only firestore:indexes
```

---

### 2. Limpeza de Cache Antigo ✅ PRONTO PARA EXECUTAR

**Status**: Cloud Function criada e pronta

**Como executar**:

#### Opção A: Via Interface Admin (Recomendado)
1. Faça login como administrador no app
2. Acesse a página de administração (você precisará criar uma rota para isso)
3. Importe o componente `AdminMaintenance`:
   ```tsx
   import { AdminMaintenance } from './components/admin/AdminMaintenance';
   ```
4. Clique no botão "🧹 Limpar Cache Antigo"

#### Opção B: Via Console do Navegador
1. Abra o DevTools (F12)
2. Cole este código no console:
   ```javascript
   const { functions } = await import('./services/firebase');
   const cleanOldCacheFn = functions.httpsCallable('cleanOldCache');
   const result = await cleanOldCacheFn();
   console.log(result.data);
   ```

#### Opção C: Via Script Node.js (Requer Service Account Key)
1. Baixe a Service Account Key do Firebase Console:
   - Settings → Service Accounts → Generate New Private Key
2. Salve como `serviceAccountKey.json` na raiz do projeto
3. Execute:
   ```bash
   node scripts/cleanOldCache.js
   ```

---

### 3. Performance Monitoring ✅ ATIVADO

**Status**: Configurado e ativo em produção

**O que foi feito**:
- ✅ Importado `firebase/compat/performance`
- ✅ Inicializado apenas em produção (não em localhost)
- ✅ Exportado para uso em toda a aplicação

**Como monitorar**:
1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Vá em **Performance** no menu lateral
3. Aguarde algumas horas para os primeiros dados aparecerem
4. Monitore:
   - Page load times
   - Network requests latency
   - Custom traces (se adicionar)

**Adicionar traces customizados** (opcional):
```typescript
import { performance } from './services/firebase';

// Exemplo: medir tempo de uma operação
const trace = performance?.trace('load_bible_chapter');
trace?.start();
// ... sua operação ...
trace?.stop();
```

---

## 🎯 Próximos Passos Recomendados

1. **Deploy dos Índices** (manual via console ou com permissões corretas)
2. **Executar limpeza de cache** (via opção A, B ou C acima)
3. **Monitorar Performance** (aguardar 24h para primeiros dados)
4. **Criar rota de admin** para acessar o componente `AdminMaintenance`

---

## 📊 Arquivos Criados/Modificados

- ✅ `firestore.indexes.json` - Definição dos índices
- ✅ `functions/index.js` - Adicionada função `cleanOldCache`
- ✅ `src/services/firebase.ts` - Ativado Performance Monitoring
- ✅ `src/hooks/useRestorePoints.ts` - Optimistic update (evita N+1)
- ✅ `src/services/geminiService.ts` - Cache com TTL de 30 dias
- ✅ `src/components/admin/AdminMaintenance.tsx` - Interface de manutenção
- ✅ `scripts/cleanOldCache.js` - Script alternativo de limpeza

---

## ⚠️ Importante

- Os índices são **críticos** para produção - queries vão falhar sem eles
- A limpeza de cache é **opcional** mas recomendada para economizar espaço
- Performance Monitoring já está **ativo** e coletando dados
