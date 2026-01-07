# 🔑 Como Adicionar Permissões no Firebase

## Para: Marcus Palucci (marcuspalucci@gmail.com)

**Projeto:** `gen-lang-client-0295226702` (ÉDEN - De volta ao princípio)  
**Usuário a adicionar:** `jbento1@gmail.com`

---

## Passo 1: Acessar o Firebase Console

1. Acesse: https://console.firebase.google.com
2. Faça login com `marcuspalucci@gmail.com`
3. Clique no projeto: **gen-lang-client-0295226702**

---

## Passo 2: Adicionar Usuário com Permissões

### Via Firebase Console:

1. No menu lateral esquerdo, clique no **ícone de engrenagem** ⚙️
2. Selecione **"Usuários e permissões"** ou **"Project settings"**
3. Vá para a aba **"Usuários e permissões"** ou **"IAM"**
4. Clique em **"Adicionar membro"** ou **"Add member"**

5. Preencha:
   - **E-mail:** `jbento1@gmail.com`
   - **Função/Role:** Escolha uma das opções abaixo:

### Permissões Recomendadas:

#### ✅ Opção 1: **Editor** (Recomendado para desenvolvimento)
- Permite: Ler, escrever, fazer deploy de regras, modificar configurações
- **NÃO** permite: Deletar o projeto, gerenciar faturamento

#### ✅ Opção 2: **Proprietário** (Full access)
- Permite: Tudo, incluindo deletar projeto e gerenciar faturamento
- Use apenas se confiar totalmente

#### ⚠️ Opção 3: **Visualizador** (Apenas leitura)
- Permite: Apenas visualizar dados
- **NÃO** permite fazer deploy

6. Clique em **"Adicionar"** ou **"Add"**

---

## Passo 3: Verificar se funcionou

Após adicionar, peça para `jbento1@gmail.com` executar:

```bash
firebase projects:list
```

O projeto `gen-lang-client-0295226702` deve aparecer na lista agora.

---

## Passo 4: (Opcional mas Recomendado) Adicionar como Admin no Firestore

Para que `jbento1@gmail.com` seja reconhecido como admin pela aplicação:

1. Acesse: **Firestore Database** no Firebase Console
2. Navegue até a coleção: `users`
3. Encontre o documento do usuário `jbento1@gmail.com` (procure pelo UID ou email)
4. Edite o documento e adicione/atualize o campo:
   ```json
   {
     "role": "admin"
   }
   ```
5. Salve

---

## Alternativa: Se você preferir fazer via Google Cloud Console

1. Acesse: https://console.cloud.google.com/iam-admin/iam?project=gen-lang-client-0295226702
2. Clique em **"Conceder acesso"** / **"Grant Access"**
3. Adicione `jbento1@gmail.com`
4. Escolha a role: **"Firebase Admin"** ou **"Editor"**
5. Salve

---

## ℹ️ Informações Adicionais

- **Por que precisamos disso?**
  - Para fazer deploy das Firestore Security Rules
  - Para gerenciar configurações do projeto
  - Para rotacionar credenciais de segurança

- **É seguro?**
  - Sim, desde que você confie na pessoa
  - A role "Editor" é segura pois não permite deletar o projeto
  - Você pode revogar o acesso a qualquer momento

---

## 📧 Após adicionar, por favor confirme

Envie uma mensagem confirmando que o acesso foi concedido, para que possamos continuar com o deploy das regras de segurança.

Obrigado! 🙏
