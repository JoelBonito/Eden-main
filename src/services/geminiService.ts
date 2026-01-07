import {
  LocationResult,
  Scene,
  SearchResult,
  WordAnalysis,
  InterlinearVerse,
  LexiconEntry,
  LibraryResource,
  Language,
  DevotionalContent
} from '../types';
import { db, functions } from './firebase';
import { logger } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

// Session Cache (In-Memory)
const sessionCache = new Map<string, any>();

const getFromCache = (key: string) => sessionCache.get(key);
const setInCache = (key: string, value: any) => sessionCache.set(key, value);

// Helper: Backend Image Generation Wrapper
const generateImageBackend = async (prompt: string, aspectRatio: string = '16:9', modelType: string = 'standard'): Promise<string | null> => {
  try {
    const genImageFn = functions.httpsCallable('generateImage');
    const result = await genImageFn({ prompt, aspectRatio, modelType });
    const data = result.data as { success: boolean; image: string };
    return data.image ? `data:image/png;base64,${data.image}` : null;
  } catch (err) {
    logger.error('Backend Image Error:', err);
    return null;
  }
};

// getLanguageInstruction removido por não ser utilizado na UI atual (substituído por lógica inline)

// --- NEW: Translation Service for Audio ---
export const translateForAudio = async (text: string, targetLang: Language): Promise<string> => {
  if (!text) return '';
  try {
    const translateFn = functions.httpsCallable('translateForAudio');
    const result = await translateFn({ text, targetLang });
    const data = result.data as { success: boolean; text: string };
    return data.text || text;
  } catch (e) {
    logger.error('Translation error', e);
    return text;
  }
};

export const getBibleContent = async (
  book: string,
  chapter: number,
  translation: string,
  lang: Language = 'pt'
): Promise<string> => {
  const cacheKey = `bible_${translation}_${book}_${chapter}_${lang}`;
  const memoryCached = getFromCache(cacheKey);
  if (memoryCached) return memoryCached;

  const cacheId = `${translation}_${book}_${chapter}_${lang}`.replace(/\s+/g, '_').replace(/[/.]/g, '');
  const cacheRef = db.collection('bible_cache').doc(cacheId);

  try {
    const cacheSnap = await cacheRef.get();
    if (cacheSnap.exists) {
      const cachedData = cacheSnap.data();
      const expiresAt = cachedData?.expiresAt?.toDate();

      // Valida se o cache ainda é válido (30 dias)
      if (expiresAt && expiresAt > new Date()) {
        const text = cachedData?.text;
        setInCache(cacheKey, text);
        return text;
      } else {
        // Cache expirado, deleta
        await cacheRef.delete().catch(() => { });
      }
    }
  } catch (e) { logger.warn('Cache read error:', e); }

  try {
    const getBibleContentFn = functions.httpsCallable('getBibleContent');
    const result = await getBibleContentFn({ book, chapter, translation, lang });
    const data = result.data as { success: boolean; text: string };
    if (!data.success) throw new Error('Falha na geração do conteúdo bíblico');

    const text = data.text;
    setInCache(cacheKey, text);
    if (text && text.length > 50) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Cache válido por 30 dias

      cacheRef.set({
        text,
        book,
        chapter,
        translation,
        lang,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt
      })
        .catch((err) => logger.error('Cache write error:', err));
    }
    return text;
  } catch (error) { throw handleApiError(error, 'getBibleContent'); }
};

export const generateStoryBoard = async (
  book: string,
  chapter: number,
  text: string,
  age?: number,
  lang: Language = 'pt'
): Promise<Scene[]> => {
  try {
    const generateStoryboardFn = functions.httpsCallable('generateStoryboard');
    const result = await generateStoryboardFn({ book, chapter, text, age, lang });
    const data = result.data as { success: boolean; scenes: any[] };
    if (!data.success) return [];

    const scenesData = data.scenes || [];
    const imagePromises = scenesData.map(async (sceneItem: any) => {
      const url = await generateImageBackend(sceneItem.description, '16:9');
      if (url) return { url, caption: sceneItem.title, prompt: sceneItem.description };
      return null;
    });

    const results = await Promise.all(imagePromises);
    return results.filter((s): s is Scene => s !== null);
  } catch (err) { throw handleApiError(err, 'generateStoryBoard'); }
};

export const findBiblicalLocations = async (
  book: string,
  chapter: number,
  text: string,
  age?: number,
  lang: Language = 'pt'
): Promise<LocationResult> => {
  try {
    const findLocationsFn = functions.httpsCallable('findBiblicalLocations');
    const result = await findLocationsFn({ book, chapter, text, age, lang });
    const data = result.data as { success: boolean; locations: any[] };
    if (!data.success) return { locations: [], mapUrl: null, regionDescription: '' };

    const locations = data.locations || [];
    const regionDescription = locations.map((l: any) => l.name).join(', ');

    const langName = lang === 'en' ? 'ENGLISH' : lang === 'es' ? 'SPANISH' : 'PORTUGUESE';
    const mapPrompt = `Create a map showing these biblical locations: ${regionDescription}. Style: Ancient parchment. Labels in ${langName}.`;
    const mapUrl = await generateImageBackend(mapPrompt, '4:3');

    const adaptedLocations = locations.map((l: any) => ({
      biblicalName: l.name,
      modernName: l.name,
      description: l.description
    }));

    return { locations: adaptedLocations, mapUrl, regionDescription };
  } catch (err) { throw handleApiError(err, 'findBiblicalLocations'); }
};

export const generateCustomMap = async (
  topic: string,
  age?: number,
  lang: Language = 'pt'
): Promise<LocationResult> => {
  try {
    const analysisFn = functions.httpsCallable('generateCustomMapAnalysis');
    const analysisResult = await analysisFn({ topic, lang });
    const extractedData = analysisResult.data as { success: boolean; locations: any[]; regionDescription: string };

    let mapUrl = null;
    if (extractedData.regionDescription) {
      const langName = lang === 'en' ? 'ENGLISH' : lang === 'es' ? 'SPANISH' : 'PORTUGUESE';
      const mapPrompt = `Create a biblical map: ${topic}. ${extractedData.regionDescription}. Labels in ${langName}. Style: Ancient Map.`;
      mapUrl = await generateImageBackend(mapPrompt, '4:3');
    }

    return {
      locations: (extractedData.locations as any) || [],
      mapUrl,
      regionDescription: extractedData.regionDescription || ''
    };
  } catch (err) { throw handleApiError(err, 'generateCustomMap'); }
};

export const generateVisualSummary = async (text: string, age?: number, lang: Language = 'pt'): Promise<string | null> => {
  const prompt = `Create a detailed infographic poster summarizing this Bible chapter in ${lang}. Chapter Context: ${text.substring(0, 4000)}`;
  return await generateImageBackend(prompt, '16:9', '4k');
};

export const searchBibleReferences = async (query: string, lang: Language = 'pt'): Promise<SearchResult[]> => {
  try {
    const searchFn = functions.httpsCallable('searchBibleReferences');
    const result = await searchFn({ query, lang });
    const data = result.data as { success: boolean; results: SearchResult[] };
    return data.results || [];
  } catch (err) { throw handleApiError(err, 'searchBibleReferences'); }
};

export const generateStudyGuide = async (theme: string, context: string, age?: number, lang: Language = 'pt'): Promise<string> => {
  try {
    const studyGuideFn = functions.httpsCallable('generateStudyGuide');
    const result = await studyGuideFn({ theme, context, age, lang });
    const data = result.data as { success: boolean; text: string };
    return data.text || 'Error.';
  } catch (err) { throw handleApiError(err, 'generateStudyGuide'); }
};

export const generateThematicStudy = async (topic: string, age?: number, lang: Language = 'pt'): Promise<string> => {
  try {
    const thematicStudyFn = functions.httpsCallable('generateThematicStudy');
    const result = await thematicStudyFn({ topic, age, lang });
    const data = result.data as { success: boolean; text: string };
    return data.text || 'Error.';
  } catch (err) { throw handleApiError(err, 'generateThematicStudy'); }
};

export const analyzeKeywordsInVerse = async (reference: string, verseText: string, lang: Language = 'pt'): Promise<WordAnalysis[]> => {
  try {
    const keywordFn = functions.httpsCallable('analyzeKeywordsInVerse');
    const result = await keywordFn({ reference, verseText, lang });
    const data = result.data as { success: boolean; keywords: WordAnalysis[] };
    return data.keywords || [];
  } catch (err) { throw handleApiError(err, 'analyzeKeywordsInVerse'); }
};

export const generateInterlinearChapter = async (book: string, chapter: number, startVerse: number, endVerse: number, lang: Language = 'pt'): Promise<InterlinearVerse[]> => {
  try {
    const interlinearFn = functions.httpsCallable('generateInterlinearChapter');
    const result = await interlinearFn({ book, chapter, startVerse, endVerse, lang });
    const data = result.data as { success: boolean; verses: InterlinearVerse[] };
    return data.verses || [];
  } catch (err) { throw handleApiError(err, 'generateInterlinearChapter'); }
};

export const getWordDefinition = async (original: string, strong: string, context: string, lang: Language = 'pt'): Promise<LexiconEntry | null> => {
  try {
    const wordDefFn = functions.httpsCallable('getWordDefinition');
    const result = await wordDefFn({ original, strong, context, lang });
    const data = result.data as { success: boolean } & LexiconEntry;
    return data;
  } catch (err) { throw handleApiError(err, 'getWordDefinition'); }
};

export const generateTheologyAnalysis = async (book: string, chapter: number, context: string, lang: Language = 'pt'): Promise<string> => {
  const cacheKey = `theology_${book}_${chapter}_${lang}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  try {
    const theologyFn = functions.httpsCallable('generateTheologyAnalysis');
    const result = await theologyFn({ book, chapter, context, lang });
    const data = result.data as { success: boolean; text: string };
    if (data.text) setInCache(cacheKey, data.text);
    return data.text || 'Error.';
  } catch (err) { throw handleApiError(err, 'generateTheologyAnalysis'); }
};

export const generateExegesisAnalysis = async (referenceTitle: string, context: string, lang: Language = 'pt'): Promise<string> => {
  const cacheKey = `exegesis_${referenceTitle}_${lang}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  try {
    const exegesisFn = functions.httpsCallable('generateExegesisAnalysis');
    const result = await exegesisFn({ referenceTitle, context, lang });
    const data = result.data as { success: boolean; text: string };
    if (data.text) setInCache(cacheKey, data.text);
    return data.text || 'Error.';
  } catch (err) { throw handleApiError(err, 'generateExegesisAnalysis'); }
};

export const generateDailyDevotional = async (topic: string, age?: number, lang: Language = 'pt'): Promise<DevotionalContent | null> => {
  try {
    const devotionalFn = functions.httpsCallable('generateDailyDevotional');
    const result = await devotionalFn({ topic, age, lang });
    const data = result.data as { success: boolean } & DevotionalContent;
    return data;
  } catch (err) { throw handleApiError(err, 'generateDailyDevotional'); }
};

export const askLibraryAgent = async (query: string, resources: LibraryResource[], lang: Language = 'pt'): Promise<string> => {
  try {
    const libraryFn = functions.httpsCallable('askLibraryAgent');
    const result = await libraryFn({ query, resources: resources.map(r => ({ title: r.title, textContent: r.textContent })), lang });
    const data = result.data as { success: boolean; text: string };
    return data.text || 'Error.';
  } catch (err) { throw handleApiError(err, 'askLibraryAgent'); }
};
