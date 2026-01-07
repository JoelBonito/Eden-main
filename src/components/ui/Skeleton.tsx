import React from 'react';

interface SkeletonProps {
    width?: string;
    height?: string;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    className?: string;
}

interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

interface SkeletonCardProps {
    hasImage?: boolean;
    hasTitle?: boolean;
    hasDescription?: boolean;
    hasFooter?: boolean;
    className?: string;
}

const roundedStyles: Record<'none' | 'sm' | 'md' | 'lg' | 'full', string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
};

// Base Skeleton
export const Skeleton: React.FC<SkeletonProps> = ({
    width = 'w-full',
    height = 'h-4',
    rounded = 'md',
    className = ''
}) => {
    return (
        <div
            className={`
        ${width} ${height} ${roundedStyles[rounded]}
        bg-bible-border animate-pulse
        ${className}
      `}
            aria-hidden="true"
        />
    );
};

// Skeleton for text content
export const SkeletonText: React.FC<SkeletonTextProps> = ({
    lines = 3,
    className = ''
}) => {
    return (
        <div className={`space-y-2 ${className}`} aria-hidden="true">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? 'w-3/4' : 'w-full'}
                    height="h-4"
                />
            ))}
        </div>
    );
};

// Skeleton for cards
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    hasImage = true,
    hasTitle = true,
    hasDescription = true,
    hasFooter = false,
    className = ''
}) => {
    return (
        <div
            className={`
        bg-bible-card border border-bible-border rounded-xl p-4 sm:p-5
        ${className}
      `}
            aria-hidden="true"
        >
            {hasImage && (
                <Skeleton
                    width="w-full"
                    height="h-40 sm:h-48"
                    rounded="lg"
                    className="mb-4"
                />
            )}

            {hasTitle && (
                <Skeleton width="w-3/4" height="h-6" className="mb-3" />
            )}

            {hasDescription && (
                <SkeletonText lines={2} className="mb-4" />
            )}

            {hasFooter && (
                <div className="flex gap-2 pt-4 border-t border-bible-border">
                    <Skeleton width="w-20" height="h-8" rounded="lg" />
                    <Skeleton width="w-20" height="h-8" rounded="lg" />
                </div>
            )}
        </div>
    );
};

// Skeleton for avatar
export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeStyles = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    return <Skeleton width={sizeStyles[size].split(' ')[0]} height={sizeStyles[size].split(' ')[1]} rounded="full" />;
};

// Skeleton for list items
export const SkeletonListItem: React.FC<{ hasAvatar?: boolean }> = ({ hasAvatar = true }) => {
    return (
        <div className="flex items-center gap-4 p-3" aria-hidden="true">
            {hasAvatar && <SkeletonAvatar size="md" />}
            <div className="flex-1 space-y-2">
                <Skeleton width="w-1/2" height="h-4" />
                <Skeleton width="w-3/4" height="h-3" />
            </div>
        </div>
    );
};

export default Skeleton;
