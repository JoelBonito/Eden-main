# Configuração de Ambiente Vercel (Correção de Erro API Key)

O erro `auth/invalid-api-key` ocorre porque a Vercel não tem acesso às chaves que estão no seu computador local (arquivo `.env`).

Para corrigir, siga estes passos:

1. Acesse o dashboard do seu projeto na Vercel: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** > **Environment Variables**.
3. Adicione as seguintes variáveis (copie os valores do seu arquivo local `.env` ou `.env.local`):

| Key (Nome da Variável) | Value (Exemplo do que copiar) |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `seu-projeto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `seu-projeto` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `seu-projeto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456:web:abcdef` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XYZ...` (se houver) |

4. **IMPORTANTE**: Após adicionar as variáveis, você precisa fazer um **Redeploy** para que elas entrem em vigor.
   - Vá na aba **Deployments**.
   - Clique nos três pontinhos do último deploy.
   - Selecione **Redeploy**.
