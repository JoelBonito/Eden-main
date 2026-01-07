# Autorizar Domínio na Vercel (Erro OAuth/Unauthorized Domain)

O erro que você está vendo (`This domain is not authorized...`) acontece porque o Firebase bloqueia logins vindos de domínios desconhecidos por segurança.

Para corrigir e liberar o login em produção:

1. Acesse o **Console do Firebase**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Selecione o seu projeto (**Eden** ou `gen-lang-client-...`).
3. No menu lateral esquerdo, vá em **Authentication** (ou Autenticação).
4. Clique na aba **Settings** (Configurações).
5. Clique na sub-aba **Authorized domains** (Domínios autorizados).
6. Clique no botão **Add domain** (Adicionar domínio).
7. Digite o domínio da sua aplicação na Vercel:
   
   `eden-main.vercel.app`

8. Clique em **Add**.

---
### Sobre o erro "Missing permissions"
O outro erro vermelho ("Missing or insufficient permissions") acontece porque o login falhou. Como o app não conseguiu te autenticar, o banco de dados bloqueou o acesso aos dados. Assim que você autorizar o domínio e fizer login, esse erro deve sumir.
