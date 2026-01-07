import React from 'react';
import {
  RightPanelTab,
  SearchResult,
  LexiconEntry,
  StudyRestorePoint,
  BibleReference
} from '../../types';
import SimpleMarkdown from '../SimpleMarkdown';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: RightPanelTab;
  onTabChange: (tab: RightPanelTab) => void;
  t: (key: string) => string;

  // Search Props
  searchResults: SearchResult[] | null;
  onSearchResultClick: (ref: BibleReference) => void;

  // Notes Props
  noteContent: string;
  onNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onExportNotesTxt: () => void;
  onExportNotesPdf: () => void;
  isGuest: boolean;

  // Word Study Props
  selectedLexiconItem: LexiconEntry | null;
  loadingLexicon: boolean;

  // Restore Points Props
  restorePoints: StudyRestorePoint[];
  loadingRestorePoints: boolean;
  onSaveRestorePoint: () => void;
  onDeleteRestorePoint: (id: string) => void;
  onLoadRestorePoint: (point: StudyRestorePoint) => void;

  // Library Agent Props
  libraryAgentQuery: string;
  setLibraryAgentQuery: (q: string) => void;
  libraryAgentResponse: string | null;
  loadingLibraryAgent: boolean;
  onAskLibraryAgent: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  t,
  searchResults,
  onSearchResultClick,
  noteContent,
  onNoteChange,
  onExportNotesTxt,
  onExportNotesPdf,
  isGuest,
  selectedLexiconItem,
  loadingLexicon,
  restorePoints,
  loadingRestorePoints,
  onSaveRestorePoint,
  onDeleteRestorePoint,
  onLoadRestorePoint,
  libraryAgentQuery,
  setLibraryAgentQuery,
  libraryAgentResponse,
  loadingLibraryAgent,
  onAskLibraryAgent
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-layer-2 border-l border-bible-border flex flex-col absolute right-0 h-full z-40 shadow-2xl">
      {/* --- Header --- */}
      <div className="p-4 border-b border-bible-border flex justify-between bg-layer-2">
        <h3 className="font-bold">Ferramentas</h3>
        <button onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* --- Tabs --- */}
      <div className="flex border-b border-bible-border bg-layer-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onTabChange(RightPanelTab.SEARCH)}
          className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold uppercase whitespace-nowrap px-1 ${activeTab === RightPanelTab.SEARCH ? 'text-bible-accent border-b-2 border-bible-accent' : 'text-bible-text-light hover:bg-bible-hover'}`}
        >
          <i className="fas fa-search block mb-1"></i> Busca
        </button>
        <button
          onClick={() => onTabChange(RightPanelTab.NOTES)}
          className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold uppercase whitespace-nowrap px-1 ${activeTab === RightPanelTab.NOTES ? 'text-bible-accent border-b-2 border-bible-accent' : 'text-bible-text-light hover:bg-bible-hover'}`}
        >
          <i className="fas fa-pen block mb-1"></i> Notas
        </button>
        <button
          onClick={() => onTabChange(RightPanelTab.WORD_STUDY)}
          className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold uppercase whitespace-nowrap px-1 ${activeTab === RightPanelTab.WORD_STUDY ? 'text-bible-accent border-b-2 border-bible-accent' : 'text-bible-text-light hover:bg-bible-hover'}`}
        >
          <i className="fas fa-book block mb-1"></i> Strong
        </button>
        <button
          onClick={() => onTabChange(RightPanelTab.RESTORE_POINTS)}
          className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold uppercase whitespace-nowrap px-1 ${activeTab === RightPanelTab.RESTORE_POINTS ? 'text-bible-accent border-b-2 border-bible-accent' : 'text-bible-text-light hover:bg-bible-hover'}`}
        >
          <i className="fas fa-history block mb-1"></i> Restauração
        </button>
        <button
          onClick={() => onTabChange(RightPanelTab.LIBRARY_AGENT)}
          className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold uppercase whitespace-nowrap px-1 ${activeTab === RightPanelTab.LIBRARY_AGENT ? 'text-bible-accent border-b-2 border-bible-accent' : 'text-bible-text-light hover:bg-bible-hover'}`}
        >
          <i className="fas fa-robot block mb-1"></i> Agente
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === RightPanelTab.RESTORE_POINTS && (
          <div className="h-full flex flex-col space-y-4">
            <button
              onClick={onSaveRestorePoint}
              disabled={loadingRestorePoints}
              className="w-full py-3 bg-bible-accent text-white rounded-lg font-bold shadow-md hover:bg-bible-accent-hover flex items-center justify-center gap-2 transition-all"
            >
              {loadingRestorePoints ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-save"></i>
              )}{' '}
              {t('saveRestore')}
            </button>
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {restorePoints.length === 0 ? (
                <div className="text-center py-10 opacity-50 flex flex-col items-center">
                  <i className="fas fa-history text-3xl mb-2"></i>
                  <p className="text-xs">{t('noRestore')}</p>
                </div>
              ) : (
                restorePoints.map((p) => (
                  <div
                    key={p.id}
                    className="bg-bible-card border border-bible-border rounded-lg p-3 shadow-sm group hover:border-bible-accent transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-bible-text text-sm">
                          {p.reference.book} {p.reference.chapter}
                        </h4>
                        <p className="text-[10px] text-bible-text-light">
                          {p.timestamp?.toDate ? p.timestamp.toDate().toLocaleString() : 'Recent'}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteRestorePoint(p.id)}
                        className="text-bible-text-light hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                    <button
                      onClick={() => onLoadRestorePoint(p)}
                      className="w-full py-1.5 bg-bible-secondary text-bible-text text-[10px] font-bold rounded uppercase hover:bg-bible-accent hover:text-white transition-all"
                    >
                      {t('restoreNow')}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === RightPanelTab.LIBRARY_AGENT && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 bg-bible-card border border-bible-border rounded-lg p-3 shadow-inner">
              {loadingLibraryAgent ? (
                <div className="flex flex-col items-center justify-center h-full opacity-60">
                  <i className="fas fa-spinner fa-spin text-2xl text-bible-accent mb-2"></i>
                  <p className="text-xs">Consultando biblioteca...</p>
                </div>
              ) : libraryAgentResponse ? (
                <div className="prose prose-sm prose-brown">
                  <SimpleMarkdown text={libraryAgentResponse} />
                </div>
              ) : (
                <div className="text-center text-bible-text-light mt-10 opacity-60">
                  <i className="fas fa-robot text-4xl mb-3"></i>
                  <p className="text-sm">Olá! Sou o agente da biblioteca.</p>
                  <p className="text-xs mt-2">Faça perguntas sobre os livros disponíveis.</p>
                </div>
              )}
            </div>
            <div className="relative">
              <textarea
                value={libraryAgentQuery}
                onChange={(e) => setLibraryAgentQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onAskLibraryAgent())
                }
                placeholder="Pergunte sobre os livros..."
                className="w-full border border-bible-border rounded-lg pl-3 pr-10 py-3 text-sm focus:border-bible-accent outline-none resize-none shadow-sm"
                rows={2}
              />
              <button
                onClick={onAskLibraryAgent}
                disabled={loadingLibraryAgent || !libraryAgentQuery.trim()}
                className="absolute right-2 top-2 w-8 h-8 bg-bible-accent text-white rounded-full hover:bg-bible-accent-hover disabled:opacity-50 flex items-center justify-center transition-all"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        )}

        {activeTab === RightPanelTab.SEARCH && (
          <div>
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((r, i) => (
                <div
                  key={i}
                  onClick={() =>
                    onSearchResultClick({ book: r.book, chapter: r.chapter, translation: '' })
                  }
                  className="cursor-pointer mb-2 p-3 bg-bible-card rounded shadow-sm hover:shadow-md transition-all border border-bible-border"
                >
                  <span className="font-bold text-bible-accent block mb-1">{r.reference}</span>
                  <p className="text-xs text-bible-text leading-relaxed">{r.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-bible-text-light mt-10">
                <i className="fas fa-search text-3xl mb-2 opacity-30"></i>
                <p>Faça uma busca para ver os resultados.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === RightPanelTab.WORD_STUDY && (
          <div className="space-y-6">
            {loadingLexicon && (
              <div className="text-center p-4">
                <i className="fas fa-circle-notch fa-spin text-bible-accent text-2xl"></i>
                <p className="mt-2 text-xs">Analisando...</p>
              </div>
            )}
            {selectedLexiconItem && !loadingLexicon ? (
              <div className="animate-in slide-in-from-right duration-300">
                <div className="bg-bible-paper p-4 rounded-lg border border-bible-border mb-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-serif font-bold text-bible-text">
                      {selectedLexiconItem.original}
                    </h2>
                    <span className="text-xs font-mono text-bible-accent bg-bible-secondary px-2 py-1 rounded">
                      {selectedLexiconItem.strong}
                    </span>
                  </div>
                  <p className="text-sm text-bible-text-light italic mb-2 mt-1">
                    {selectedLexiconItem.transliteration}
                  </p>
                  <span className="inline-block px-2 py-1 bg-bible-secondary text-[10px] rounded uppercase font-bold tracking-wide text-bible-text-light border border-bible-border">
                    {selectedLexiconItem.morphology}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="bg-bible-card p-3 rounded border border-bible-border">
                    <h4 className="font-bold text-bible-accent text-xs uppercase tracking-wider mb-2 flex items-center">
                      <i className="fas fa-book-open mr-2"></i> Definição
                    </h4>
                    <p className="text-sm leading-relaxed">{selectedLexiconItem.definition}</p>
                  </div>
                  <div className="bg-bible-card p-3 rounded border border-bible-border">
                    <h4 className="font-bold text-bible-accent text-xs uppercase tracking-wider mb-2 flex items-center">
                      <i className="fas fa-lightbulb mr-2"></i> Significado Prático
                    </h4>
                    <p className="text-sm leading-relaxed">
                      {selectedLexiconItem.practicalDefinition}
                    </p>
                  </div>
                  <div className="bg-bible-card p-3 rounded border border-bible-border">
                    <h4 className="font-bold text-bible-accent text-xs uppercase tracking-wider mb-2 flex items-center">
                      <i className="fas fa-cross mr-2"></i> Teologia
                    </h4>
                    <p className="text-sm leading-relaxed text-justify">
                      {selectedLexiconItem.theologicalSignificance}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              !loadingLexicon && (
                <div className="text-center text-bible-text-light mt-10">
                  <i className="fas fa-language text-3xl mb-2 opacity-30"></i>
                  <p>Clique em uma palavra com código Strong para ver o significado.</p>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === RightPanelTab.NOTES && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 bg-bible-paper p-2 rounded border border-bible-border">
              <h4 className="font-bold text-sm">Anotações</h4>
              <div className="flex gap-2">
                <button
                  onClick={onExportNotesTxt}
                  className="text-xs px-2 py-1 bg-bible-card border rounded hover:bg-bible-hover"
                  title="Exportar TXT"
                >
                  <i className="fas fa-file-alt"></i>
                </button>
                <button
                  onClick={onExportNotesPdf}
                  className="text-xs px-2 py-1 bg-bible-card border rounded hover:bg-bible-hover"
                  title="Imprimir/PDF"
                >
                  <i className="fas fa-print"></i>
                </button>
              </div>
            </div>
            <textarea
              className="flex-1 w-full bg-bible-card border border-bible-border rounded-lg p-4 resize-none outline-none focus:border-bible-accent font-serif leading-relaxed text-bible-text shadow-inner"
              value={noteContent}
              onChange={onNoteChange}
              placeholder="Escreva suas reflexões, sermões ou estudos aqui..."
            />
            <p className="text-[10px] text-center text-bible-text-light mt-2 opacity-70">
              {isGuest ? 'Notas temporárias (Visitante)' : 'Salvo automaticamente'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
