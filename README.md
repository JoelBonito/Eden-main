<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ÉDEN – De volta ao princípio

Uma aplicação de estudo bíblico com IA, oferecendo recursos como leitura interlinear, análise teológica, geração de mapas bíblicos e muito mais.

---

## 🚀 Executar Localmente

**Pré-requisitos:** Node.js 18+

### 1. Instalar dependências:
```bash
npm install
```

### 2. Configurar variáveis de ambiente:

Copie o arquivo de exemplo e preencha com suas credenciais:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione:
- Credenciais do Firebase (https://console.firebase.google.com)
- API Key do Gemini AI (https://aistudio.google.com/apikey)

### 3. Executar o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

---

## 📚 Documentação

- **[Relatório de Auditoria](doc/audit_report.md)** - Análise completa do projeto
- **[Plano de Implementação](doc/implementation_plan.md)** - Roadmap de melhorias
- **[Lista de Tarefas](doc/task.md)** - 118 tarefas organizadas
- **[Setup de Segurança](doc/SECURITY_SETUP.md)** - ⚠️ LEIA ISTO PRIMEIRO!

---

## ⚠️ Segurança

**IMPORTANTE:** Este projeto requer configuração de segurança antes de ir para produção.

Leia: [doc/SECURITY_SETUP.md](doc/SECURITY_SETUP.md)

---

## 🏗️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Vite
- **UI:** Tailwind CSS (via CDN - migrar para npm)
- **Backend:** Firebase (Firestore, Auth, Storage)
- **IA:** Google Gemini AI
- **i18n:** Português, English, Español

---

## 📝 Licença

Este projeto é privado.
