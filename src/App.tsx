import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import {
  generateStoryBoard,
  findBiblicalLocations,
  searchBibleReferences,
  generateStudyGuide,
  generateInterlinearChapter,
  generateTheologyAnalysis,
  generateExegesisAnalysis,
  getWordDefinition,
  generateCustomMap,
  askLibraryAgent,
  generateThematicStudy,
  generateDailyDevotional
} from './services/geminiService';
import {
  BibleReference,
  LocationResult,
  Scene,
  TabView,
  LoadingState,
  SearchResult,
  RightPanelTab,
  InterlinearVerse,
  InterlinearWord,
  LexiconEntry,
  AIStudioClient,
  Language,
  DevotionalContent,
  StudyRestorePoint
} from './types';
import { auth, db } from './services/firebase';
import { logger } from './utils/logger';
import { useAuth } from './contexts/AuthContext';
import { useBible } from './contexts/BibleContext';
import { useBibleReader } from './hooks/useBibleReader';
const ReadingView = lazy(() => import('./components/views/ReadingView').then(m => ({ default: m.ReadingView })));
const DevotionalView = lazy(() => import('./components/views/DevotionalView').then(m => ({ default: m.DevotionalView })));
const LocationsView = lazy(() => import('./components/views/LocationsView').then(m => ({ default: m.LocationsView })));
const VisualsView = lazy(() => import('./components/views/VisualsView').then(m => ({ default: m.VisualsView })));
const InterlinearView = lazy(() => import('./components/views/InterlinearView').then(m => ({ default: m.InterlinearView })));
const AnalysisView = lazy(() => import('./components/views/AnalysisView').then(m => ({ default: m.AnalysisView })));
const ExegesisView = lazy(() => import('./components/views/ExegesisView').then(m => ({ default: m.ExegesisView })));
const LibraryView = lazy(() => import('./components/views/LibraryView').then(m => ({ default: m.LibraryView })));
const RightPanel = lazy(() => import('./components/layout/RightPanel').then(m => ({ default: m.RightPanel })));
const ProfileModal = lazy(() => import('./components/auth/ProfileModal').then(m => ({ default: m.ProfileModal })));
const AuthScreen = lazy(() => import('./components/auth/AuthScreen').then(m => ({ default: m.AuthScreen })));
const CompleteProfileScreen = lazy(() => import('./components/auth/CompleteProfileScreen').then(m => ({ default: m.CompleteProfileScreen })));
const ConnectKeyScreen = lazy(() => import('./components/auth/ConnectKeyScreen').then(m => ({ default: m.ConnectKeyScreen })));

const MainLayout = lazy(() => import('./components/layout/MainLayout').then(m => ({ default: m.MainLayout })));

import { useAudio } from './contexts/AudioContext';
import { useLanguage } from './contexts/LanguageContext';
import { useRestorePoints } from './hooks/useRestorePoints';
import { useLibrary } from './hooks/useLibrary';
import { useErrorHandler } from './hooks/useErrorHandler';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <i className="fas fa-circle-notch fa-spin text-2xl text-bible-accent"></i>
  </div>
);
import firebase from 'firebase/compat/app';

import { BIBLE_BOOKS, ABBREVIATION_MAP } from './utils/constants';

// --- MAIN COMPONENT ---
export const App: React.FC = () => {
  const { handleError } = useErrorHandler();
  // --- AUTH STATE (Refatorado para Context) ---
  const { user, loading: loadingAuth, isAdmin } = useAuth(); // signOut used in components
  const { t, currentLang, setLanguage } = useLanguage();

  const {
    restorePoints,
    loading: loadingRestorePoints,
    saveRestorePoint,
    deleteRestorePoint
  } = useRestorePoints();
  const {
    resources: libraryResources,
    loading: loadingLibrary,
    uploadResource,
    deleteResource: deleteLibraryResource,
    uploading: uploadingLibrary,
    fetchResources: fetchLibraryResources
  } = useLibrary();

  // Profile Management
  const [showProfileModal, setShowProfileModal] = useState(false);

  const applyAgePersonalization = (age: number, lang: Language) => {
    let suggestedTranslation = 'NVI';
    if (lang === 'en') suggestedTranslation = 'NIV';
    else if (lang === 'es') suggestedTranslation = 'NVI-ES';

    if (age < 12 && age > 0) {
      if (lang === 'pt') suggestedTranslation = 'Bíblia Infantil';
      else if (lang === 'en') suggestedTranslation = 'Kids Bible';
      else if (lang === 'es') suggestedTranslation = 'Biblia Niños';
    }
    setBibleRef((prev: BibleReference) => ({ ...prev, translation: suggestedTranslation }));
  };

  // Profile Management

  // Application State
  // Application State (Refatorado para Contexts)
  const {
    bibleRef,
    setBibleRef,
    compareMode,
    setCompareMode,
    secondaryBibleRef,
    setSecondaryBibleRef,
    secondaryTranslation
  } = useBible();

  // Alias para manter compatibilidade com código antigo se necessário, ou refatorar usos de 'translationInput'

  const [apiKeyReady, setApiKeyReady] = useState(false);

  const { bibleText, secondaryBibleText, loadingText, refetch } = useBibleReader();

  const [activeTab, setActiveTab] = useState<TabView>(TabView.READING);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<RightPanelTab>(RightPanelTab.SEARCH);

  // Feature States
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [locationResult, setLocationResult] = useState<LocationResult | null>(null);
  // visualSummaryUrl removido por não ser utilizado na UI
  const [studyGuideContent, setStudyGuideContent] = useState<string | null>(null);
  const [thematicStudyContent, setThematicStudyContent] = useState<string | null>(null);
  const [interlinearData, setInterlinearData] = useState<InterlinearVerse[] | null>(null);
  const [theologyContent, setTheologyContent] = useState<string | null>(null);
  const [exegesisContent, setExegesisContent] = useState<string | null>(null);
  const [selectedLexiconItem, setSelectedLexiconItem] = useState<LexiconEntry | null>(null);
  // const [activeInterlinearWord, setActiveInterlinearWord] = useState<{
  //   verseIndex: number;
  //   wordIndex: number;
  // } | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Devotional State
  const [devotionalTopic, setDevotionalTopic] = useState('');
  const [devotionalContent, setDevotionalContent] = useState<DevotionalContent | null>(null);

  // Feature Error States
  const [featureError, setFeatureError] = useState<{
    visuals?: string;
    locations?: string;
    visualSummary?: string;
    studyGuide?: string;
    theology?: string;
    exegesis?: string;
    devotional?: string;
  }>({});

  // Library State

  const [libraryAgentQuery, setLibraryAgentQuery] = useState('');
  const [libraryAgentResponse, setLibraryAgentResponse] = useState('');

  // Custom Exegesis State
  const [exegesisInput, setExegesisInput] = useState('');

  // Notepad State
  const [noteContent, setNoteContent] = useState('');
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [selectionPos, setSelectionPos] = useState({ x: 0, y: 0 });
  const [selectionText, setSelectionText] = useState('');
  const noteSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Speech Synthesis
  const { handleStopSpeak } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [customMapQuery, setCustomMapQuery] = useState('');
  // const [thematicStudyTopic, setThematicStudyTopic] = useState('');
  // const [wordAnalysisResults, setWordAnalysisResults] = useState<WordAnalysis[]>([]);

  const [loading, setLoading] = useState<LoadingState>({
    text: false,
    image: false,
    locations: false,
    visualSummary: false,
    search: false,
    studyGuide: false,
    thematicStudy: false,
    wordStudy: false,
    interlinear: false,
    theology: false,
    exegesis: false,
    lexicon: false,
    libraryAgent: false,
    devotional: false,
    restorePoints: false
  });

  // --- RESTORE POINTS LOGIC (Hook-based) ---
  const handleSaveRestorePoint = useCallback(async () => {
    await saveRestorePoint({
      reference: bibleRef,
      activeTab,
      noteContent,
      compareMode,
      secondaryReference: compareMode ? secondaryBibleRef : null
    });
  }, [saveRestorePoint, bibleRef, activeTab, noteContent, compareMode, secondaryBibleRef]);

  const handleLoadRestorePoint = useCallback((point: StudyRestorePoint) => {
    setBibleRef(point.reference);
    setActiveTab(point.activeTab);
    setNoteContent(point.noteContent);
    setCompareMode(point.compareMode);
    if (point.secondaryReference) setSecondaryBibleRef(point.secondaryReference);
    setIsRightPanelOpen(false);

    // Clear specific feature states
    setScenes([]);
    setLocationResult(null);
    setStudyGuideContent(null);
    setTheologyContent(null);
    setExegesisContent(null);
    setInterlinearData(null);
  }, [setBibleRef, setNoteContent, setCompareMode, setSecondaryBibleRef]);

  const handleDeleteRestorePoint = deleteRestorePoint;

  const handleLoadMoreInterlinear = useCallback(async (reset = false) => {
    setLoading((prev: LoadingState) => ({ ...prev, interlinear: true }));
    try {
      const start = reset
        ? 1
        : interlinearData
          ? interlinearData[interlinearData.length - 1].verseNumber + 1
          : 1;
      const end = start + 4;
      const newData = await generateInterlinearChapter(
        bibleRef.book,
        bibleRef.chapter,
        start,
        end,
        currentLang
      );

      if (reset) setInterlinearData(newData);
      else setInterlinearData((prev: InterlinearVerse[] | null) => [...(prev || []), ...newData]);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading((prev: LoadingState) => ({ ...prev, interlinear: false }));
    }
  }, [interlinearData, bibleRef.book, bibleRef.chapter, currentLang, handleError]);

  const handleTabChange = useCallback(async (tab: TabView) => {
    setActiveTab(tab);

    if (tab !== TabView.READING) {
      setCompareMode(false);
    }

    if (tab === TabView.VISUALS && scenes.length === 0) {
      setLoading((prev: LoadingState) => ({ ...prev, image: true }));
      try {
        const newScenes = await generateStoryBoard(
          bibleRef.book,
          bibleRef.chapter,
          bibleText,
          user?.age,
          currentLang
        );
        setScenes(newScenes);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading((prev: LoadingState) => ({ ...prev, image: false }));
      }
    }
    if (tab === TabView.LOCATIONS && !locationResult) {
      setLoading((prev: LoadingState) => ({ ...prev, locations: true }));
      try {
        const res = await findBiblicalLocations(
          bibleRef.book,
          bibleRef.chapter,
          bibleText,
          user?.age,
          currentLang
        );
        setLocationResult(res);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading((prev: LoadingState) => ({ ...prev, locations: false }));
      }
    }
    if (tab === TabView.STUDY_GUIDE && !studyGuideContent) {
      setLoading((prev: LoadingState) => ({ ...prev, studyGuide: true }));
      try {
        const res = await generateStudyGuide(
          `${bibleRef.book} ${bibleRef.chapter}`,
          bibleText,
          user?.age,
          currentLang
        );
        setStudyGuideContent(res);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading((prev: LoadingState) => ({ ...prev, studyGuide: false }));
      }
    }
    if (tab === TabView.THEOLOGY && !theologyContent) {
      setLoading((prev: LoadingState) => ({ ...prev, theology: true }));
      try {
        const res = await generateTheologyAnalysis(
          bibleRef.book,
          bibleRef.chapter,
          bibleText,
          currentLang
        );
        setTheologyContent(res);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading((prev: LoadingState) => ({ ...prev, theology: false }));
      }
    }
    if (tab === TabView.THEMATIC_STUDY && !thematicStudyContent) {
      setLoading((prev: LoadingState) => ({ ...prev, thematicStudy: true }));
      try {
        const res = await generateThematicStudy(
          `${bibleRef.book} ${bibleRef.chapter}`,
          user?.age,
          currentLang
        );
        setThematicStudyContent(res);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading((prev: LoadingState) => ({ ...prev, thematicStudy: false }));
      }
    }
    if (tab === TabView.EXEGESIS && !exegesisContent) {
      setLoading((prev: LoadingState) => ({ ...prev, exegesis: true }));
      try {
        const res = await generateExegesisAnalysis(
          `${bibleRef.book} ${bibleRef.chapter}`,
          bibleText,
          currentLang
        );
        setExegesisContent(res);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading((prev: LoadingState) => ({ ...prev, exegesis: false }));
      }
    }
    if (tab === TabView.INTERLINEAR && !interlinearData) {
      handleLoadMoreInterlinear(true);
    }

    if (tab === TabView.LIBRARY) {
      fetchLibraryResources();
    }
  }, [
    bibleRef,
    bibleText,
    user?.age,
    currentLang,
    scenes.length,
    locationResult,
    studyGuideContent,
    theologyContent,
    thematicStudyContent,
    exegesisContent,
    interlinearData,
    handleLoadMoreInterlinear,
    fetchLibraryResources,
    handleError,
    setCompareMode
  ]);

  const performSearch = useCallback(async () => {
    if (!searchQuery) return;
    setIsRightPanelOpen(true);
    setActiveRightTab(RightPanelTab.SEARCH);
    setLoading((prev) => ({ ...prev, search: true }));
    try {
      const results = await searchBibleReferences(searchQuery, currentLang);
      setSearchResults(results);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading((prev) => ({ ...prev, search: false }));
    }
  }, [searchQuery, currentLang, handleError]);

  const handleParallelClick = useCallback((ref: string) => {
    const match = ref.match(/^(.*?)\s+(\d+):(\d+).*$/);
    if (match) {
      const [, book, chapter] = match;
      const bookObj = BIBLE_BOOKS.find(
        (b) =>
          b.name === book.trim() ||
          b.nameEn === book.trim() ||
          b.nameEs === book.trim() ||
          Object.keys(ABBREVIATION_MAP).find(
            (k) => ABBREVIATION_MAP[k] === book.trim() || k === book.trim()
          )
      );

      if (bookObj) {
        setSecondaryBibleRef({
          book: bookObj.name,
          chapter: parseInt(chapter),
          translation: secondaryTranslation
        });
        setCompareMode(true);
      }
    }
  }, [secondaryTranslation, setSecondaryBibleRef, setCompareMode]);

  const handleStrongClick = useCallback(async (word: string, code: string) => {
    setIsRightPanelOpen(true);
    setActiveRightTab(RightPanelTab.WORD_STUDY);
    setLoading((prev) => ({ ...prev, lexicon: true }));
    try {
      const def = await getWordDefinition(
        word,
        code,
        `${bibleRef.book} ${bibleRef.chapter}`,
        currentLang
      );
      setSelectedLexiconItem(def);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading((prev) => ({ ...prev, lexicon: false }));
    }
  }, [bibleRef.book, bibleRef.chapter, currentLang, handleError]);

  const handleWordClick = useCallback((_word: InterlinearWord, _verseIdx: number, _wordIdx: number) => {
    handleStrongClick(_word.original, _word.strong);
  }, [handleStrongClick]);

  const handleCustomMapGeneration = useCallback(async () => {
    if (!customMapQuery) return;
    setLoading((prev) => ({ ...prev, locations: true }));
    try {
      const res = await generateCustomMap(customMapQuery, user?.age, currentLang);
      setLocationResult(res);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading((prev) => ({ ...prev, locations: false }));
    }
  }, [customMapQuery, user?.age, currentLang, handleError]);

  // handleSelectKey removido por não ser utilizado

  // AUTH OBSERVER REMOVIDO - Agora gerenciado por AuthContext

  // 3. Sincronizar estado local quando usuário muda (Contexto -> App State)
  useEffect(() => {
    if (user && user.email !== 'guest@dev.local') {
      if (user.language) setLanguage(user.language);

      // Chamada segura para função definida no escopo (hoisting funciona para function declaration, mas para const func não.
      // Se applyAgePersonalization é const, esperamos que esteja definida antes ou o useEffect roda depois)
      applyAgePersonalization(user.age, user.language || 'pt');

      const loadNotes = async () => {
        try {
          if (auth.currentUser) {
            const noteDoc = await db
              .collection('users')
              .doc(auth.currentUser.uid)
              .collection('notes')
              .doc('default')
              .get();
            if (noteDoc.exists) setNoteContent(noteDoc.data()?.content || '');
          }
        } catch (e) {
          logger.warn('Erro ao ler notas:', e);
        }
      };
      loadNotes();
    } else if (!user && !loadingAuth) {
      setNoteContent('');
    }
  }, [user, loadingAuth]);

  useEffect(() => {
    const checkApiKey = async () => {
      const aiStudio = (window as unknown as { aistudio: AIStudioClient }).aistudio;
      if (aiStudio) {
        const hasKey = Boolean(await aiStudio.hasSelectedApiKey());
        setApiKeyReady(hasKey);
      } else {
        setApiKeyReady(true);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    if (!secondaryBibleRef && compareMode) {
      setSecondaryBibleRef({ ...bibleRef, translation: secondaryTranslation });
    }
  }, [bibleRef, compareMode]);

  useEffect(() => {
    if (apiKeyReady && user && !loadingAuth) {
      handleStopSpeak();
      // refetch handled by hook or internal logic
    }
  }, [
    bibleRef,
    compareMode,
    secondaryTranslation,
    secondaryBibleRef,
    apiKeyReady,
    user,
    loadingAuth,
    currentLang
  ]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim().length === 0) {
        setShowSelectionMenu(false);
        return;
      }
      const anchorNode = selection.anchorNode;
      const element =
        anchorNode?.nodeType === 3 ? anchorNode.parentElement : (anchorNode as Element);
      if (!element?.closest('.text-bible-text')) {
        setShowSelectionMenu(false);
        return;
      }
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
      setSelectionText(selection.toString());
      setShowSelectionMenu(true);
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const saveHistory = async (action: string, details: string) => {
    // VISITANTES não salvam histórico no DB
    if (auth.currentUser && user?.email !== 'guest@dev.local') {
      try {
        await db.collection('history').add({
          uid: auth.currentUser.uid,
          action,
          details,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (e) {
        handleError(e);
      }
    }
  };

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    if (noteSaveTimeoutRef.current) clearTimeout(noteSaveTimeoutRef.current);

    // VISITANTE: Não salva no Firestore
    if (user?.email === 'guest@dev.local') return;

    noteSaveTimeoutRef.current = setTimeout(async () => {
      if (auth.currentUser) {
        try {
          await db
            .collection('users')
            .doc(auth.currentUser.uid)
            .collection('notes')
            .doc('default')
            .set(
              {
                content: newContent,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              },
              { merge: true }
            );
        } catch (err) {
          handleError(err);
        }
      }
    }, 1000);
  }, [user?.email, handleError]);

  const addSelectionToNotes = useCallback(() => {
    if (!selectionText) return;
    const appendText = `\n> "${selectionText}"\n`;
    const updatedContent = noteContent + appendText;
    setNoteContent(updatedContent);
    setIsRightPanelOpen(true);
    setActiveRightTab(RightPanelTab.NOTES);
    setShowSelectionMenu(false);
    window.getSelection()?.removeAllRanges();

    // VISITANTE: Não salva no Firestore
    if (user?.email === 'guest@dev.local') return;

    if (auth.currentUser) {
      db.collection('users').doc(auth.currentUser.uid).collection('notes').doc('default').set(
        {
          content: updatedContent,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }
  }, [selectionText, noteContent, user?.email]);

  const exportNotesTxt = useCallback(() => {
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eden-notes-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [noteContent]);

  const exportNotesPdf = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Anotações ÉDEN</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; line-height: 1.6; color: #3E2723; background: #F5F5DC; }
              h1 { color: #388E3C; border-bottom: 2px solid #D7CCC8; padding-bottom: 10px; }
              pre { white-space: pre-wrap; font-family: 'Georgia', serif; }
              blockquote { border-left: 4px solid #388E3C; margin: 0; padding-left: 20px; color: #5D4037; font-style: italic; }
            </style>
          </head>
          <body>
            <h1>Minhas Anotações - ÉDEN</h1>
            <p style="font-size: 12px; color: #888;">Gerado em: ${new Date().toLocaleString()}</p>
            <pre>${noteContent.replace(/> "(.*?)"/g, '<blockquote>$1</blockquote>')}</pre>
            <script>window.onload = function() { window.print(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, [noteContent]);

  const handleDeleteResource = useCallback(async (id: string, fileUrl?: string) => {
    if (window.confirm('Tem certeza que deseja excluir este recurso permanentemente?')) {
      await deleteLibraryResource(id, fileUrl);
    }
  }, [deleteLibraryResource]);

  const handleLibraryAgentAsk = useCallback(async () => {
    if (!libraryAgentQuery) return;
    setLoading((prev) => ({ ...prev, libraryAgent: true }));
    try {
      const response = await askLibraryAgent(libraryAgentQuery, libraryResources, currentLang);
      setLibraryAgentResponse(response);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading((prev) => ({ ...prev, libraryAgent: false }));
    }
  }, [libraryAgentQuery, libraryResources, currentLang, handleError]);

  const handleGenerateDevotional = useCallback(async () => {
    if (!devotionalTopic.trim()) return;
    setLoading((prev) => ({ ...prev, devotional: true }));
    setFeatureError((prev) => ({ ...prev, devotional: undefined }));
    try {
      const content = await generateDailyDevotional(devotionalTopic, undefined, currentLang);
      if (content) {
        setDevotionalContent(content);
        if (auth.currentUser) saveHistory('generate_devotional', devotionalTopic);
      } else {
        setFeatureError((prev) => ({
          ...prev,
          devotional: 'Não foi possível gerar o devocional.'
        }));
      }
    } catch (e) {
      handleError(e);
      setFeatureError((prev) => ({ ...prev, devotional: 'Erro de conexão.' }));
    } finally {
      setLoading((prev) => ({ ...prev, devotional: false }));
    }
  }, [devotionalTopic, currentLang, handleError]);

  const handleCustomExegesis = useCallback(async () => {
    if (!exegesisInput.trim()) return;
    setLoading((prev) => ({ ...prev, exegesis: true }));
    try {
      const content = await generateExegesisAnalysis(
        'Texto Selecionado',
        exegesisInput,
        currentLang
      );
      setExegesisContent(content);
      if (auth.currentUser) saveHistory('custom_exegesis', exegesisInput.substring(0, 50));
    } catch (e) {
      handleError(e);
    } finally {
      setLoading((prev) => ({ ...prev, exegesis: false }));
    }
  }, [exegesisInput, currentLang, handleError]);

  const handleResetExegesis = useCallback(async () => {
    setExegesisInput('');
    setLoading((prev) => ({ ...prev, exegesis: true }));
    try {
      const data = await generateExegesisAnalysis(
        `${bibleRef.book} ${bibleRef.chapter}`,
        bibleText,
        currentLang
      );
      setExegesisContent(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading((prev) => ({ ...prev, exegesis: false }));
    }
  }, [bibleRef.book, bibleRef.chapter, bibleText, currentLang, handleError]);

  // --- RENDER FLOW ---
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-layer-1 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-bible-accent mb-4"></i>
          <p className="text-bible-text-light font-medium">Sincronizando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Suspense fallback={null}><AuthScreen /></Suspense>;
  if (user.age === 0) return <Suspense fallback={null}><CompleteProfileScreen /></Suspense>;
  if (!apiKeyReady)
    return (
      <Suspense fallback={null}>
        <ConnectKeyScreen
          onConnect={() => {
            setApiKeyReady(true);
            if (user) refetch();
          }}
        />
      </Suspense>
    );

  return (
    <div className="contents">
      <Suspense fallback={<LoadingSpinner />}>
        <MainLayout
          activeTab={activeTab}
          onTabChange={handleTabChange}
          t={t}
          onOpenProfile={() => setShowProfileModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={performSearch}
          loadingSearch={loading.search}
          onOpenRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
          isRightPanelOpen={isRightPanelOpen}
          compareMode={compareMode}
          onToggleCompare={() => setCompareMode(!compareMode)}
        >
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="flex-1 flex overflow-hidden relative">
              <div
                className={`h-full overflow-y-auto p-4 md:p-8 transition-all duration-300 relative text-bible-text flex-1 min-w-0 ${activeTab !== TabView.READING && activeTab !== TabView.LIBRARY ? 'hidden md:block md:w-1/2 md:border-r border-bible-border flex-none' : 'w-full'} ${compareMode ? 'w-1/2 border-r border-bible-border flex-none' : ''}`}
              >
                {activeTab === TabView.LIBRARY ? (
                  <div className="max-w-6xl mx-auto pb-20 md:pb-0 h-full overflow-y-auto">
                    <LibraryView
                      resources={libraryResources}
                      loading={loadingLibrary}
                      uploading={uploadingLibrary}
                      isAdmin={isAdmin}
                      onDelete={handleDeleteResource}
                      onUpload={uploadResource}
                    />
                  </div>
                ) : (
                  <ReadingView
                    bibleText={bibleText}
                    secondaryBibleText={secondaryBibleText}
                    loading={loadingText}
                    t={t}
                    onParallelClick={handleParallelClick}
                    onStrongClick={
                      bibleRef.translation.includes('Strong') ? handleStrongClick : undefined
                    }
                    isSidePanelOpen={activeTab !== TabView.READING}
                  />
                )}
              </div>

              {activeTab !== TabView.READING && activeTab !== TabView.LIBRARY && (
                <div className="w-full md:w-1/2 bg-bible-paper border-l border-bible-border flex flex-col h-full">
                  <div className="p-4 border-b border-bible-border flex justify-between">
                    <h2 className="font-bold">
                      {activeTab === TabView.LOCATIONS
                        ? t('maps')
                        : activeTab === TabView.THEOLOGY
                          ? t('theology')
                          : activeTab === TabView.EXEGESIS
                            ? t('exegesis')
                            : activeTab === TabView.INTERLINEAR
                              ? t('interlinear')
                              : activeTab === TabView.DEVOTIONALS
                                ? t('devotionals')
                                : t('visuals')}
                    </h2>
                    <button onClick={() => setActiveTab(TabView.READING)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="h-full flex flex-col overflow-hidden">
                    {activeTab === TabView.DEVOTIONALS && (
                      <DevotionalView
                        loading={loading.devotional}
                        content={devotionalContent}
                        topic={devotionalTopic}
                        onTopicChange={setDevotionalTopic}
                        onGenerate={handleGenerateDevotional}
                        isGuest={user?.email === 'guest@dev.local'}
                        error={featureError.devotional}
                      />
                    )}

                    {activeTab !== TabView.DEVOTIONALS && (
                      <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === TabView.LOCATIONS && (
                          <LocationsView
                            loading={loading.locations}
                            result={locationResult}
                            customQuery={customMapQuery}
                            onQueryChange={setCustomMapQuery}
                            onSearch={handleCustomMapGeneration}
                          />
                        )}
                        {activeTab === TabView.VISUALS && (
                          <VisualsView loading={loading.image} scenes={scenes} />
                        )}
                        {activeTab === TabView.INTERLINEAR && (
                          <InterlinearView
                            loading={loading.interlinear}
                            data={interlinearData}
                            onLoadMore={handleLoadMoreInterlinear}
                            onWordClick={handleWordClick}
                          />
                        )}
                        {activeTab === TabView.EXEGESIS && (
                          <ExegesisView
                            loading={loading.exegesis}
                            content={exegesisContent}
                            input={exegesisInput}
                            setInput={setExegesisInput}
                            onAnalyze={handleCustomExegesis}
                            onReset={handleResetExegesis}
                          />
                        )}
                        {activeTab === TabView.THEOLOGY && (
                          <AnalysisView
                            loading={loading.theology}
                            content={theologyContent}
                            type="theology"
                          />
                        )}
                        {activeTab === TabView.STUDY_GUIDE && (
                          <AnalysisView
                            loading={loading.studyGuide}
                            content={studyGuideContent}
                            type="studyGuide"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <RightPanel
              isOpen={isRightPanelOpen}
              onClose={() => setIsRightPanelOpen(false)}
              activeTab={activeRightTab}
              onTabChange={setActiveRightTab}
              t={t}
              searchResults={searchResults}
              onSearchResultClick={(ref) => {
                setBibleRef({ ...bibleRef, ...ref });
                setIsRightPanelOpen(false);
              }}
              noteContent={noteContent}
              onNoteChange={handleNoteChange}
              onExportNotesTxt={exportNotesTxt}
              onExportNotesPdf={exportNotesPdf}
              isGuest={user?.email === 'guest@dev.local'}
              selectedLexiconItem={selectedLexiconItem}
              loadingLexicon={loading.lexicon}
              restorePoints={restorePoints}
              loadingRestorePoints={loadingRestorePoints}
              onSaveRestorePoint={handleSaveRestorePoint}
              onDeleteRestorePoint={handleDeleteRestorePoint}
              onLoadRestorePoint={handleLoadRestorePoint}
              libraryAgentQuery={libraryAgentQuery}
              setLibraryAgentQuery={setLibraryAgentQuery}
              libraryAgentResponse={libraryAgentResponse}
              loadingLibraryAgent={loading.libraryAgent}
              onAskLibraryAgent={handleLibraryAgentAsk}
            />
          </div>
        </MainLayout>

        <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      </Suspense>

      {showSelectionMenu && (
        <div
          className="fixed bg-layer-2 border border-bible-border shadow-xl rounded-lg p-1.5 flex gap-1 z-[70] animate-in fade-in zoom-in duration-200"
          style={{ left: selectionPos.x, top: selectionPos.y, transform: 'translate(-50%, -100%)' }}
        >
          <button
            onClick={addSelectionToNotes}
            className="p-2 hover:bg-bible-secondary rounded text-bible-accent transition-colors"
            title="Adicionar à Nota"
          >
            <i className="fas fa-sticky-note"></i>
          </button>
          <div className="w-[1px] bg-bible-border mx-1"></div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectionText);
              setShowSelectionMenu(false);
            }}
            className="p-2 hover:bg-bible-secondary rounded text-bible-text-light transition-colors"
            title="Copiar"
          >
            <i className="fas fa-copy"></i>
          </button>
          <button
            onClick={() => setShowSelectionMenu(false)}
            className="p-2 hover:bg-red-50 rounded text-red-400 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {fullScreenImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setFullScreenImage(null)}
        >
          <img src={fullScreenImage} className="max-w-full max-h-full" alt="Full Screen" />
        </div>
      )}
    </div>
  );
};
