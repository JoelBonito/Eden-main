import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    fullWidth?: boolean;
}

const resizeStyles: Record<'none' | 'vertical' | 'horizontal' | 'both', string> = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
    error,
    hint,
    resize = 'vertical',
    fullWidth = true,
    className = '',
    rows = 4,
    id,
    ...props
}, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'bg-bible-card border rounded-lg p-3 sm:p-4 text-bible-text outline-none transition-colors font-serif leading-relaxed';
    const focusStyles = 'focus:border-bible-accent focus:ring-1 focus:ring-bible-accent/20';
    const errorStyles = error ? 'border-bible-error focus:border-bible-error focus:ring-bible-error/20' : 'border-bible-border';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-2"
                >
                    {label}
                </label>
            )}

            <textarea
                ref={ref}
                id={inputId}
                rows={rows}
                className={`${baseStyles} ${focusStyles} ${errorStyles} ${resizeStyles[resize]} ${widthStyles} ${className}`}
                {...props}
            />

            {error && (
                <p className="mt-1 text-xs text-bible-error font-medium">
                    <i className="fas fa-exclamation-circle mr-1" />
                    {error}
                </p>
            )}

            {hint && !error && (
                <p className="mt-1 text-xs text-bible-text-light">
                    {hint}
                </p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
