import React, { forwardRef } from 'react';

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    options: SelectOption[];
    placeholder?: string;
    selectSize?: SelectSize;
    fullWidth?: boolean;
}

const sizeStyles: Record<SelectSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-4 py-3 text-base sm:text-lg'
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    hint,
    options,
    placeholder,
    selectSize = 'md',
    fullWidth = true,
    className = '',
    id,
    ...props
}, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'bg-bible-card border rounded-lg text-bible-text outline-none transition-colors appearance-none cursor-pointer';
    const focusStyles = 'focus:border-bible-accent focus:ring-1 focus:ring-bible-accent/20';
    const errorStyles = error ? 'border-bible-error focus:border-bible-error focus:ring-bible-error/20' : 'border-bible-border';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    className={`${baseStyles} ${focusStyles} ${errorStyles} ${sizeStyles[selectSize]} ${widthStyles} pr-10 ${className}`}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown Arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bible-text-light">
                    <i className="fas fa-chevron-down text-sm" />
                </div>
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

Select.displayName = 'Select';

export default Select;
