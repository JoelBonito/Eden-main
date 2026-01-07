import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBible } from '../../contexts/BibleContext';
import { BibleReference } from '../../types';
import { BIBLE_BOOKS, AVAILABLE_TRANSLATIONS } from '../../utils/constants';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  toggleSidebar: () => void;
  t: (key: string) => string;
  onOpenProfile: () => void;
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  loadingSearch: boolean;
  // Panels
  onOpenRightPanel: () => void;
  isRightPanelOpen: boolean;
  // Compare
  compareMode: boolean;
  onToggleCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  t,
  onOpenProfile,
  searchQuery,
  onSearchChange,
  onSearch,
  loadingSearch,
  onOpenRightPanel,
  isRightPanelOpen,
  compareMode,
  onToggleCompare
}) => {
  const [verseInput, setVerseInput] = useState('');
  const { user, signOut } = useAuth();
  const { bibleRef, setBibleRef, translation, setTranslation } = useBible();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleGoToVerse = () => {
    // Se tem verso específico, poderíamos implementar scroll
    // Por enquanto apenas recarrega o capítulo
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bookName = e.target.value;
    setBibleRef((prev: BibleReference) => ({ ...prev, book: bookName, chapter: 1 }));
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chapter = parseInt(e.target.value) || 1;
    const book = BIBLE_BOOKS.find((b) => b.name === bibleRef.book);
    const maxChapter = book?.chapters || 50;
    const validChapter = Math.min(Math.max(1, chapter), maxChapter);
    setBibleRef((prev: BibleReference) => ({ ...prev, chapter: validChapter }));
  };

  const handleTranslationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTranslation(e.target.value);
    setBibleRef((prev: BibleReference) => ({ ...prev, translation: e.target.value }));
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 h-16 bg-transparent flex items-center px-3 md:px-4 lg:px-6 shrink-0 z-40 pointer-events-none gap-2">
        {/* Esquerda: Menu Button + Logo Mobile */}
        <div className="flex items-center space-x-2 pointer-events-auto shrink-0">
          {/* Menu Hambúrguer (Mobile/Tablet) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-bible-text p-2 hover:bg-bible-hover bg-layer-2 rounded-lg transition-colors border border-bible-border shadow-md"
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Logo compacta no Mobile/Tablet */}
          <div className="lg:hidden flex items-center">
            <img
              src="/eden-logo-v2.png"
              alt="ÉDEN"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Centro: Seletores de Navegação Bíblica (Desktop apenas) - com flex-1 para ocupar espaço disponível */}
        <div className="hidden lg:flex items-center bg-layer-2 rounded-xl px-3 py-1.5 border border-bible-border shadow-lg pointer-events-auto flex-1 min-w-0 max-w-fit">
          {/* Seletor de Livro */}
          <select
            value={bibleRef.book}
            onChange={handleBookChange}
            className="bg-transparent border-none text-sm font-bold text-bible-text focus:outline-none cursor-pointer py-1 hover:text-bible-accent transition-colors truncate max-w-[140px]"
          >
            {BIBLE_BOOKS.map((book) => (
              <option key={book.name} value={book.name} className="bg-layer-2 text-bible-text">
                {book.name}
              </option>
            ))}
          </select>

          {/* Divisor */}
          <div className="h-4 w-px bg-bible-border mx-2 shrink-0"></div>

          {/* Campo de Capítulo */}
          <div className="flex items-center shrink-0">
            <input
              type="number"
              value={bibleRef.chapter}
              onChange={handleChapterChange}
              min={1}
              className="w-12 text-center bg-bible-card border border-bible-border rounded-lg px-1 py-1 text-sm font-bold focus:border-bible-accent focus:outline-none shadow-sm"
            />
          </div>

          {/* Divisor */}
          <div className="h-4 w-px bg-bible-border mx-2 shrink-0"></div>

          {/* Seletor de Tradução */}
          <select
            value={translation}
            onChange={handleTranslationChange}
            className="bg-transparent border-none text-sm font-bold text-bible-text focus:outline-none cursor-pointer py-1 hover:text-bible-accent transition-colors truncate max-w-[180px]"
          >
            {AVAILABLE_TRANSLATIONS.map((trans) => (
              <option key={trans.id} value={trans.id} className="bg-layer-2 text-bible-text">
                {trans.label}
              </option>
            ))}
          </select>

          {/* Divisor */}
          <div className="h-4 w-px bg-bible-border mx-2 shrink-0"></div>

          {/* Botão VS (versículo) */}
          <div className="flex items-center shrink-0">
            <span className="text-xs text-bible-text-light mr-1 font-bold opacity-60">vs</span>
            <input
              type="text"
              value={verseInput}
              onChange={(e) => setVerseInput(e.target.value)}
              placeholder=""
              className="w-10 text-center bg-bible-card border border-bible-border rounded-lg px-1 py-1 text-sm font-bold focus:border-bible-accent focus:outline-none shadow-sm"
            />
          </div>

          <button
            onClick={handleGoToVerse}
            className="ml-2 bg-bible-accent text-bible-text px-3 py-1 rounded-lg text-sm font-bold hover:bg-bible-accent-hover transition-all shadow-sm active:scale-95 border border-bible-border/30 shrink-0"
          >
            Ir
          </button>
        </div>

        {/* Barra Separadora Principal (Desktop apenas) */}
        <div className="hidden lg:block h-8 w-px bg-bible-border opacity-50 shrink-0"></div>

        {/* Direita: Ações (Responsivo - sempre visível) */}
        <div className="flex items-center space-x-2 pointer-events-auto shrink-0 ml-auto">
          {/* Botão Navegação Bíblica Mobile/Tablet */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg bg-layer-2 border border-bible-border shadow-md text-bible-text hover:bg-bible-hover transition-all"
            title="Navegar para..."
          >
            <i className="fas fa-book-bible text-sm"></i>
          </button>

          {/* Container de Ações Desktop */}
          <div className="hidden lg:flex items-center bg-layer-2 rounded-xl border border-bible-border shadow-lg p-1">
            {/* Barra de Busca - largura responsiva */}
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-bible-text-light text-xs opacity-60"></i>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t('searchPlaceholder') || 'Pesquisar...'}
                  className="w-28 xl:w-40 2xl:w-56 pl-8 pr-2 py-1.5 rounded-lg border-none bg-transparent text-sm focus:outline-none transition-all"
                />
              </form>
              {loadingSearch && (
                <i className="fas fa-circle-notch fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-bible-accent text-xs"></i>
              )}
            </div>

            <div className="w-px h-6 bg-bible-border mx-1"></div>

            {/* Botão Comparar */}
            <button
              onClick={onToggleCompare}
              className={`p-2 rounded-lg transition-all ${compareMode ? 'bg-bible-accent text-white shadow-md' : 'text-bible-text hover:bg-bible-hover'}`}
              title="Comparar Versões"
            >
              <i className="fas fa-columns text-sm"></i>
            </button>

            {/* Botão Ferramentas */}
            <button
              onClick={onOpenRightPanel}
              className={`p-2 rounded-lg transition-all ${isRightPanelOpen ? 'bg-bible-accent text-white shadow-md' : 'text-bible-text hover:bg-bible-hover'}`}
              title="Ferramentas"
            >
              <i className="fas fa-tools text-sm"></i>
            </button>

            <div className="w-px h-6 bg-bible-border mx-1"></div>

            {/* Toggle de Tema */}
            <ThemeToggle />

            <div className="w-px h-6 bg-bible-border mx-1"></div>

            {/* Perfil Desktop */}
            <div className="relative">
              {user ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bible-hover transition-all"
                    title="Menu do Perfil"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-bible-border shadow-sm flex items-center justify-center bg-bible-paper">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-user text-bible-text-light text-sm"></i>
                      )}
                    </div>
                    <i className={`fas fa-chevron-down text-[10px] text-bible-text-light transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 top-full mt-2 w-56 bg-layer-2 border border-bible-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-4 border-b border-bible-border bg-bible-secondary/30">
                          <p className="text-sm font-bold text-bible-text truncate">{user.name || user.email}</p>
                          <p className="text-[10px] text-bible-text-light truncate opacity-70">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => { onOpenProfile(); setProfileMenuOpen(false); }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-bible-text hover:bg-bible-hover rounded-lg transition-colors text-left"
                          >
                            <i className="fas fa-user-circle w-5 text-bible-accent text-center"></i>
                            <span>{t('profile') || 'Meu Perfil'}</span>
                          </button>
                          <button
                            onClick={() => { setProfileMenuOpen(false); }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-bible-text hover:bg-bible-hover rounded-lg transition-colors text-left"
                          >
                            <i className="fas fa-cog w-5 text-bible-text-light opacity-60 text-center"></i>
                            <span>Configurações</span>
                          </button>
                          <div className="h-px bg-bible-border my-1 mx-2"></div>
                          <button
                            onClick={() => { signOut(); setProfileMenuOpen(false); }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                          >
                            <i className="fas fa-sign-out-alt w-5 text-center"></i>
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenProfile}
                  className="w-8 h-8 rounded-lg text-bible-text hover:bg-bible-hover flex items-center justify-center transition-all bg-bible-secondary/50 border border-bible-border"
                  title="Entrar"
                >
                  <i className="fas fa-user"></i>
                </button>
              )}
            </div>
          </div>

          {/* Ações Mobile/Tablet - Sempre visíveis */}
          <div className="flex lg:hidden items-center bg-layer-2 rounded-xl border border-bible-border shadow-lg p-1 space-x-1">
            {/* Botão Ferramentas */}
            <button
              onClick={onOpenRightPanel}
              className={`p-2 rounded-lg transition-all ${isRightPanelOpen ? 'bg-bible-accent text-white shadow-md' : 'text-bible-text hover:bg-bible-hover'}`}
              title="Ferramentas"
            >
              <i className="fas fa-tools text-sm"></i>
            </button>

            {/* Toggle de Tema */}
            <ThemeToggle />

            {/* Perfil Mobile */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="p-1 rounded-lg hover:bg-bible-hover transition-all"
                  title="Menu do Perfil"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-bible-border shadow-sm flex items-center justify-center bg-bible-paper">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user text-bible-text-light text-xs"></i>
                    )}
                  </div>
                </button>
              ) : (
                <button
                  onClick={onOpenProfile}
                  className="w-7 h-7 rounded-lg text-bible-text hover:bg-bible-hover flex items-center justify-center transition-all"
                  title="Entrar"
                >
                  <i className="fas fa-user text-sm"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          ></div>
          <div className="fixed top-16 left-3 right-3 z-40 bg-layer-2 border border-bible-border rounded-xl shadow-2xl p-4 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-3">
              {/* Seletor de Livro */}
              <div>
                <label className="text-xs font-bold text-bible-text-light uppercase tracking-wider mb-1 block">Livro</label>
                <select
                  value={bibleRef.book}
                  onChange={(e) => { handleBookChange(e); }}
                  className="w-full bg-bible-card border border-bible-border rounded-lg px-3 py-2 text-sm font-bold text-bible-text focus:outline-none focus:border-bible-accent"
                >
                  {BIBLE_BOOKS.map((book) => (
                    <option key={book.name} value={book.name} className="bg-layer-2 text-bible-text">
                      {book.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linha com Capítulo e Versículo */}
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-bible-text-light uppercase tracking-wider mb-1 block">Capítulo</label>
                  <input
                    type="number"
                    value={bibleRef.chapter}
                    onChange={handleChapterChange}
                    min={1}
                    className="w-full bg-bible-card border border-bible-border rounded-lg px-3 py-2 text-sm font-bold text-bible-text focus:outline-none focus:border-bible-accent text-center"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-bible-text-light uppercase tracking-wider mb-1 block">Versículo</label>
                  <input
                    type="text"
                    value={verseInput}
                    onChange={(e) => setVerseInput(e.target.value)}
                    placeholder="-"
                    className="w-full bg-bible-card border border-bible-border rounded-lg px-3 py-2 text-sm font-bold text-bible-text focus:outline-none focus:border-bible-accent text-center"
                  />
                </div>
              </div>

              {/* Seletor de Tradução */}
              <div>
                <label className="text-xs font-bold text-bible-text-light uppercase tracking-wider mb-1 block">Tradução</label>
                <select
                  value={translation}
                  onChange={handleTranslationChange}
                  className="w-full bg-bible-card border border-bible-border rounded-lg px-3 py-2 text-sm font-bold text-bible-text focus:outline-none focus:border-bible-accent"
                >
                  {AVAILABLE_TRANSLATIONS.map((trans) => (
                    <option key={trans.id} value={trans.id} className="bg-layer-2 text-bible-text">
                      {trans.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barra de Busca Mobile */}
              <div>
                <label className="text-xs font-bold text-bible-text-light uppercase tracking-wider mb-1 block">Pesquisar</label>
                <form onSubmit={(e) => { handleSearchSubmit(e); setMobileNavOpen(false); }} className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-bible-text-light text-sm opacity-60"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('searchPlaceholder') || 'Pesquisar na Bíblia...'}
                    className="w-full bg-bible-card border border-bible-border rounded-lg pl-10 pr-3 py-2 text-sm text-bible-text focus:outline-none focus:border-bible-accent"
                  />
                </form>
              </div>

              {/* Botões de Ação */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => { handleGoToVerse(); setMobileNavOpen(false); }}
                  className="flex-1 bg-bible-accent text-bible-text px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-bible-accent-hover transition-all shadow-sm active:scale-95 border border-bible-border/30"
                >
                  <i className="fas fa-arrow-right mr-2"></i>
                  Ir para
                </button>
                <button
                  onClick={() => { onToggleCompare(); setMobileNavOpen(false); }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm border ${compareMode ? 'bg-bible-accent text-white border-bible-accent' : 'bg-bible-card text-bible-text border-bible-border hover:bg-bible-hover'}`}
                >
                  <i className="fas fa-columns"></i>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Profile Dropdown (reutiliza o estado profileMenuOpen) */}
      {profileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40"
            onClick={() => setProfileMenuOpen(false)}
          ></div>
          <div className="fixed top-16 right-3 z-50 w-56 bg-layer-2 border border-bible-border rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {user && (
              <>
                <div className="p-4 border-b border-bible-border bg-bible-secondary/30">
                  <p className="text-sm font-bold text-bible-text truncate">{user.name || user.email}</p>
                  <p className="text-[10px] text-bible-text-light truncate opacity-70">{user.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { onOpenProfile(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-bible-text hover:bg-bible-hover rounded-lg transition-colors text-left"
                  >
                    <i className="fas fa-user-circle w-5 text-bible-accent text-center"></i>
                    <span>{t('profile') || 'Meu Perfil'}</span>
                  </button>
                  <button
                    onClick={() => { setProfileMenuOpen(false); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-bible-text hover:bg-bible-hover rounded-lg transition-colors text-left"
                  >
                    <i className="fas fa-cog w-5 text-bible-text-light opacity-60 text-center"></i>
                    <span>Configurações</span>
                  </button>
                  <div className="h-px bg-bible-border my-1 mx-2"></div>
                  <button
                    onClick={() => { signOut(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <i className="fas fa-sign-out-alt w-5 text-center"></i>
                    <span>Sair</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
