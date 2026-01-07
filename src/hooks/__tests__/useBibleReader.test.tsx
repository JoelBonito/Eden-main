import { renderHook, waitFor } from '@testing-library/react';
import { useBibleReader } from '../useBibleReader';
import { describe, it, expect, vi } from 'vitest';
import { getBibleContent } from '../../services/geminiService';
import { useBible } from '../../contexts/BibleContext';
import { useAuth } from '../../contexts/AuthContext';

vi.mock('../../services/geminiService', () => ({
    getBibleContent: vi.fn(),
}));

vi.mock('../../contexts/BibleContext', () => ({
    useBible: vi.fn(),
}));

vi.mock('../../contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('useBibleReader', () => {
    it('should fetch bible content on mount', async () => {
        const mockBibleRef = { book: 'Gênesis', chapter: 1, translation: 'NVI' };
        vi.mocked(useBible).mockReturnValue({
            bibleRef: mockBibleRef,
            compareMode: false,
            secondaryBibleRef: null,
        } as unknown as ReturnType<typeof useBible>);
        vi.mocked(useAuth).mockReturnValue({ user: { language: 'pt' } } as unknown as ReturnType<typeof useAuth>);
        vi.mocked(getBibleContent).mockResolvedValue('No princípio...');

        const { result } = renderHook(() => useBibleReader());

        expect(result.current.loadingText).toBe(true);

        await waitFor(() => {
            expect(result.current.bibleText).toBe('No princípio...');
        });

        expect(result.current.loadingText).toBe(false);
        expect(getBibleContent).toHaveBeenCalledWith('Gênesis', 1, 'NVI', 'pt');
    });

    it('should fetch secondary content when compareMode is true', async () => {
        const mockBibleRef = { book: 'Gênesis', chapter: 1, translation: 'NVI' };
        const mockSecondaryRef = { book: 'Gênesis', chapter: 1, translation: 'ARA' };

        vi.mocked(useBible).mockReturnValue({
            bibleRef: mockBibleRef,
            compareMode: true,
            secondaryBibleRef: mockSecondaryRef,
        } as unknown as ReturnType<typeof useBible>);
        vi.mocked(useAuth).mockReturnValue({ user: { language: 'pt' } } as unknown as ReturnType<typeof useAuth>);
        vi.mocked(getBibleContent)
            .mockResolvedValueOnce('No princípio...')
            .mockResolvedValueOnce('No princípio (ARA)...');

        const { result } = renderHook(() => useBibleReader());

        await waitFor(() => {
            expect(result.current.bibleText).toBe('No princípio...');
            expect(result.current.secondaryBibleText).toBe('No princípio (ARA)...');
        });
    });

    it('should handle errors', async () => {
        vi.mocked(useBible).mockReturnValue({
            bibleRef: { book: 'X', chapter: 1, translation: 'Y' },
            compareMode: false,
        } as unknown as ReturnType<typeof useBible>);
        vi.mocked(useAuth).mockReturnValue({ user: { language: 'pt' } } as unknown as ReturnType<typeof useAuth>);
        vi.mocked(getBibleContent).mockRejectedValue(new Error('Network Error'));

        const { result } = renderHook(() => useBibleReader());

        await waitFor(() => {
            expect(result.current.error).toBe('Failed to load text');
            expect(result.current.bibleText).toBe('Erro ao carregar texto.');
        });
    });
});
