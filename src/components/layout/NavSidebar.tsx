import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { TabView } from '../../types';

interface NavSidebarProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
  onClose?: () => void;
  t: (key: string) => string;
}

// Mapeamento de TabView para rotas
const tabToRoute: Record<TabView, string> = {
  [TabView.READING]: '/',
  [TabView.INTERLINEAR]: '/interlinear',
  [TabView.STUDY_GUIDE]: '/study-guide',
  [TabView.THEOLOGY]: '/theology',
  [TabView.EXEGESIS]: '/exegesis',
  [TabView.DEVOTIONALS]: '/devotionals',
  [TabView.VISUALS]: '/visuals',
  [TabView.LOCATIONS]: '/locations',
  [TabView.LIBRARY]: '/library',
  [TabView.VISUAL_SUMMARY]: '/visual-summary',
  [TabView.THEMATIC_STUDY]: '/thematic-study'
};

export const NavSidebar: React.FC<NavSidebarProps> = ({ activeTab, onTabChange, onClose, t }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navItem = (tab: TabView, icon: string, label: string) => {
    const route = tabToRoute[tab];
    const isActive = activeTab === tab || location.pathname === route;

    return (
      <NavLink
        to={route}
        onClick={() => {
          onTabChange(tab);
          onClose?.(); // Close on mobile only
        }}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'space-x-3 px-3'} py-2 rounded-lg transition-all text-sm ${isActive ? 'bg-layer-3 text-bible-text font-bold shadow-md border border-bible-border/50' : 'text-bible-text font-medium hover:bg-layer-3/50'}`}
        title={isCollapsed ? label : ''}
      >
        <i className={`fas ${icon} w-5 text-center ${isActive ? 'text-bible-accent' : ''}`}></i>
        {!isCollapsed && <span>{label}</span>}
      </NavLink>
    );
  };

  const containerWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <div className={`${containerWidth} transition-all duration-300 bg-layer-2 border-r border-bible-border flex flex-col h-full shrink-0 z-30`}>
      {/* Header da Sidebar */}
      <div className="relative flex justify-center items-center pointer-events-auto border-b border-bible-border/20 py-1">
        <Link to="/" className={`flex flex-col items-center group ${isCollapsed ? 'scale-75' : ''} transition-transform`} onClick={onClose}>
          <img
            src="/eden-logo-v2.png"
            alt="ÉDEN Logo"
            className="h-28 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Toggle Collapse Button (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -bottom-3 right-0 translate-x-1/2 bg-layer-2 text-bible-text border border-bible-border rounded-full w-6 h-6 items-center justify-center hover:bg-bible-hover shadow-sm z-50 cursor-pointer"
        >
          <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'} text-[10px]`}></i>
        </button>

        {/* Close Button (Mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-2 right-2 text-bible-text-light hover:text-bible-text p-2"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      {/* Conteúdo Navegável */}
      <div className="flex-1 overflow-y-auto px-2 pt-6 pb-2 space-y-8 scrollbar-thin scrollbar-thumb-bible-border/50 pointer-events-auto">

        {/* Seção Principal */}
        <div className="space-y-2">
          {!isCollapsed && (
            <p className="px-3 text-xs font-bold text-bible-text-light uppercase tracking-wider opacity-70">
              Estudo
            </p>
          )}
          <nav className="space-y-1">
            {navItem(TabView.READING, 'fa-book-open', t('reading') || 'Leitura')}
            {navItem(TabView.INTERLINEAR, 'fa-language', t('interlinear') || 'Interlinear')}
            {navItem(TabView.STUDY_GUIDE, 'fa-list-check', t('study') || 'Estudo')}
            {navItem(TabView.THEOLOGY, 'fa-cross', t('theology') || 'Teologia')}
            {navItem(TabView.EXEGESIS, 'fa-scroll', t('exegesis') || 'Exegese')}
            {navItem(TabView.DEVOTIONALS, 'fa-praying-hands', t('devotionals') || 'Devocional')}
          </nav>
        </div>

        {/* Visual e Mapas */}
        <div className="space-y-2">
          {!isCollapsed && (
            <p className="px-3 text-xs font-bold text-bible-text-light uppercase tracking-wider opacity-70">
              Visual
            </p>
          )}
          <nav className="space-y-1">
            {navItem(TabView.VISUALS, 'fa-image', t('visuals') || 'Visual')}
            {navItem(TabView.LOCATIONS, 'fa-map-location-dot', t('maps') || 'Mapas')}
          </nav>
        </div>

        {/* Recursos */}
        <div className="space-y-2">
          {!isCollapsed && (
            <p className="px-3 text-xs font-bold text-bible-text-light uppercase tracking-wider opacity-70">
              Recursos
            </p>
          )}
          <nav className="space-y-1">
            {navItem(TabView.LIBRARY, 'fa-book-bookmark', t('library') || 'Biblioteca')}
          </nav>
        </div>
      </div>

      {/* Footer Powered By */}
      <div className={`p-4 border-t border-bible-border/20 bg-layer-2/50 backdrop-blur-sm pointer-events-auto transition-all ${isCollapsed ? 'opacity-0 scale-95 hidden' : 'opacity-100'}`}>
        <a
          href="https://www.linkedin.com/in/marcuspalucci"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center group transition-opacity hover:opacity-100 opacity-80"
        >
          <span className="text-[9px] uppercase tracking-widest text-bible-text-light mb-0 font-bold">Powered by</span>
          <img
            src="/mp-logo-v2.png"
            alt="Marcus Palucci AI"
            className="h-24 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        </a>
      </div>
    </div>
  );
};
