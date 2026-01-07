import React, { useState, createContext, useContext } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    defaultTab: string;
    children: React.ReactNode;
    className?: string;
    onChange?: (tabId: string) => void;
}

interface TabListProps {
    children: React.ReactNode;
    className?: string;
}

interface TabProps {
    id: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
}

interface TabPanelProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

// Tabs Container
export const Tabs: React.FC<TabsProps> = ({ defaultTab, children, className = '', onChange }) => {
    const [activeTab, setActiveTabState] = useState(defaultTab);

    const setActiveTab = (id: string) => {
        setActiveTabState(id);
        onChange?.(id);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

// Tab List (header com as tabs)
export const TabList: React.FC<TabListProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`flex border-b border-bible-border bg-bible-card overflow-x-auto no-scrollbar ${className}`}
            role="tablist"
        >
            {children}
        </div>
    );
};

// Individual Tab Button
export const Tab: React.FC<TabProps> = ({ id, children, icon, disabled = false }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('Tab must be used within Tabs');

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === id;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            disabled={disabled}
            onClick={() => !disabled && setActiveTab(id)}
            className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
        border-b-2 -mb-px transition-all duration-200
        ${isActive
                    ? 'border-bible-accent text-bible-accent'
                    : 'border-transparent text-bible-text-light hover:text-bible-text hover:border-bible-hover'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {icon}
            {children}
        </button>
    );
};

// Tab Panel (content)
export const TabPanel: React.FC<TabPanelProps> = ({ id, children, className = '' }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabPanel must be used within Tabs');

    const { activeTab } = context;
    const isActive = activeTab === id;

    if (!isActive) return null;

    return (
        <div
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            className={`animate-in fade-in slide-in-from-bottom-2 duration-200 ${className}`}
        >
            {children}
        </div>
    );
};

export default Tabs;
