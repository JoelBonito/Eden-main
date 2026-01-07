import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-bible-secondary text-bible-text',
    primary: 'bg-bible-accent/10 text-bible-accent',
    secondary: 'bg-bible-card border border-bible-border text-bible-text-light',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
};

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    size = 'md',
    icon,
    className = '',
    children
}) => {
    const baseStyles = 'inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded';

    return (
        <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
            {icon}
            {children}
        </span>
    );
};

export default Badge;
