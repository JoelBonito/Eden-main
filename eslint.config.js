import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-empty-interface': 'warn',
            'react-hooks/exhaustive-deps': 'off' // Ativar se quiser ser muito estrito
        },
    },
    {
        ignores: ['dist/**', 'node_modules/**', 'functions/**']
    }
);
