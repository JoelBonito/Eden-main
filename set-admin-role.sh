#!/bin/bash

# Script para configurar role admin usando Firebase REST API

PROJECT_ID="gen-lang-client-0295226702"
USER_UID="f2WzvY0F30hoMYnla04Wm2c77XQ2"
COLLECTION="users"

echo "🔧 Configurando role admin para jbento1@gmail.com..."

# Obter access token do gcloud (que o Firebase CLI usa)
ACCESS_TOKEN=$(gcloud auth print-access-token 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Erro: gcloud não está configurado"
  echo "Executando: gcloud auth login"
  gcloud auth login
  ACCESS_TOKEN=$(gcloud auth print-access-token)
fi

echo "✓ Token obtido"

# Atualizar documento via Firestore REST API
URL="https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${USER_UID}?updateMask.fieldPaths=role"

echo "📝 Atualizando documento..."

curl -X PATCH \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "role": {
        "stringValue": "admin"
      }
    }
  }' \
  "${URL}"

echo ""
echo "✅ Role admin configurada com sucesso!"
echo "🔄 Recarregue a página: http://localhost:3000"
