import React, { useState, useRef, useEffect } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: TooltipPosition;
    delay?: number;
    className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
};

const arrowStyles: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-bible-text border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-bible-text border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-bible-text border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-bible-text border-y-transparent border-l-transparent'
};

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 200,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}

            {isVisible && (
                <div
                    role="tooltip"
                    className={`
            absolute z-50 px-3 py-2 text-sm font-medium
            bg-bible-text text-bible-card rounded-lg shadow-lg
            whitespace-nowrap pointer-events-none
            animate-in fade-in zoom-in-95 duration-150
            ${positionStyles[position]}
            ${className}
          `}
                >
                    {content}
                    {/* Arrow */}
                    <div
                        className={`
              absolute w-0 h-0 border-4
              ${arrowStyles[position]}
            `}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
