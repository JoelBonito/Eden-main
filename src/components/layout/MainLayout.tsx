import React, { ReactNode, useState } from 'react';
import { NavSidebar } from './NavSidebar';
import { Header } from './Header';
import { TabView } from '../../types';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
  t: (key: string) => string;
  onOpenProfile: () => void;
  // Search props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  loadingSearch: boolean;
  // Panel props
  onOpenRightPanel: () => void;
  isRightPanelOpen: boolean;
  // Compare props
  compareMode: boolean;
  onToggleCompare: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
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
  const [sidebarVisible, setSidebarVisible] = useState(false); // Mobile toggle

  return (
    <div className="flex h-screen w-full bg-layer-2 text-bible-text font-sans overflow-hidden selection:bg-bible-selection selection:text-bible-text">
      {/* Mobile/Tablet Sidebar Overlay */}
      {sidebarVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}

      {/* Sidebar (Mobile/Tablet absolute, Desktop relative) */}
      <div
        className={`
                  absolute inset-y-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out 
                  lg:relative lg:transform-none lg:flex
                  ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
              `}
      >
        <NavSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            onTabChange(tab);
            setSidebarVisible(false);
          }}
          onClose={() => setSidebarVisible(false)}
          t={t}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          t={t}
          onOpenProfile={onOpenProfile}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          loadingSearch={loadingSearch}
          onOpenRightPanel={onOpenRightPanel}
          isRightPanelOpen={isRightPanelOpen}
          compareMode={compareMode}
          onToggleCompare={onToggleCompare}
        />

        <main className="flex-1 flex overflow-hidden relative w-full bg-layer-1 pt-20 px-4 pb-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          {children}
        </main>
      </div>
    </div>
  );
};
