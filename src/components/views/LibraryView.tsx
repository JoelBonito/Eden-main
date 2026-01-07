import React, { useState } from 'react';
import { LibraryResource } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { logger } from '../../utils/logger';

interface LibraryViewProps {
  resources: LibraryResource[];
  loading: boolean;
  uploading: boolean;
  isAdmin: boolean;
  onDelete: (id: string, fileUrl?: string) => void;
  onUpload: (
    file: File | null,
    textFile: File | null,
    textContent: string,
    meta: { title: string; description: string; type: LibraryResource['type'] }
  ) => Promise<void>;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  resources,
  loading,
  uploading,
  isAdmin,
  onDelete,
  onUpload
}) => {
  const { t } = useLanguage();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTextFile, setUploadTextFile] = useState<File | null>(null);
  const [uploadTextContent, setUploadTextContent] = useState<string>('');
  const [uploadMeta, setUploadMeta] = useState({
    title: '',
    description: '',
    type: 'book' as LibraryResource['type']
  });

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadTextFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadTextContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpload(uploadFile, uploadTextFile, uploadTextContent, uploadMeta);
      setShowUploadModal(false);
      // Reset form
      setUploadFile(null);
      setUploadTextFile(null);
      setUploadTextContent('');
      setUploadMeta({ title: '', description: '', type: 'book' });
    } catch (e) {
      logger.error(e);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-serif text-bible-text">Biblioteca de Estudos</h2>
        {isAdmin && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-bible-accent text-white px-4 py-2 rounded shadow hover:bg-bible-accent-hover transition-colors text-sm font-bold"
          >
            <i className="fas fa-plus mr-2"></i> Adicionar Recurso
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-70">
          <i className="fas fa-circle-notch fa-spin text-4xl text-bible-accent mb-4"></i>
          <p className="text-sm font-bold uppercase tracking-widest">{t('loading')}</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <i className="fas fa-book text-6xl mb-4 text-bible-border"></i>
          <p>Nenhum recurso encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-bible-card rounded-xl border border-bible-border shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow relative group"
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${resource.type === 'book' ? 'bg-blue-100 text-blue-700' : resource.type === 'handout' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}
                >
                  {resource.type}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(resource.id, resource.fileUrl)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
              <h3 className="font-bold text-bible-text mb-2 line-clamp-2 min-h-[48px]">
                {resource.title}
              </h3>
              <p className="text-sm text-bible-text-light mb-4 line-clamp-3 min-h-[60px]">
                {resource.description}
              </p>

              <div className="flex gap-2 mt-auto">
                {resource.fileUrl && (
                  <button
                    onClick={() => handleDownload(resource.fileUrl, resource.fileName)}
                    className="flex-1 py-2 border border-bible-border rounded text-bible-text text-sm font-bold hover:bg-bible-secondary transition-colors"
                  >
                    <i className="fas fa-download mr-1"></i> Baixar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-bible-card w-full max-w-lg rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Adicionar Recurso</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUploadInternal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Título</label>
                <input
                  className="w-full border p-2 rounded"
                  value={uploadMeta.title}
                  onChange={(e) => setUploadMeta({ ...uploadMeta, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Descrição</label>
                <input
                  className="w-full border p-2 rounded"
                  value={uploadMeta.description}
                  onChange={(e) => setUploadMeta({ ...uploadMeta, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Tipo</label>
                <select
                  className="w-full border p-2 rounded"
                  value={uploadMeta.type}
                  onChange={(e) =>
                    setUploadMeta({
                      ...uploadMeta,
                      type: e.target.value as LibraryResource['type']
                    })
                  }
                >
                  <option value="book">Livro / PDF</option>
                  <option value="handout">Apostila</option>
                  <option value="teaching">Ensino</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-dashed border-bible-border rounded bg-bible-secondary/30">
                  <label className="block text-xs font-bold uppercase mb-2 text-bible-accent">
                    Arquivo Original
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-xs"
                  />
                  <p className="text-[10px] mt-1 text-bible-text-light">
                    Para download pelo usuário
                  </p>
                </div>
                <div className="p-3 border border-dashed border-bible-border rounded bg-bible-secondary/30">
                  <label className="block text-xs font-bold uppercase mb-2 text-bible-accent">
                    Arquivo de Texto (.txt)
                  </label>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleTextFileChange}
                    className="w-full text-xs"
                  />
                  <p className="text-[10px] mt-1 text-bible-text-light">
                    Para leitura pela IA (RAG)
                  </p>
                </div>
              </div>
              {uploadTextContent && (
                <div className="text-xs text-green-600 font-bold flex items-center">
                  <i className="fas fa-check-circle mr-1"></i> Conteúdo de texto carregado para IA
                </div>
              )}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-bible-accent text-white font-bold rounded hover:bg-bible-accent-hover disabled:opacity-50"
              >
                {uploading ? 'Enviando...' : 'Salvar Recurso'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
