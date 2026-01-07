import React from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';

interface CardProps {
    variant?: CardVariant;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
    separator?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
    default: 'bg-bible-card border border-bible-border shadow-sm',
    elevated: 'bg-bible-card border border-bible-border shadow-lg',
    outlined: 'bg-transparent border border-bible-border',
    ghost: 'bg-bible-secondary border-none'
};

const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', string> = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6 lg:p-8'
};

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    hover = false,
    className = '',
    children,
    onClick
}) => {
    const baseStyles = 'rounded-xl transition-all duration-200';
    const hoverStyles = hover ? 'hover:shadow-md hover:border-bible-accent cursor-pointer' : '';
    const clickableStyles = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subtitle,
    action,
    icon,
    className = ''
}) => {
    return (
        <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="flex-shrink-0 text-bible-accent">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="font-bold text-bible-text text-lg">{title}</h3>
                    {subtitle && (
                        <p className="text-sm text-bible-text-light mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};

export const CardFooter: React.FC<CardFooterProps> = ({
    children,
    className = '',
    separator = true
}) => {
    return (
        <div className={`mt-4 ${separator ? 'pt-4 border-t border-bible-border' : ''} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
