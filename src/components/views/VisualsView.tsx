import React, { useState } from 'react';
import { Scene } from '../../types';

interface VisualsViewProps {
  loading: boolean;
  scenes: Scene[];
}

export const VisualsView: React.FC<VisualsViewProps> = ({ loading, scenes }) => {
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-70">
        <i className="fas fa-circle-notch fa-spin text-4xl text-bible-accent mb-4"></i>
        <p className="text-sm font-bold uppercase tracking-widest">Criando Cenas...</p>
      </div>
    );
  }

  if (!scenes || scenes.length === 0) {
    return (
      <div className="text-center py-20 opacity-50">
        <i className="fas fa-image text-6xl mb-4 text-bible-border"></i>
        <p>Nenhuma cena gerada ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {scenes.map((scene, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden border border-bible-border shadow-md transition-transform hover:scale-[1.01]"
        >
          <img
            src={scene.url}
            className="w-full h-auto cursor-zoom-in"
            onClick={() => setFullScreenImage(scene.url)}
            alt={`Scene ${i}`}
            loading="lazy"
          />
          <div className="p-2 sm:p-3 bg-bible-card">
            <p className="text-sm text-bible-text italic">"{scene.caption}"</p>
          </div>
        </div>
      ))}

      {fullScreenImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setFullScreenImage(null)}
        >
          <img src={fullScreenImage} className="max-w-full max-h-full p-4" alt="Full Screen" />
        </div>
      )}
    </div>
  );
};
