import firebase from 'firebase/compat/app';

export type Language = 'pt' | 'en' | 'es';

export interface BibleReference {
  book: string;
  chapter: number;
  translation: string;
}

export interface StudyRestorePoint {
  id: string;
  timestamp: firebase.firestore.Timestamp;
  reference: BibleReference;
  activeTab: TabView;
  noteContent: string;
  compareMode: boolean;
  secondaryReference?: BibleReference | null;
}

export interface LocationData {
  biblicalName: string;
  modernName: string;
  description: string;
  coordinates?: string; // Optional
}

export interface LocationResult {
  locations: LocationData[];
  mapUrl: string | null;
  regionDescription: string;
}

export interface Scene {
  url: string;
  caption: string;
  prompt: string;
}

export interface SearchResult {
  reference: string; // e.g., "João 3:16"
  text: string;
  book: string;
  chapter: number;
}

export interface SavedVerse {
  id: string; // unique id (book-chapter-verse)
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verseNumber: number;
}

export interface WordAnalysis {
  word: string; // The translated word (e.g. "Princípio")
  original: string; // The original word (e.g. "Bereshit")
  transliteration: string; // Pronunciation
  strongNumber: string; // e.g. "H7225"
  definition: string; // Dictionary definition
  language: 'Hebrew' | 'Greek';
}

// Detailed Lexicon Entry for single word click
export interface LexiconEntry {
  original: string;
  transliteration: string;
  strong: string;
  root: string;
  morphology: string; // e.g. "Verb - Aorist Active Indicative"
  definition: string;
  practicalDefinition: string; // New: Simplified practical meaning
  biblicalUsage: string[]; // List of meanings
  theologicalSignificance: string;
}

// New Types for Interlinear
export interface InterlinearWord {
  original: string;
  transliteration: string;
  portuguese: string;
  strong: string;
  morphology?: string; // e.g. "V-Qal-Perf-3ms"
}

export interface InterlinearVerse {
  verseNumber: number;
  words: InterlinearWord[];
  language: 'Hebrew' | 'Greek';
}

export interface UserProfile {
  name: string;
  age: number;
  email: string;
  phone?: string;
  role?: 'admin' | 'user'; // Access Control
  language?: Language; // New: User language preference
  nationality?: string; // New: User nationality
  photoURL?: string; // New: User profile picture URL
}

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'handout' | 'teaching' | 'other';
  fileUrl: string;
  fileName: string;
  textContent?: string; // Content for AI analysis
  uploadedBy: string;
  createdAt: firebase.firestore.Timestamp;
}

export interface DevotionalContent {
  title: string;
  scriptureReference: string;
  scriptureText: string;
  reflection: string;
  prayer: string;
  finalQuote: string;
}

export enum TabView {
  READING = 'reading',
  VISUALS = 'visuals',
  LOCATIONS = 'locations',
  VISUAL_SUMMARY = 'visual_summary',
  STUDY_GUIDE = 'study_guide',
  THEMATIC_STUDY = 'thematic_study',
  INTERLINEAR = 'interlinear',
  THEOLOGY = 'theology',
  EXEGESIS = 'exegesis',
  LIBRARY = 'library',
  DEVOTIONALS = 'devotionals'
}

export enum RightPanelTab {
  SEARCH = 'search',
  SAVED = 'saved',
  NOTES = 'notes',
  WORD_STUDY = 'word_study',
  LIBRARY_AGENT = 'library_agent',
  RESTORE_POINTS = 'restore_points'
}

export interface LoadingState {
  text: boolean;
  image: boolean;
  locations: boolean;
  visualSummary: boolean;
  search: boolean;
  studyGuide: boolean;
  thematicStudy: boolean;
  wordStudy: boolean;
  interlinear: boolean;
  theology: boolean;
  exegesis: boolean;
  lexicon: boolean;
  libraryAgent: boolean;
  devotional: boolean;
  restorePoints: boolean;
}

// Google AI Studio Integration
export interface AIStudioClient {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<boolean>;
}
