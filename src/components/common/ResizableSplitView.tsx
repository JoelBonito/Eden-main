import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ResizableSplitViewProps {
    primaryContent: React.ReactNode;
    secondaryContent: React.ReactNode;
    defaultRatio?: number; // 0.5 = 50/50
    minRatio?: number; // 0.2
    maxRatio?: number; // 0.8
    orientation?: 'horizontal' | 'vertical' | 'auto';
    className?: string;
    onRatioChange?: (ratio: number) => void;
    storageKey?: string;
}

export const ResizableSplitView: React.FC<ResizableSplitViewProps> = ({
    primaryContent,
    secondaryContent,
    defaultRatio = 0.5,
    minRatio = 0.2,
    maxRatio = 0.8,
    orientation = 'auto',
    className = '',
    onRatioChange,
    storageKey
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ratio, setRatio] = useState(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) return parseFloat(saved);
        }
        return defaultRatio;
    });
    const [isResizing, setIsResizing] = useState(false);
    const [resolvedOrientation, setResolvedOrientation] = useState<'horizontal' | 'vertical'>('vertical');

    // Detect orientation
    useEffect(() => {
        if (orientation !== 'auto') {
            setResolvedOrientation(orientation);
            return;
        }

        const checkOrientation = () => {
            // Logic: 
            // Portrait Mode (Mobile/Tablet Portrait) -> Horizontal (Top/Bottom)
            // Landscape Mode (Desktop/Tablet Landscape) -> Vertical (Left/Right)

            const isPortrait = window.matchMedia('(orientation: portrait)').matches;
            const isSmallScreen = window.innerWidth < 1024;

            if (isPortrait || isSmallScreen) {
                setResolvedOrientation('horizontal');
            } else {
                setResolvedOrientation('vertical');
            }
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, [orientation]);

    // Handle Resize
    const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        if (storageKey) {
            localStorage.setItem(storageKey, ratio.toString());
        }
    }, [ratio, storageKey]);

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isResizing || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        let newRatio = ratio;

        if (resolvedOrientation === 'vertical') {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const relativeX = clientX - containerRect.left;
            newRatio = relativeX / containerRect.width;
        } else {
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const relativeY = clientY - containerRect.top;
            newRatio = relativeY / containerRect.height;
        }

        // Clamp
        newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio));

        setRatio(newRatio);
        onRatioChange?.(newRatio);
    }, [isResizing, minRatio, maxRatio, resolvedOrientation, onRatioChange, ratio]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    const flexDir = resolvedOrientation === 'vertical' ? 'flex-row' : 'flex-col';
    const sizeStyle = resolvedOrientation === 'vertical'
        ? { width: `${ratio * 100}%` }
        : { height: `${ratio * 100}%` };

    const dividerClass = resolvedOrientation === 'vertical'
        ? 'w-4 cursor-col-resize h-full border-l border-r border-bible-border/10'
        : 'h-4 cursor-row-resize w-full border-t border-b border-bible-border/10';

    return (
        <div
            ref={containerRef}
            className={`flex ${flexDir} w-full h-full overflow-hidden ${className}`}
        >
            {/* Primary Panel */}
            <div
                className="flex-shrink-0 relative overflow-hidden"
                style={sizeStyle}
            >
                {primaryContent}

                {/* Resize Overlay to prevent iframe/selection interference during drag */}
                {isResizing && <div className="absolute inset-0 z-50 bg-transparent" />}
            </div>

            {/* Divider Handle */}
            <div
                className={`${dividerClass} flex-shrink-0 bg-bible-border/30 hover:bg-bible-border/60 transition-colors z-20 flex items-center justify-center`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* Handle visual indicator (Traço Forte) */}
                <div className={`bg-bible-accent rounded-full shadow-sm ${resolvedOrientation === 'vertical' ? 'w-1.5 h-12' : 'h-1.5 w-12'}`} />
            </div>

            {/* Secondary Panel */}
            <div className="flex-1 min-w-0 min-h-0 relative overflow-hidden">
                {secondaryContent}
                {isResizing && <div className="absolute inset-0 z-50 bg-transparent" />}
            </div>
        </div>
    );
};
