import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Card, CardHeader, CardFooter } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Tabs, TabList, Tab, TabPanel } from '../components/ui/Tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion';
import { Tooltip } from '../components/ui/Tooltip';
import { Skeleton, SkeletonText, SkeletonCard } from '../components/ui/Skeleton';
import { useToastUI } from '../components/ui/Toast';

/**
 * Página de demonstração da biblioteca de componentes UI v2.0
 * Acesse via: /ui-demo (adicionar rota no App.tsx)
 */
export const UIDemo: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToastUI();

    const handleLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-bible-paper p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-bible-text mb-2">
                        🎨 Eden UI Library v2.0
                    </h1>
                    <p className="text-bible-text-light">
                        Biblioteca de componentes reutilizáveis • {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </div>

                {/* Buttons Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-mouse-pointer mr-2 text-bible-accent" />
                        Buttons
                    </h2>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button>
                            <Button variant="success">Success</Button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button loading onClick={handleLoadingDemo}>
                                {loading ? 'Carregando...' : 'Click to Load'}
                            </Button>
                            <Button disabled>Disabled</Button>
                            <Button leftIcon={<i className="fas fa-plus" />}>Com Ícone</Button>
                        </div>
                    </div>
                </section>

                {/* Inputs Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-keyboard mr-2 text-bible-accent" />
                        Inputs
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Nome" placeholder="Digite seu nome..." />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="seu@email.com"
                            leftIcon={<i className="fas fa-envelope" />}
                        />
                        <Input label="Com Erro" error="Este campo é obrigatório" />
                        <Input label="Com Dica" hint="Mínimo 8 caracteres" type="password" />
                    </div>
                </section>

                {/* Textarea & Select */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-edit mr-2 text-bible-accent" />
                        Textarea & Select
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Textarea label="Comentário" placeholder="Digite sua mensagem..." rows={4} />
                        <Select
                            label="Versão Bíblica"
                            placeholder="Selecione..."
                            options={[
                                { value: 'ara', label: 'Almeida Revista' },
                                { value: 'nvi', label: 'Nova Versão Internacional' },
                                { value: 'acf', label: 'Almeida Corrigida Fiel' }
                            ]}
                        />
                    </div>
                </section>

                {/* Cards Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-clone mr-2 text-bible-accent" />
                        Cards
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card variant="default">
                            <CardHeader
                                title="Card Default"
                                subtitle="Com header e footer"
                                icon={<i className="fas fa-book text-xl" />}
                            />
                            <p className="text-bible-text-light text-sm">
                                Este é um card padrão com header e conteúdo.
                            </p>
                            <CardFooter>
                                <Button size="sm" variant="secondary">Ação</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="elevated" hover>
                            <CardHeader title="Card Elevated" subtitle="Com hover effect" />
                            <p className="text-bible-text-light text-sm">
                                Card com sombra elevada e efeito hover.
                            </p>
                        </Card>

                        <Card variant="outlined">
                            <CardHeader title="Card Outlined" />
                            <p className="text-bible-text-light text-sm">
                                Card apenas com borda, sem fundo.
                            </p>
                        </Card>
                    </div>
                </section>

                {/* Tabs Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-folder mr-2 text-bible-accent" />
                        Tabs
                    </h2>

                    <Card padding="none">
                        <Tabs defaultTab="tab1">
                            <TabList>
                                <Tab id="tab1" icon={<i className="fas fa-home" />}>Home</Tab>
                                <Tab id="tab2" icon={<i className="fas fa-book" />}>Leitura</Tab>
                                <Tab id="tab3" icon={<i className="fas fa-cog" />}>Configurações</Tab>
                                <Tab id="tab4" disabled>Desabilitada</Tab>
                            </TabList>

                            <TabPanel id="tab1" className="p-4">
                                <h3 className="font-bold text-bible-text mb-2">Bem-vindo!</h3>
                                <p className="text-bible-text-light">Este é o conteúdo da primeira tab.</p>
                            </TabPanel>

                            <TabPanel id="tab2" className="p-4">
                                <h3 className="font-bold text-bible-text mb-2">Leitura Bíblica</h3>
                                <p className="text-bible-text-light">Contenúdo sobre leitura aqui.</p>
                            </TabPanel>

                            <TabPanel id="tab3" className="p-4">
                                <h3 className="font-bold text-bible-text mb-2">Configurações</h3>
                                <p className="text-bible-text-light">Opções de configuração.</p>
                            </TabPanel>
                        </Tabs>
                    </Card>
                </section>

                {/* Accordion Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-list mr-2 text-bible-accent" />
                        Accordion
                    </h2>

                    <Accordion defaultOpen={['item1']}>
                        <AccordionItem id="item1">
                            <AccordionTrigger icon={<i className="fas fa-question-circle text-bible-accent" />}>
                                O que é o Eden?
                            </AccordionTrigger>
                            <AccordionContent>
                                Eden é uma aplicação para estudo bíblico com recursos avançados de IA,
                                incluindo exegese, análise interlinear e devocionais personalizados.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem id="item2">
                            <AccordionTrigger icon={<i className="fas fa-cogs text-bible-accent" />}>
                                Como funciona?
                            </AccordionTrigger>
                            <AccordionContent>
                                Utilizamos modelos de IA Gemini para fornecer análises profundas
                                e contextualizadas dos textos bíblicos.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem id="item3">
                            <AccordionTrigger icon={<i className="fas fa-lock text-bible-accent" />}>
                                É seguro?
                            </AccordionTrigger>
                            <AccordionContent>
                                Sim! Utilizamos Firebase com regras de segurança robustas
                                e autenticação OAuth2.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Tooltip Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-comment mr-2 text-bible-accent" />
                        Tooltips
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <Tooltip content="Tooltip no topo" position="top">
                            <Button variant="secondary">Hover (Top)</Button>
                        </Tooltip>

                        <Tooltip content="Tooltip embaixo" position="bottom">
                            <Button variant="secondary">Hover (Bottom)</Button>
                        </Tooltip>

                        <Tooltip content="Tooltip à esquerda" position="left">
                            <Button variant="secondary">Hover (Left)</Button>
                        </Tooltip>

                        <Tooltip content="Tooltip à direita" position="right">
                            <Button variant="secondary">Hover (Right)</Button>
                        </Tooltip>
                    </div>
                </section>

                {/* Toast Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-bell mr-2 text-bible-accent" />
                        Toast Notifications
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="success" onClick={() => addToast('Operação realizada com sucesso!', 'success')}>
                            Toast Success
                        </Button>
                        <Button variant="danger" onClick={() => addToast('Algo deu errado!', 'error')}>
                            Toast Error
                        </Button>
                        <Button variant="secondary" onClick={() => addToast('Atenção: verifique os dados', 'warning')}>
                            Toast Warning
                        </Button>
                        <Button variant="ghost" onClick={() => addToast('Dica: use atalhos de teclado', 'info')}>
                            Toast Info
                        </Button>
                    </div>
                </section>

                {/* Skeleton Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-spinner mr-2 text-bible-accent" />
                        Skeleton Loaders
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SkeletonCard hasImage hasTitle hasDescription />
                        <SkeletonCard hasImage={false} hasTitle hasDescription hasFooter />
                        <Card>
                            <CardHeader title="Skeleton Text" />
                            <SkeletonText lines={4} />
                        </Card>
                    </div>
                </section>

                {/* Badges Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-tag mr-2 text-bible-accent" />
                        Badges
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="danger">Danger</Badge>
                        <Badge variant="info">Info</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="info" icon={<i className="fas fa-book" />}>Livro</Badge>
                        <Badge variant="warning" icon={<i className="fas fa-file" />}>Apostila</Badge>
                        <Badge variant="primary" icon={<i className="fas fa-video" />}>Vídeo</Badge>
                    </div>
                </section>

                {/* Spinner Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-sync mr-2 text-bible-accent" />
                        Spinners
                    </h2>

                    <div className="flex flex-wrap items-end gap-6">
                        <div className="text-center">
                            <Spinner size="sm" />
                            <p className="text-xs mt-2 text-bible-text-light">Small</p>
                        </div>
                        <div className="text-center">
                            <Spinner size="md" />
                            <p className="text-xs mt-2 text-bible-text-light">Medium</p>
                        </div>
                        <div className="text-center">
                            <Spinner size="lg" />
                            <p className="text-xs mt-2 text-bible-text-light">Large</p>
                        </div>
                        <div className="text-center">
                            <Spinner size="xl" label="Carregando" />
                        </div>
                    </div>
                </section>

                {/* Modal Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-bible-text border-b border-bible-border pb-2">
                        <i className="fas fa-window-restore mr-2 text-bible-accent" />
                        Modal
                    </h2>

                    <Button onClick={() => setModalOpen(true)}>
                        Abrir Modal
                    </Button>

                    <Modal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title="Exemplo de Modal"
                        description="Este é um modal de demonstração"
                        footer={
                            <div className="flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={() => { setModalOpen(false); addToast('Modal confirmado!', 'success'); }}>
                                    Confirmar
                                </Button>
                            </div>
                        }
                    >
                        <p className="text-bible-text mb-4">
                            Este é o conteúdo do modal. Você pode colocar qualquer coisa aqui.
                        </p>
                        <Input label="Campo de exemplo" placeholder="Digite algo..." />
                    </Modal>
                </section>

                {/* Footer */}
                <footer className="text-center py-8 border-t border-bible-border">
                    <p className="text-bible-text-light text-sm">
                        🎨 Eden UI Library v2.0 • {new Date().getFullYear()} • 13 Componentes • Dark Mode Ready
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default UIDemo;
