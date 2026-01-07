import React from 'react';

/**
 * Página de teste para validar Dark Mode
 * Acesse via: /test-dark-mode (adicionar rota no App.tsx)
 */
export const DarkModeTest: React.FC = () => {
    return (
        <div className="min-h-screen bg-bible-paper p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-serif font-bold text-bible-text mb-2">
                    🎨 Teste de Dark Mode
                </h1>
                <p className="text-bible-text-light">
                    Use o botão de tema no header para alternar entre Light e Dark Mode
                </p>

                {/* Teste de Cores */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text">Cores do Design System</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-bible-card border border-bible-border p-4 rounded-lg">
                            <div className="font-bold text-bible-text">bible-card</div>
                            <div className="text-bible-text-light text-sm">Fundo de cards</div>
                        </div>

                        <div className="bg-bible-secondary border border-bible-border p-4 rounded-lg">
                            <div className="font-bold text-bible-text">bible-secondary</div>
                            <div className="text-bible-text-light text-sm">Fundo secundário</div>
                        </div>

                        <div className="bg-bible-hover border border-bible-border p-4 rounded-lg">
                            <div className="font-bold text-bible-text">bible-hover</div>
                            <div className="text-bible-text-light text-sm">Estado hover</div>
                        </div>

                        <div className="bg-bible-accent border border-bible-border p-4 rounded-lg">
                            <div className="font-bold text-white">bible-accent</div>
                            <div className="text-white text-sm">Cor de destaque</div>
                        </div>

                        <div className="bg-bible-accent-hover border border-bible-border p-4 rounded-lg">
                            <div className="font-bold text-white">bible-accent-hover</div>
                            <div className="text-white text-sm">Hover do destaque</div>
                        </div>

                        <div className="bg-bible-gold border border-bible-border p-4 rounded-lg">
                            <div className="font-bold text-white">bible-gold</div>
                            <div className="text-white text-sm">Dourado</div>
                        </div>
                    </div>
                </section>

                {/* Teste de Tipografia */}
                <section className="bg-bible-card border border-bible-border rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text">Tipografia</h2>

                    <div className="space-y-2">
                        <p className="text-bible-text font-serif text-lg">
                            Texto principal (Crimson Text) - bible-text
                        </p>
                        <p className="text-bible-text-light font-sans">
                            Texto secundário (Lato) - bible-text-light
                        </p>
                        <p className="text-bible-accent font-bold">
                            Texto de destaque - bible-accent
                        </p>
                    </div>
                </section>

                {/* Teste de Componentes */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text">Componentes</h2>

                    {/* Botões */}
                    <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-bible-accent text-white rounded-lg hover:bg-bible-accent-hover transition-colors">
                            Botão Primary
                        </button>
                        <button className="px-4 py-2 bg-bible-card border border-bible-border text-bible-text rounded-lg hover:bg-bible-hover transition-colors">
                            Botão Secondary
                        </button>
                        <button className="px-4 py-2 bg-bible-error text-white rounded-lg hover:opacity-90 transition-opacity">
                            Botão Danger
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Input de texto..."
                            className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent transition-colors"
                        />
                        <textarea
                            placeholder="Textarea..."
                            className="w-full bg-bible-card border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent transition-colors resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-bible-card border border-bible-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-bible-text mb-2">Card de Exemplo</h3>
                            <p className="text-bible-text-light text-sm">
                                Este é um card de exemplo para testar o design system em ambos os modos.
                            </p>
                        </div>

                        <div className="bg-bible-secondary border border-bible-border rounded-lg p-4">
                            <h3 className="font-bold text-bible-text mb-2">Card Secundário</h3>
                            <p className="text-bible-text-light text-sm">
                                Usando fundo secundário para contraste.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Checklist de Validação */}
                <section className="bg-bible-accent/10 border border-bible-accent rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-bible-text mb-4">✅ Checklist de Validação</h2>
                    <ul className="space-y-2 text-bible-text">
                        <li>✅ Todos os textos estão legíveis em ambos os modos</li>
                        <li>✅ Contraste adequado (WCAG AAA: 7:1)</li>
                        <li>✅ Bordas visíveis em ambos os modos</li>
                        <li>✅ Botões com estados hover claros</li>
                        <li>✅ Inputs com foco visível</li>
                        <li>✅ Cards com sombras apropriadas</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};
