import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastStyles: Record<ToastType, { bg: string; icon: string; border: string }> = {
    success: {
        bg: 'bg-green-50',
        border: 'border-green-500',
        icon: 'fas fa-check-circle text-green-500'
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-bible-error',
        icon: 'fas fa-exclamation-circle text-bible-error'
    },
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-500',
        icon: 'fas fa-exclamation-triangle text-yellow-500'
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        icon: 'fas fa-info-circle text-blue-500'
    }
};

// Toast Item Component
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const styles = toastStyles[toast.type];

    return (
        <div
            className={`
        flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg
        ${styles.bg} ${styles.border}
        animate-in slide-in-from-right fade-in duration-300
      `}
            role="alert"
        >
            <i className={`${styles.icon} text-lg flex-shrink-0`} />
            <p className="flex-1 text-sm font-medium text-bible-text">{toast.message}</p>
            <button
                onClick={onClose}
                className="p-1 text-bible-text-light hover:text-bible-text transition-colors"
                aria-label="Fechar notificação"
            >
                <i className="fas fa-times" />
            </button>
        </div>
    );
};

// Toast Container
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
    toasts,
    removeToast
}) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
                </div>
            ))}
        </div>
    );
};

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        setToasts((prev) => [...prev, { id, message, type, duration }]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToastUI = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastUI must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
