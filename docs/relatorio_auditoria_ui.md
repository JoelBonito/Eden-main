# 🎨 Plano de Correção de UI - Projeto Eden

## 📊 Resumo Executivo

**Status Geral**: ⚠️ **REQUER ATENÇÃO IMEDIATA**

| Categoria | Status | Prioridade |
|-----------|--------|------------|
| Design System | ❌ **Crítico** | 🔴 Alta |
| Responsividade | ⚠️ **Parcial** | 🟡 Média |
| Dark Mode | ❌ **Ausente** | 🔴 Alta |
| Componentes UI | ❌ **Ausente** | 🟡 Média |

---

## 🔴 PRIORIDADE 1 - Correções Críticas

### **1.1 Refatorar Cores Hardcoded** (47 ocorrências)

**Problema**: `bg-white` e `text-black` hardcoded impedem Dark Mode e dificultam manutenção.

**Solução Automática**:
```bash
chmod +x scripts/refactor-colors.sh
./scripts/refactor-colors.sh
```

**Solução Manual** (recomendado para maior controle):

#### **Arquivos prioritários para refatorar**:

1. **AuthScreen.tsx** (12 ocorrências)
   ```tsx
   // Substituir:
   bg-white → bg-bible-card
   text-black → text-bible-text
   ```

2. **ProfileModal.tsx** (9 ocorrências)
   ```tsx
   // Substituir:
   bg-white → bg-bible-card
   ```

3. **RightPanel.tsx** (10 ocorrências)
   ```tsx
   // Substituir:
   bg-white → bg-bible-card
   ```

4. **DevotionalView.tsx** (3 ocorrências)
   ```tsx
   // Linha 48, 99:
   bg-white → bg-bible-card
   
   // Linha 128 (WhatsApp button):
   bg-[#25D366] → MANTER (cor específica da marca)
   ```

5. **LibraryView.tsx**, **ExegesisView.tsx**, **VisualsView.tsx**
   ```tsx
   // Todas as ocorrências:
   bg-white → bg-bible-card
   ```

**Exceções** (NÃO substituir):
- `bg-white/80` (opacidade) → Substituir por `bg-bible-card/80`
- `bg-[#25D366]` (cor do WhatsApp) → MANTER
- `bg-white/30` (overlay) → Substituir por `bg-bible-card/30`

---

### **1.2 Implementar Dark Mode** ✅ PARCIALMENTE CONCLUÍDO

**Status**:
- ✅ Variáveis CSS criadas (`index.css`)
- ✅ Componente `ThemeToggle` criado
- ❌ Toggle não adicionado ao Header
- ❌ Componentes ainda não testados em Dark Mode

**Próximos passos**:

1. **Adicionar toggle ao Header**:
   ```tsx
   // Em src/components/layout/Header.tsx
   import { ThemeToggle } from '../common/ThemeToggle';
   
   // Adicionar antes do ProfileButton:
   <ThemeToggle />
   ```

2. **Testar cada view em Dark Mode**:
   - [ ] ReadingView
   - [ ] DevotionalView
   - [ ] ExegesisView
   - [ ] InterlinearView
   - [ ] AnalysisView
   - [ ] VisualsView
   - [ ] LocationsView
   - [ ] LibraryView

3. **Ajustar contrastes** (se necessário):
   ```css
   /* Verificar se textos estão legíveis */
   /* WCAG AAA: contraste mínimo 7:1 */
   ```

---

## 🟡 PRIORIDADE 2 - Melhorias Importantes

### **2.1 Implementar Responsividade Completa**

**Componentes SEM breakpoints** (precisam de atenção):

#### **DevotionalView.tsx**
```tsx
// Linha 48 - Header do devocional
<div className="p-4 border-b border-bible-border bg-bible-card">
// Adicionar:
<div className="p-3 sm:p-4 border-b border-bible-border bg-bible-card">

// Linha 53 - Input + Botão
<div className="flex gap-2">
// Adicionar:
<div className="flex flex-col sm:flex-row gap-2">

// Linha 96 - Título
<h2 className="text-3xl font-serif font-bold">
// Adicionar:
<h2 className="text-2xl sm:text-3xl font-serif font-bold">
```

#### **LibraryView.tsx**
```tsx
// Grid de recursos
<div className="grid grid-cols-1 gap-4">
// Adicionar:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### **VisualsView.tsx**
```tsx
// Grid de imagens
<div className="grid grid-cols-2 gap-2">
// Adicionar:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
```

#### **AuthScreen.tsx**
```tsx
// Container do formulário
<div className="max-w-md w-full bg-bible-card">
// Adicionar:
<div className="max-w-md w-full px-4 sm:px-0 bg-bible-card">

// Inputs
<input className="w-full bg-bible-card border">
// Adicionar:
<input className="w-full text-sm sm:text-base bg-bible-card border">
```

**Breakpoints a usar**:
- `sm:` → 640px (Mobile landscape / Tablet portrait)
- `md:` → 768px (Tablet)
- `lg:` → 1024px (Desktop)
- `xl:` → 1280px (Large desktop)

---

### **2.2 Criar Biblioteca de Componentes UI**

**Componentes prioritários** (shadcn/ui ou custom):

1. **Button** (`src/components/ui/button.tsx`)
   ```tsx
   // Variantes: primary, secondary, ghost, danger
   // Tamanhos: sm, md, lg
   ```

2. **Input** (`src/components/ui/input.tsx`)
   ```tsx
   // Tipos: text, email, password, number
   // Estados: default, error, disabled
   ```

3. **Modal** (`src/components/ui/modal.tsx`)
   ```tsx
   // Base para ProfileModal, LibraryModal, etc.
   ```

4. **Card** (`src/components/ui/card.tsx`)
   ```tsx
   // Base para DevotionalCard, ResourceCard, etc.
   ```

**Instalação shadcn/ui** (recomendado):
```bash
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add card
```

---

## 🟢 PRIORIDADE 3 - Polimento

### **3.1 Otimizações de Performance**

- [ ] Lazy load de imagens em VisualsView
- [ ] Virtualização de listas longas (Library, History)
- [ ] Debounce em inputs de busca

### **3.2 Acessibilidade**

- [ ] Adicionar `aria-label` em todos os botões de ícone
- [ ] Garantir navegação por teclado
- [ ] Testar com screen reader
- [ ] Verificar contraste de cores (WCAG AAA)

### **3.3 Animações**

- [ ] Adicionar `animate-in` do Tailwind
- [ ] Transições suaves entre temas
- [ ] Loading states consistentes

---

## 📋 Checklist de Implementação

### **Fase 1 - Fundação** (1-2 dias)
- [ ] Executar `refactor-colors.sh` e revisar mudanças
- [ ] Adicionar `ThemeToggle` ao Header
- [ ] Testar Dark Mode em todas as views
- [ ] Corrigir problemas de contraste

### **Fase 2 - Responsividade** (2-3 dias)
- [ ] Adicionar breakpoints em DevotionalView
- [ ] Adicionar breakpoints em LibraryView
- [ ] Adicionar breakpoints em VisualsView
- [ ] Adicionar breakpoints em AuthScreen
- [ ] Testar em 375px, 768px, 1440px

### **Fase 3 - Componentes** (3-4 dias)
- [ ] Instalar shadcn/ui
- [ ] Criar/importar Button component
- [ ] Criar/importar Input component
- [ ] Criar/importar Modal component
- [ ] Refatorar componentes existentes para usar UI lib

### **Fase 4 - Polimento** (1-2 dias)
- [ ] Adicionar animações
- [ ] Otimizar performance
- [ ] Melhorar acessibilidade
- [ ] Testes finais

---

## 🎯 Métricas de Sucesso

| Métrica | Antes | Meta | Status |
|---------|-------|------|--------|
| Cores hardcoded | 47 | 0 | ❌ |
| Dark Mode | Não | Sim | ⚠️ 50% |
| Breakpoints responsivos | 6 | 50+ | ❌ |
| Componentes UI reutilizáveis | 0 | 8+ | ❌ |
| Contraste WCAG AAA | ? | 100% | ❌ |

---

## 📚 Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Responsive Design Checker](https://responsivedesignchecker.com/)

---

**Última atualização**: 2026-01-06
**Responsável**: Equipe de Desenvolvimento Eden
