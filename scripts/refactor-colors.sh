#!/bin/bash
# Script para substituir cores hardcoded por tokens do design system

echo "🔧 Iniciando refatoração de cores hardcoded..."

# Substituir bg-white por bg-bible-card
find src/components -name "*.tsx" -type f -exec sed -i '' 's/bg-white/bg-bible-card/g' {} +

# Substituir text-black por text-bible-text (onde apropriado)
find src/components -name "*.tsx" -type f -exec sed -i '' 's/text-black/text-bible-text/g' {} +

echo "✅ Refatoração concluída!"
echo "⚠️  IMPORTANTE: Revisar manualmente os arquivos modificados"
echo "   Alguns casos podem precisar de ajustes específicos"
