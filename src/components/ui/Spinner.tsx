import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'secondary' | 'white';

interface SpinnerProps {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    label?: string;
    className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
};

const variantStyles: Record<SpinnerVariant, string> = {
    primary: 'text-bible-accent',
    secondary: 'text-bible-text-light',
    white: 'text-white'
};

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    variant = 'primary',
    label,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <i className={`fas fa-circle-notch fa-spin ${sizeStyles[size]} ${variantStyles[variant]}`} />
            {label && (
                <p className="mt-3 text-sm font-bold uppercase tracking-widest text-bible-text-light animate-pulse">
                    {label}
                </p>
            )}
        </div>
    );
};

// Loading Overlay - Full screen loading state
interface LoadingOverlayProps {
    isLoading: boolean;
    label?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    label = 'Carregando...'
}) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bible-paper/80 backdrop-blur-sm">
            <Spinner size="xl" label={label} />
        </div>
    );
};

// Inline Loading - For buttons and small areas
export const InlineSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
    return <i className={`fas fa-spinner fa-spin ${className}`} />;
};

export default Spinner;
