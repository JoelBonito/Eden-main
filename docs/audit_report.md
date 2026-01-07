# 🔍 Auditoria Profunda - Projeto ÉDEN

> **Data:** 05/01/2026  
> **Projeto:** ÉDEN – De volta ao princípio  
> **Stack:** React 19 + TypeScript + Firebase + Gemini AI  

---

## 📋 Resumo Executivo

| Categoria | Status | Qtd. de Problemas |
|-----------|--------|-------------------|
| 🔴 Segurança | **Crítico** | 4 |
| 🟠 Arquitetura | **Severo** | 6 |
| 🟡 Performance | **Moderado** | 5 |
| 🔵 Qualidade de Código | **Moderado** | 8 |
| 🟢 Pontos Positivos | ✓ | 7 |

---

## 🔴 PROBLEMAS CRÍTICOS DE SEGURANÇA

### 1. Credenciais Firebase Expostas no Código-Fonte

> [!CAUTION]
> **Impacto: CRÍTICO** – Credenciais da Firebase estão hardcoded e visíveis publicamente.

**Arquivo:** `services/firebase.ts` (linhas 8-16)

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDELb5XdsWYaZhdN6pk6JyP-wwC-53CVZo",  // ⚠️ EXPOSTA
  authDomain: "gen-lang-client-0295226702.firebaseapp.com",
  projectId: "gen-lang-client-0295226702",
  storageBucket: "gen-lang-client-0295226702.firebasestorage.app",
  messagingSenderId: "824983678812",
  appId: "1:824983678812:web:38cadefc613fe4d08a9b99",
  measurementId: "G-02X1R8K5FK"
};
```

**Solução:**
- Mover credenciais para variáveis de ambiente (`.env.local`)
- Adicionar `.env.local` ao `.gitignore`
- **Rotacionar as chaves atuais** (já estão comprometidas)

---

### 2. Email de Admin Hardcoded

> [!WARNING]
> **Impacto: ALTO** – Controle de acesso baseado em email fixo no código.

**Arquivo:** `constants.ts` (linha 2)

```typescript
export const ADMIN_EMAILS = ['marcuspalucci@gmail.com'];
```

**Solução:**
- Usar Firebase Custom Claims para roles
- Mover lista de admins para Firestore com regras de segurança

---

### 3. Sem Firestore Security Rules

> [!CAUTION]
> **Impacto: CRÍTICO** – Não há evidência de regras de segurança no Firestore.

**Solução:**
- Criar `firestore.rules` com regras restritivas
- Validar permissões por usuário autenticado

---

### 4. API Key Gemini via process.env sem Proteção

**Arquivo:** `services/geminiService.ts` (linha 7)

```typescript
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Solução:**
- Usar API Routes ou Cloud Functions para chamadas de IA
- Nunca expor API keys no frontend

---

## 🟠 PROBLEMAS DE ARQUITETURA

### 1. App.tsx Monolítico (2.041 linhas)

> [!IMPORTANT]
> **Arquivo único com TODA a lógica da aplicação.**

**Problemas:**
- 60+ estados no mesmo componente
- 40+ funções no mesmo escopo
- Sem separação de responsabilidades

**Solução:**
- Separar em componentes menores
- Criar hooks customizados
- Implementar Context API ou Zustand

---

### 2. Tailwind via CDN no HTML

**Arquivo:** `index.html` (linha 8)

```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Solução:**
- Instalar Tailwind como dependência npm
- Configurar PostCSS e purge

---

### 3. Import Maps Conflitantes

O projeto usa **DOIS** sistemas de módulos (npm + CDN importmap).

**Solução:**
- Remover import maps
- Usar apenas bundler (Vite)

---

### 4. Sem Estrutura de Pastas Adequada

**Solução:** Criar estrutura:
- `pages/` - Para rotas
- `hooks/` - Para lógica reutilizável
- `contexts/` - Para estado global
- `utils/` - Para funções auxiliares

---

### 5. Componente MindMapViz Vazio

Arquivo existe mas está vazio. Deve ser removido.

---

### 6. Sem Roteamento

**Solução:** Implementar React Router

---

## 🟡 PROBLEMAS DE PERFORMANCE

1. Sem Code Splitting
2. Sem Lazy Loading
3. Cache de Bíblia no Firestore (custos)
4. Imagens Base64 Inline
5. Sem Memoização Adequada

---

## 🔵 PROBLEMAS DE QUALIDADE DE CÓDIGO

1. TypeScript sem `strict: true`
2. Uso de `any` em Tipos
3. Sem Testes
4. Sem ESLint/Prettier
5. Console.logs em Produção
6. Tratamento de Erros Inconsistente
7. Comentários Insuficientes
8. Nome de Pacote Inválido

---

## 🟢 PONTOS POSITIVOS

| ✓ | Descrição |
|---|-----------|
| ✅ | Tipos bem definidos em `types.ts` |
| ✅ | Internacionalização (PT, EN, ES) |
| ✅ | Cache inteligente para conteúdo bíblico |
| ✅ | Retry com backoff exponencial |
| ✅ | Componente SimpleMarkdown bem implementado |
| ✅ | Estrutura de dados bíblica completa |
| ✅ | Funcionalidades ricas (Interlinear, Teologia, Exegese) |
