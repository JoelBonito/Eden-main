import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-bible-accent text-white hover:bg-bible-accent-hover shadow-md',
    secondary: 'bg-bible-card border border-bible-border text-bible-text hover:bg-bible-hover',
    ghost: 'bg-transparent text-bible-text hover:bg-bible-hover',
    danger: 'bg-bible-error text-white hover:opacity-90',
    success: 'bg-green-600 text-white hover:bg-green-700'
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 sm:px-6 py-2 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-3 text-base sm:text-lg'
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <i className="fas fa-spinner fa-spin" />
            ) : leftIcon ? (
                leftIcon
            ) : null}

            {children}

            {!loading && rightIcon}
        </button>
    );
};

export default Button;
