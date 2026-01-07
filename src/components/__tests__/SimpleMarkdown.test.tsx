import { render, screen, fireEvent } from '@testing-library/react';
import SimpleMarkdown from '../SimpleMarkdown';
import { describe, it, expect, vi } from 'vitest';

describe('SimpleMarkdown', () => {
    it('should render nothing if text is empty', () => {
        const { container } = render(<SimpleMarkdown text="" />);
        expect(container.firstChild).toBeNull();
    });

    it('should render a warning block if text starts with ⚠️', () => {
        render(<SimpleMarkdown text="⚠️ Teste de Aviso" />);
        expect(screen.getByText('Teste de Aviso')).toBeInTheDocument();
        expect(screen.getByText('Atenção')).toBeInTheDocument();
    });

    it('should render headers correctly', () => {
        render(<SimpleMarkdown text={`# Título\n## Subtítulo`} />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Título');
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Subtítulo');
    });

    it('should render bold text as bible accent', () => {
        render(<SimpleMarkdown text="**1** Versículo um" />);
        expect(screen.getByText('1')).toHaveClass('text-bible-accent');
    });

    it('should handle parallel references', () => {
        const onParallelClick = vi.fn();
        render(<SimpleMarkdown text="(Mt 1:1; Mc 1:1)" onParallelClick={onParallelClick} />);

        expect(screen.getByText('Paralelos:')).toBeInTheDocument();
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);

        fireEvent.click(buttons[0]);
        expect(onParallelClick).toHaveBeenCalledWith('Mt 1:1');
    });

    it('should handle Strong clicks', () => {
        const onStrongClick = vi.fn();
        render(<SimpleMarkdown text="Palavra <H1234>" onStrongClick={onStrongClick} />);

        const word = screen.getByText('Palavra');
        expect(word).toBeInTheDocument();

        fireEvent.click(word);
        expect(onStrongClick).toHaveBeenCalledWith('Palavra', 'H1234');
    });
});
