import React, { forwardRef } from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    inputSize?: InputSize;
    fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-4 py-3 text-base sm:text-lg'
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    inputSize = 'md',
    fullWidth = true,
    className = '',
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'bg-bible-card border rounded-lg text-bible-text outline-none transition-colors font-sans';
    const focusStyles = 'focus:border-bible-accent focus:ring-1 focus:ring-bible-accent/20';
    const errorStyles = error ? 'border-bible-error focus:border-bible-error focus:ring-bible-error/20' : 'border-bible-border';
    const iconPadding = leftIcon ? 'pl-10' : '';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bible-text-light">
                        {leftIcon}
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={`${baseStyles} ${focusStyles} ${errorStyles} ${sizeStyles[inputSize]} ${iconPadding} ${widthStyles} ${className}`}
                    {...props}
                />

                {rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bible-text-light">
                        {rightIcon}
                    </span>
                )}
            </div>

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

Input.displayName = 'Input';

export default Input;
