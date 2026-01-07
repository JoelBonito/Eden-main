# ⚠️ Cloud Functions - Status e Próximos Passos

## Status Atual

### ✅ CRIADO COM SUCESSO:
- `getBibleContent(us-central1)` 
- `generateStoryboard(us-central1)`
- `findBiblicalLocations(us-central1)`

### ⚠️ PROBLEMA: IAM Policy

```
Error: Unable to set the invoker for the IAM policy
```

**O que significa:**
- As functions foram criadas no Firebase
- MAS não conseguiram definir quem pode invocá-las
- Isso impede que sejam chamadas pelo frontend

---

## Causa do Problema

Você (`jbento1@gmail.com`) tem role de **Editor**, mas precisa de:
- `roles/functions.admin` OU
- `roles/run.admin` (para Cloud Run, usado pelo Functions v2)

---

## Solução

### Opção 1: Marcus adiciona a role (Recomendado)

Marcus (`marcuspalucci@gmail.com`) precisa:

1. Acessar: https://console.cloud.google.com/iam-admin/iam?project=gen-lang-client-0295226702
2. Encontrar `jbento1@gmail.com`
3. Clicar em "Edit" (ícone de lápis)
4. Adicionar role: **Cloud Functions Admin** ou **Cloud Run Admin**
5. Salvar

### Opção 2: Configurar Manualmente via Console

Como alternativa temporária, Marcus pode ir no Firebase Console e configurar manualmente:

1. Firebase Console → Functions
2. Para cada function, clicar em "..." → "Permissions"
3. Adicionar princ

ipal: `allUsers`
4. Role: `Cloud Run Invoker`

⚠️ **Isso torna as functions públicas!** Não é recomendado, pois bypassa a autenticação.

---

## Verificar se Functions Existem

```bash
firebase functions:list --project gen-lang-client-0295226702
```

Ou acesse: https://console.firebase.google.com/project/gen-lang-client-0295226702/functions

---

## Depois de Resolver IAM

Execute novamente:

```bash
firebase deploy --only functions --project gen-lang-client-0295226702
```

Ou apenas configure as permissions diretamente via Console.

---

## Status do Deployment

| Item | Status |
|------|--------|
| Functions criadas | ✅ |
| Code uploaded | ✅ |
| GEMINI_API_KEY configurada | ✅ |
| IAM Policies | ❌ Precisam ser configuradas |
| Frontend integrado | ⏳ Aguardando IAM |

---

## Alternativa: Continuar sem Cloud Functions (temporário)

Se quiser continuar desenvolvendo outras features da Fase 2/3, você pode:
1. Manter o Gemini no frontend por enquanto (menos seguro)
2. Finalizar as Cloud Functions depois quando tiver as permissões corretas

As functions estão prontas, só precisam de permissões!
