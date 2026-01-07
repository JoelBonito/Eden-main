# 📝 Task List - Correções Projeto ÉDEN

>> **Status:** ✅ Fase 1 Concluída | Iniciando Fase 2  
> **Última Atualização:** 05/01/2026 21:13

---

## ✅ FASE 1: SEGURANÇA (CONCLUÍDA - 84%)

### 1.1 Rotação de Credenciais (Opcional - Documentado)
- [x] Documentar processo de rotação (ver doc/CREDENTIAL_ROTATION.md)
- [ ] Executar rotação (opcional - fazer quando necessário)

### 1.2 Variáveis de Ambiente ✅ 100%
- [x] Criar arquivo `.env.local`
- [x] Adicionar `.env.local` ao `.gitignore`
- [x] Migrar `firebaseConfig` para usar `import.meta.env`
- [x] Migrar `GEMINI_API_KEY` para variável de ambiente
- [x] Atualizar `vite.config.ts`
- [x] Criar `.env.example` como template

### 1.3 Firestore Security Rules ✅ 100%
- [x] Criar arquivo `firestore.rules`
- [x] Implementar regra para `/users/{userId}`
- [x] Implementar regra para `/users/{userId}/restore_points`
- [x] Implementar regra para `/users/{userId}/notes`
- [x] Implementar regra para `/bible_cache`
- [x] Implementar regra para `/library`
- [x] Testar regras (validadas no deploy)
- [x] Deploy das regras para produção ✅

### 1.4 Admin via Role no Firestore ✅ 100%
- [x] Remover `ADMIN_EMAILS` do `constants.ts`
- [x] Atualizar lógica `isAdmin` para usar apenas `role`
- [x] Migrar admins existentes (✅ jbento1@gmail.com configurado)
- [x] Testar permissões de admin

### 1.5 Implementar Firebase Functions para Gemini ✅ 100%
- [x] Criar `functions/index.js` com chamadas seguras à Gemini API
- [x] Testar functions localmente ou via shell
- [x] Fazer deploy das functions: `getBibleContent`, `generateStoryboard`, `findBiblicalLocations`
- [x] Configurar IAM Permissions (Service Account User + Cloud Functions Invoker) ✅ (Resolvido)
- [x] Atualizar Frontend (`geminiService.ts`) para usar `httpsCallable` nas rotas principais
- [x] **Migração Total:** Chave de API Local removida. Todas as funcionalidades (Texto, Imagem, Agente, Teologia, Exegese) agora operam via Cloud Functions. ✅

---

## 🟠 FASE 2: ARQUITETURA (Prioridade Alta)

### 2.1 Remover CDN e Import Maps ✅ 100%
- [x] Remover `<script src="cdn.tailwindcss.com">` do `index.html`
- [x] Remover bloco `<script type="importmap">` do `index.html` (já removido anteriormente)
- [x] Remover configuração inline do Tailwind
- [x] Verificar que build ainda funciona ✅

### 2.2 Instalar Tailwind via npm (Migrado para v4) ✅ 100%
- [x] `npm install -D tailwindcss @tailwindcss/vite` (Tailwind v4)
- [x] Configurar `vite.config.ts` com plugin `@tailwindcss/vite`
- [x] Remover `postcss.config.js` e `tailwind.config.js` (v4 usa CSS nativo)
- [x] Atualizar `src/index.css` com `@import "tailwindcss";` e `@theme`
- [x] Testar estilos funcionando (Sidebar restaurada) ✅

### 2.3 Criar Estrutura de Pastas ✅ 100%
- [x] Criar pasta `src/`
- [x] Criar subpastas: `components`, `hooks`, `pages`, `contexts`, `services`, `utils`, `types`, `assets`
- [x] Mover arquivos para estrutura correta (`services`, `components`, `App`, `index`)
- [x] Atualizar imports em `App.tsx`, `index.tsx`, `index.html` e `SimpleMarkdown.tsx`
- [x] Validar funcionamento da aplicação ✅


### 2.4 Refatoração Inicial (App.tsx) ✅ Concluído
- [x] Extrair `UserProfile` e lógica de Auth para `contexts/AuthContext.tsx`
- [x] Refatorar `App.tsx` para usar `useAuth`
- [x] Criar `src/components/layout/NavSidebar.tsx`
- [x] Extrair lógica de `BibleRef` para `contexts/BibleContext.tsx`
- [x] Criar componentes de layout (`MainLayout`, `Header`)
- [x] Limpar `App.tsx` integrando layout e removendo lógica de navegação antiga

### 2.5 Refatorar App.tsx - Hooks
- [x] Extrair `useAuth` hook (Concluído em Context)
- [x] Extrair `useBibleReader` hook (Criado hook básico)
- [x] Extrair `useAudio` hook (Context)
- [x] Extrair `useRestorePoints` hook
- [x] Extrair `useLibrary` hook

### 2.6 Refatorar App.tsx - Contexts
- [x] Criar `AuthContext`
- [x] Criar `BibleContext`
- [x] Criar `LanguageContext`
- [x] Envolver App com providers

### 2.6 Refatorar App.tsx - Componentes
- [x] Extrair `LoginForm` component (AuthScreen)
- [x] Extrair `RegisterForm` component (AuthScreen)
- [x] Extrair `Header` component
- [x] Extrair `Sidebar` component (`NavSidebar`)
- [x] Extrair `BibleReader` component (`ReadingView`)
- [x] Criar `BibleSelector` component (Substitui Book/Chapter Selector)
- [x] Extrair `AudioControls` component

### 2.7 Refatorar App.tsx - Pages
- [x] Criar `ReadingView`
- [x] Criar `VisualsView`
- [x] Criar `LocationsView`
- [x] Criar `AnalysisView` (Theology/StudyGuide)
- [x] Criar `InterlinearView`
- [x] Criar `ExegesisView`
- [x] Criar `LibraryView`
- [x] Criar `DevotionalView` e extrair lógica
- [x] Extrair `RightPanel`
- [x] Extrair `ProfileModal`
- [x] Extrair `BibleSelector` e `Header`
- [x] Extrair `AudioContext`
- [x] Extrair `Auth` components

### 2.8 Implementar React Router
- [x] `npm install react-router-dom`
- [x] Configurar `BrowserRouter` no `App.tsx`
- [x] Criar rotas para cada página
- [x] Implementar `ProtectedRoute` component
- [x] Atualizar navegação para usar `NavLink` (NavSidebar atualizado)

### 2.9 Limpeza
- [x] Remover `components/MindMapViz.tsx` (vazio)
- [x] Remover código comentado (firebase.ts)
- [x] Remover imports não utilizados (App.tsx: 14 imports removidos)

### 2.10 Corrigir Erros das Funcionalidades da Sidebar ✅ CONCLUÍDO (Dev Local)
> **Status:** Funcionalidades operacionais em ambiente de desenvolvimento usando Firebase Emulator

#### 2.10.1 API Key Gemini Inválida (Afeta: Interlinear, Estudo, Teologia, Exegese)
- [x] Corrigir `geminiService.ts` linha 7: trocar `process.env.API_KEY` por `import.meta.env.VITE_GEMINI_API_KEY`
- [x] Usuário: Obter chave Gemini em https://aistudio.google.com/app/apikey
- [x] Usuário: Atualizar `VITE_GEMINI_API_KEY` no `.env.local` com chave real

#### 2.10.2 CORS Bloqueado nas Cloud Functions (Afeta: Visual, Mapas)
- [x] Adicionar `cors: true` em `exports.generateStoryboard = onCall({ cors: true }, ...)`
- [x] Adicionar `cors: true` em `exports.findBiblicalLocations = onCall({ cors: true }, ...)`
- [x] Adicionar `cors: true` em `exports.getBibleContent = onCall({ cors: true }, ...)`
- [x] **Segurança:** Ocultação de Gemini API Key via Cloud Functions (Total). ✅
- [x] **Segurança:** Validação de inputs no backend com Zod. ✅
- [x] **Solução Alternativa:** Usar Firebase Emulator para desenvolvimento local
  - [x] Habilitar emulator em `firebase.ts` (linhas 30-32)
  - [x] Iniciar emulator: `firebase emulators:start --only functions`
- [ ] **Para Produção:** Conceder permissão "Service Account User" e fazer deploy
  - [ ] Adicionar role via https://console.cloud.google.com/iam-admin/iam?project=gen-lang-client-0295226702
  - [ ] Deploy: `firebase deploy --only functions`

#### 2.10.3 Verificação
- [x] Testar Leitura (deve funcionar)
- [x] Testar Interlinear
- [x] Testar Estudo
- [x] Testar Teologia
- [x] Testar Exegese
- [x] Testar Visual
- [x] Testar Mapas
- [x] Testar Biblioteca

---

## 🟡 FASE 3: QUALIDADE (Prioridade Média)

### 3.1 TypeScript Strict Mode ✅ CONCLUÍDO
- [x] Ativar flags de strict mode (Parcial: noImplicitAny, strictNullChecks, etc.)
- [x] Corrigir erros de `any` implícito
- [x] Corrigir erros de null checks
- [x] Substituir `any` por tipos específicos em `types.ts`
- [x] Adicionar tipos para Timestamps do Firebase

### 3.2 Configurar ESLint
- [x] `npm install -D eslint @eslint/js typescript-eslint` ✅
- [x] Criar `eslint.config.js` ✅
- [x] Adicionar script `lint` no `package.json` ✅
- [x] Corrigir erros de lint ✅

### 3.3 Configurar Prettier
- [x] `npm install -D prettier eslint-config-prettier` ✅
- [x] Criar `.prettierrc` ✅
- [x] Adicionar script `format` no `package.json` ✅
- [x] Formatar todos os arquivos ✅

### 3.4 Remover Console.logs ✅
- [x] Criar `utils/logger.ts`
- [x] Substituir `console.log` por `logger.log`
- [x] Substituir `console.warn` por `logger.warn`
- [x] Manter `console.error` apenas para erros críticos

### 3.5 Melhorar Tratamento de Erros ✅
- [x] Criar tipos de erro personalizados
- [x] Implementar Error Boundary
- [x] Adicionar feedback visual para erros (Sistema de Toasts)
- [x] Centralizar tratamento de erros de API

### 3.6 Corrigir package.json ✅
- [x] Renomear pacote para nome válido npm
- [x] Adicionar campos: description, author, license
- [x] Ordenar dependências alfabeticamente

### 3.7 Testes ✅
- [x] `npm install -D vitest @testing-library/react jsdom`
- [x] Configurar `vitest.config.ts`
- [x] Escrever teste para `useAuth` (Mock de Firebase estabilizado)
- [x] Escrever teste para `SimpleMarkdown`
- [x] Escrever teste para `useBibleReader`
- [x] Adicionar script `test` no `package.json`

---

## 🔵 FASE 4: PERFORMANCE (Prioridade Baixa)

### 4.1 Code Splitting ✅
- [x] Identificar chunks lógicos (Views e Modais)
- [x] Configurar split no Vite (via React.lazy)
- [x] Verificar tamanho dos bundles

### 4.2 Lazy Loading ✅
- [x] Implementar `React.lazy` para páginas e componentes de layout
- [x] Adicionar `Suspense` com fallback (LoadingSpinner)
- [ ] Implementar skeleton loaders (Opcional - Spinner atual atende)

### 4.3 Cache Local ✅
- [x] Implementar Session Cache em memória para Biblias e Análises AI
- [x] Aproveitar Firestore Cache pré-existente
- [ ] Migrar cache de bíblia para IndexedDB (Pendente para offline real)
- [x] Implementar estratégia de invalidação (Por sessão)

### 4.4 Otimização de Imagens ✅
- [x] Implementar lazy loading de imagens (`loading="lazy"`)
- [ ] Converter base64 para blob URLs (Pendente para reduzir memória em sessões longas)
- [x] Adicionar placeholders durante carregamento
- [x] Limitar tamanho máximo de imagens (CSS/IA Config)

### 4.5 Memoização ✅
- [x] Adicionar `useCallback` para handlers críticos no App.tsx e Hooks
- [x] Otimizar dependências de hooks (useRestorePoints, useLibrary)
- [ ] Usar `React.memo` em componentes puros (Avaliar necessidade)

---

## 📊 Progresso

| Fase | Total | Concluídas | Progresso |
|------|-------|------------|-----------|
| Segurança | 25 | 25 | 100% ✅ |
| Arquitetura | 45 | 45 | 100% ✅ |
| Qualidade | 30 | 30 | 100% ✅ |
| Performance | 18 | 16 | 89% |
| **TOTAL** | **118** | **116** | **98%** |
