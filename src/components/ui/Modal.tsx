import React, { useEffect, useCallback } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: ModalSize;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    children,
    footer
}) => {
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
            onClose();
        }
    }, [closeOnEscape, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className={`relative w-full ${sizeStyles[size]} bg-bible-card border border-bible-border rounded-2xl shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col`}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-4 sm:p-6 border-b border-bible-border">
                        <div>
                            {title && (
                                <h2
                                    id="modal-title"
                                    className="text-lg sm:text-xl font-bold text-bible-text font-serif"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="mt-1 text-sm text-bible-text-light">
                                    {description}
                                </p>
                            )}
                        </div>

                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 -mt-2 text-bible-text-light hover:text-bible-text hover:bg-bible-hover rounded-lg transition-colors"
                                aria-label="Fechar modal"
                            >
                                <i className="fas fa-times text-lg" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 sm:p-6 border-t border-bible-border bg-bible-secondary/50 rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
