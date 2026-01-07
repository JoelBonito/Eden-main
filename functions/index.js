const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");
const { z } = require("zod");

admin.initializeApp();

// Helper: Obter instância da IA (Lazy Initialization)
let genAIInstance;
function getGenAI() {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ CRÍTICO: GEMINI_API_KEY não encontrada no process.env!");
      throw new HttpsError("failed-precondition", "Configuração de API ausente no servidor");
    }
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

// =====================================================
// SCHEMAS DE VALIDAÇÃO (ZOD)
// =====================================================

const getBibleContentSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  translation: z.string().default("NVI"),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const generateStoryboardSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  text: z.string().min(10),
  age: z.number().nullable().optional(),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const findLocationsSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  text: z.string().min(10),
  age: z.number().nullable().optional(),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const analysisSchema = z.object({
  book: z.string().nullable().optional(),
  chapter: z.number().nullable().optional(),
  context: z.string().min(10),
  referenceTitle: z.string().nullable().optional(),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const libraryAgentSchema = z.object({
  query: z.string().min(3),
  resources: z.array(z.object({
    title: z.string(),
    textContent: z.string().nullable().optional()
  })),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const devotionalSchema = z.object({
  topic: z.string().min(1),
  age: z.number().nullable().optional(),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const studyGuideSchema = z.object({
  theme: z.string().min(1),
  context: z.string().min(10),
  age: z.number().nullable().optional(),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const thematicStudySchema = z.object({
  topic: z.string().min(1),
  age: z.number().nullable().optional(),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const audioTranslateSchema = z.object({
  text: z.string().min(1),
  targetLang: z.enum(["pt", "en", "es"])
});

const wordDefinitionSchema = z.object({
  original: z.string().min(1),
  strong: z.string().nullable().optional(),
  context: z.string().min(1),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const keywordAnalysisSchema = z.object({
  reference: z.string().min(1),
  verseText: z.string().min(1),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const interlinearSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  startVerse: z.number().int().positive(),
  endVerse: z.number().int().positive(),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

const bibleSearchSchema = z.object({
  query: z.string().min(2),
  lang: z.enum(["pt", "en", "es"]).default("pt")
});

// Helper: Get Language Name
const getLangName = (lang) => lang === 'en' ? 'ENGLISH' : lang === 'es' ? 'SPANISH' : 'PORTUGUESE';

// Helper: Wrapper para retry com backoff exponencial
async function retryWrapper(fn, retries = 3, delay = 2000) {
  try {
    return await fn();
  } catch (error) {
    const isQuotaError =
      error?.message?.includes("429") ||
      error?.message?.includes("quota") ||
      error?.message?.includes("RESOURCE_EXHAUSTED") ||
      error?.status === 429;

    if (isQuotaError && retries > 0) {
      console.warn(`⚠️ Rate limit hit. Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      return retryWrapper(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Helper: Verificar autenticação
function checkAuth(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }
}

// Helper: Extrair JSON robusto da resposta
function extractJson(text) {
  try {
    // Encontrar os índices do primeiro '{' e '['
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');

    let match;
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      // Começa com array ou o array vem antes do primeiro objeto
      match = text.match(/\[[\s\S]*\]/);
    } else {
      // Começa com objeto
      match = text.match(/\{[\s\S]*\}/);
    }

    if (!match) {
      console.error("❌ Falha ao encontrar JSON na resposta. Texto bruto:", text);
      return null;
    }
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("❌ Erro ao parsear JSON:", e.message, "\nTexto que falhou:", text);
    return null;
  }
}

// Helper: Validar schema e retornar data limpa
function validateSchema(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(", ");
    console.error("❌ Erro de validação Zod:", errors);
    throw new HttpsError("invalid-argument", `Dados inválidos: ${errors}`);
  }
  return result.data;
}

// =====================================================
// FUNCTIONS
// =====================================================

// 1. getBibleContent
exports.getBibleContent = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { book, chapter, translation, lang } = validateSchema(getBibleContentSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ]
      });

      // Usar traduções de domínio público para evitar RECITATION
      const publicDomainTranslations = ['KJV', 'ASV', 'WEB', 'YLT', 'DBY'];
      const isPublicDomain = publicDomainTranslations.includes(translation.toUpperCase());

      let prompt;
      if (isPublicDomain) {
        prompt = `Provide the complete text of ${book} chapter ${chapter} from the ${translation} translation. 
This is a public domain translation. Format each verse with its number.
Output the text in ${getLangName(lang)} if different from the original.`;
      } else {
        // Para traduções modernas, solicitar resumo/paráfrase para evitar copyright
        prompt = `Provide the text of ${book} chapter ${chapter} in the style of the ${translation} translation.
Present each verse numbered. This should be a faithful rendering of the biblical content.
Language: ${getLangName(lang)}.`;
      }

      const result = await model.generateContent(prompt);

      // Verificar se houve bloqueio
      if (result.response.promptFeedback?.blockReason) {
        console.warn("⚠️ Prompt bloqueado:", result.response.promptFeedback.blockReason);
        throw new Error(`Conteúdo bloqueado: ${result.response.promptFeedback.blockReason}`);
      }

      const text = result.response.text();
      if (!text) throw new Error("IA retornou resposta vazia");
      return { success: true, text: text, book, chapter, translation };
    });
  } catch (e) {
    console.error("Error in getBibleContent:", e);

    // Tratamento específico para RECITATION
    if (e.message?.includes('RECITATION')) {
      throw new HttpsError("failed-precondition",
        "Não foi possível obter esta tradução específica. Tente uma tradução de domínio público como KJV ou ASV.");
    }

    throw new HttpsError("internal", e.message);
  }
});

// 2. generateStoryboard
exports.generateStoryboard = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { book, chapter, text, lang } = validateSchema(generateStoryboardSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Crie um storyboard com 3-5 cenas para ${book} ${chapter}. Texto: ${text}. Retorne JSON { "scenes": [{ "title": "...", "description": "...", "verses": [] }] }. Responda em ${getLangName(lang)}.`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Storyboard");
      return { success: true, ...jsonData };
    });
  } catch (e) {
    console.error("Error in generateStoryboard:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 3. findBiblicalLocations
exports.findBiblicalLocations = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { book, chapter, text, lang } = validateSchema(findLocationsSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Identifique locais em ${book} ${chapter}. Texto: ${text}. Retorne JSON { "locations": [{ "name": "...", "lat": 0, "lng": 0, "verses": [], "description": "..." }] }. Responda em ${getLangName(lang)}.`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Localizações");
      return { success: true, ...jsonData };
    });
  } catch (e) {
    console.error("Error in findBiblicalLocations:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 4. generateTheologyAnalysis
exports.generateTheologyAnalysis = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { book, chapter, context, lang } = validateSchema(analysisSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Analise teológica sistemática de ${book} ${chapter}. Estilo: Wayne Grudem. Idioma: ${getLangName(lang)}. Contexto: ${context}`;
      const result = await model.generateContent(prompt);
      return { success: true, text: result.response.text() };
    });
  } catch (e) {
    console.error("Error in generateTheologyAnalysis:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 5. generateExegesisAnalysis
exports.generateExegesisAnalysis = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { referenceTitle, context, lang } = validateSchema(analysisSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Exegese e Homilética de: ${referenceTitle}. Idioma: ${getLangName(lang)}. Contexto: ${context}`;
      const result = await model.generateContent(prompt);
      return { success: true, text: result.response.text() };
    });
  } catch (e) {
    console.error("Error in generateExegesisAnalysis:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 6. askLibraryAgent
exports.askLibraryAgent = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { query, resources, lang } = validateSchema(libraryAgentSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const context = resources.map(r => `--- LIVRO: ${r.title} ---\n${r.textContent}`).join('\n\n');
      const prompt = `Você é o Agente Éden. Responda à pergunta: "${query}" usando os seguintes livros:\n\n${context}\n\nResponda em ${getLangName(lang)}. Cite as fontes.`;
      const result = await model.generateContent(prompt);
      return { success: true, text: result.response.text() };
    });
  } catch (e) {
    console.error("Error in askLibraryAgent:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 7. generateDailyDevotional
exports.generateDailyDevotional = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  console.log("📥 Chamada generateDailyDevotional recebida:", JSON.stringify(request.data));
  const { topic, age, lang } = validateSchema(devotionalSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Crie um devocional diário sobre "${topic}" para público de ${age || 'todas'} idades em ${getLangName(lang)}. Retorne JSON { "title": "...", "scriptureReference": "...", "scriptureText": "...", "reflection": "...", "prayer": "...", "finalQuote": "..." }.`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Devocional");
      return { success: true, ...jsonData };
    });
  } catch (e) {
    console.error("Error in generateDailyDevotional:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 8. generateStudyGuide
exports.generateStudyGuide = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { theme, context, lang } = validateSchema(studyGuideSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Guia de estudo bíblico sobre "${theme}" em ${getLangName(lang)}. Contexto: ${context}`;
      const result = await model.generateContent(prompt);
      return { success: true, text: result.response.text() };
    });
  } catch (e) {
    console.error("Error in generateStudyGuide:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 9. generateThematicStudy
exports.generateThematicStudy = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { topic, lang } = validateSchema(thematicStudySchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Plano de estudo temático sobre "${topic}" em ${getLangName(lang)}.`;
      const result = await model.generateContent(prompt);
      return { success: true, text: result.response.text() };
    });
  } catch (e) {
    console.error("Error in generateThematicStudy:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 10. translateForAudio
exports.translateForAudio = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { text, targetLang } = validateSchema(audioTranslateSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Traduza para ${getLangName(targetLang)} para síntese de voz: "${text}". Apenas o texto traduzido.`;
      const result = await model.generateContent(prompt);
      return { success: true, text: result.response.text() };
    });
  } catch (e) {
    console.error("Error in translateForAudio:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 11. getWordDefinition
exports.getWordDefinition = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { original, strong, context, lang } = validateSchema(wordDefinitionSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Definição profunda de "${original}" (Strong: ${strong || 'N/A'}). Contexto: ${context}. Idioma: ${getLangName(lang)}. Retorne JSON { "original": "...", "transliteration": "...", "strong": "...", "root": "...", "morphology": "...", "definition": "...", "practicalDefinition": "...", "biblicalUsage": [], "theologicalSignificance": "..." }.`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Definição");
      return { success: true, ...jsonData };
    });
  } catch (e) {
    console.error("Error in getWordDefinition:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 12. analyzeKeywordsInVerse
exports.analyzeKeywordsInVerse = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { reference, verseText, lang } = validateSchema(keywordAnalysisSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Analise palavras-chave em: "${reference}: ${verseText}" em ${getLangName(lang)}. Retorne JSON array de [{ "word": "...", "original": "...", "transliteration": "...", "strongNumber": "...", "definition": "...", "language": "Hebrew"|"Greek" }].`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Palavras-chave");
      return { success: true, keywords: jsonData };
    });
  } catch (e) {
    console.error("Error in analyzeKeywordsInVerse:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 13. generateInterlinearChapter
exports.generateInterlinearChapter = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { book, chapter, startVerse, endVerse, lang } = validateSchema(interlinearSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Análise interlinear de ${book} ${chapter}:${startVerse}-${endVerse} em ${getLangName(lang)}. Retorne JSON array de [{ "verseNumber": 0, "language": "Hebrew"|"Greek", "words": [{ "original": "...", "transliteration": "...", "portuguese": "...", "strong": "..." }] }].`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Interlinear");
      return { success: true, verses: jsonData };
    });
  } catch (e) {
    console.error("Error in generateInterlinearChapter:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 14. searchBibleReferences
exports.searchBibleReferences = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { query, lang } = validateSchema(bibleSearchSchema, request.data);
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Busca bíblica por "${query}" em ${getLangName(lang)}. Retorne JSON array de [{ "reference": "...", "text": "...", "book": "...", "chapter": 0 }]. Máximo 5 resultados.`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Busca");
      return { success: true, results: jsonData };
    });
  } catch (e) {
    console.error("Error in searchBibleReferences:", e);
    throw new HttpsError("internal", e.message);
  }
});

// 15. generateImage (Auxiliary for all visuals)
exports.generateImage = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { prompt, aspectRatio, modelType } = request.data;
  if (!prompt) throw new HttpsError("invalid-argument", "Prompt é obrigatório");

  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({
        model: modelType === '4k' ? "gemini-1.5-pro-001" : "gemini-2.5-flash-image"
      });

      const result = await model.generateContent(prompt);

      let base64 = "";
      for (const part of result.response.candidates[0].content.parts) {
        if (part.inlineData) base64 = part.inlineData.data;
      }

      return { success: true, image: base64 };
    });
  } catch (e) { throw new HttpsError("internal", e.message); }
});

// 16. generateCustomMapAnalysis
exports.generateCustomMapAnalysis = onCall({ cors: true }, async (request) => {
  checkAuth(request);
  const { topic, lang } = request.data;
  try {
    return await retryWrapper(async () => {
      const model = getGenAI().getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Atue como cartógrafo bíblico. Tópico: "${topic}". Identifique locais. Retorne JSON { "locations": [{ "biblicalName": "...", "modernName": "...", "description": "..." }], "regionDescription": "..." }. Idioma: ${getLangName(lang)}.`;
      const result = await model.generateContent(prompt);
      const jsonData = extractJson(result.response.text());
      if (!jsonData) throw new Error("Falha ao gerar formato JSON válido para Análise de Mapa");
      return { success: true, ...jsonData };
    });
  } catch (e) {
    console.error("Error in generateCustomMapAnalysis:", e);
    throw new HttpsError("internal", e.message);
  }
});

exports.initialized = true;

// 17. cleanOldCache (Manutenção - limpar caches sem expiresAt)
exports.cleanOldCache = onCall({ cors: true }, async (request) => {
  checkAuth(request);

  const db = admin.firestore();

  try {
    const snapshot = await db.collection('bible_cache').get();

    let deletedCount = 0;
    let keptCount = 0;
    const batch = db.batch();

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (!data.expiresAt) {
        batch.delete(doc.ref);
        deletedCount++;
      } else {
        keptCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
    }

    return {
      success: true,
      deleted: deletedCount,
      kept: keptCount,
      message: `Limpeza concluída: ${deletedCount} caches antigos deletados, ${keptCount} mantidos`
    };

  } catch (error) {
    console.error('Erro ao limpar cache:', error);
    throw new HttpsError('internal', error.message);
  }
});
