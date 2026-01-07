import React, { useEffect, useState } from 'react';

export const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Verificar preferência salva ou do sistema
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        setIsDark(shouldBeDark);

        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-bible-hover transition-colors"
            title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            aria-label="Alternar tema"
        >
            {isDark ? (
                <i className="fas fa-sun text-bible-gold text-lg"></i>
            ) : (
                <i className="fas fa-moon text-bible-text-light text-lg"></i>
            )}
        </button>
    );
};
