import React, { useState, createContext, useContext } from 'react';

interface AccordionContextType {
    openItems: string[];
    toggleItem: (id: string) => void;
    allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
    children: React.ReactNode;
    allowMultiple?: boolean;
    defaultOpen?: string[];
    className?: string;
}

interface AccordionItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

interface AccordionTriggerProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

interface AccordionContentProps {
    children: React.ReactNode;
    className?: string;
}

// Item Context
interface ItemContextType {
    itemId: string;
    isOpen: boolean;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

// Accordion Container
export const Accordion: React.FC<AccordionProps> = ({
    children,
    allowMultiple = false,
    defaultOpen = [],
    className = ''
}) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (id: string) => {
        setOpenItems((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            if (allowMultiple) {
                return [...prev, id];
            }
            return [id];
        });
    };

    return (
        <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
            <div className={`space-y-2 ${className}`}>{children}</div>
        </AccordionContext.Provider>
    );
};

// Accordion Item
export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, className = '' }) => {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionItem must be used within Accordion');

    const isOpen = context.openItems.includes(id);

    return (
        <ItemContext.Provider value={{ itemId: id, isOpen }}>
            <div
                className={`
          border border-bible-border rounded-lg overflow-hidden
          ${isOpen ? 'bg-bible-card shadow-sm' : 'bg-bible-secondary/50'}
          ${className}
        `}
            >
                {children}
            </div>
        </ItemContext.Provider>
    );
};

// Accordion Trigger (header)
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
    children,
    icon,
    className = ''
}) => {
    const accordionContext = useContext(AccordionContext);
    const itemContext = useContext(ItemContext);

    if (!accordionContext || !itemContext) {
        throw new Error('AccordionTrigger must be used within AccordionItem');
    }

    const { toggleItem } = accordionContext;
    const { itemId, isOpen } = itemContext;

    return (
        <button
            onClick={() => toggleItem(itemId)}
            className={`
        w-full flex items-center justify-between p-4 text-left
        text-bible-text font-medium hover:bg-bible-hover transition-colors
        ${className}
      `}
            aria-expanded={isOpen}
            aria-controls={`accordion-content-${itemId}`}
        >
            <div className="flex items-center gap-3">
                {icon}
                {children}
            </div>
            <i
                className={`
          fas fa-chevron-down text-bible-text-light text-sm
          transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}
        `}
            />
        </button>
    );
};

// Accordion Content
export const AccordionContent: React.FC<AccordionContentProps> = ({
    children,
    className = ''
}) => {
    const itemContext = useContext(ItemContext);
    if (!itemContext) throw new Error('AccordionContent must be used within AccordionItem');

    const { itemId, isOpen } = itemContext;

    if (!isOpen) return null;

    return (
        <div
            id={`accordion-content-${itemId}`}
            className={`
        px-4 pb-4 text-bible-text-light
        animate-in slide-in-from-top-2 fade-in duration-200
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Accordion;
