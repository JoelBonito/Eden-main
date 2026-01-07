# Mapeamento de Funções Gemini

| Função | Modelo Gemini | Descrição |
|---|---|---|
| `getBibleContent` | gemini-2.5-flash-lite | Retorna texto bíblico de qualquer livro/capítulo/tradução |
| `generateStoryboard` | gemini-2.5-flash-lite | Gera storyboard visual com 3-5 cenas para narrativa bíblica |
| `findBiblicalLocations` | gemini-2.5-flash-lite | Identifica locais geográficos mencionados no texto bíblico |
| `generateTheologyAnalysis` | gemini-2.5-flash-lite | Análise teológica sistemática (estilo Wayne Grudem) |
| `generateExegesisAnalysis` | gemini-2.5-flash-lite | Exegese e homilética de passagens bíblicas |
| `askLibraryAgent` | gemini-2.5-flash-lite | Agente RAG para responder perguntas usando livros da biblioteca |
| `generateDailyDevotional` | gemini-2.5-flash-lite | Gera devocional diário com reflexão, oração e versículo |
| `generateStudyGuide` | gemini-2.5-flash-lite | Cria guia de estudo bíblico sobre um tema |
| `generateThematicStudy` | gemini-2.5-flash-lite | Plano de estudo temático aprofundado |
| `translateForAudio` | gemini-2.5-flash-lite | Traduz texto para síntese de voz em outro idioma |
| `getWordDefinition` | gemini-2.5-flash-lite | Definição profunda de palavra hebraica/grega (Strong) |
| `analyzeKeywordsInVerse` | gemini-2.5-flash-lite | Analisa palavras-chave teológicas em um versículo |
| `generateInterlinearChapter` | gemini-2.5-flash-lite | Gera análise interlinear hebraico/grego do texto |
| `searchBibleReferences` | gemini-2.5-flash-lite | Busca semântica de referências bíblicas |
| `generateImage` | gemini-2.5-flash-image / gemini-1.5-pro-001 | Gera imagens (padrão: flash-image, 4k: pro-001) |
| `generateCustomMapAnalysis` | gemini-2.5-flash-lite | Análise cartográfica de locais bíblicos |
| `cleanOldCache` | N/A | Manutenção: limpa caches expirados (não usa Gemini) |

## Logging de Tokens

Todas as funções acima agora registram o consumo de tokens nos logs do Cloud Functions:
```
📊 [functionName] Tokens: { prompt: X, response: Y, total: Z }
```

Para visualizar, acesse os logs do Firebase/Google Cloud.
