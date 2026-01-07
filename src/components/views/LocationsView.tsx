import React, { useState } from 'react';
import { LocationResult } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface LocationsViewProps {
  loading: boolean;
  result: LocationResult | null;
  customQuery: string;
  onQueryChange: (val: string) => void;
  onSearch: () => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({
  loading,
  result,
  customQuery,
  onQueryChange,
  onSearch
}) => {
  const { t } = useLanguage();
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={customQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder={t('maps')}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <button onClick={onSearch} className="bg-bible-accent text-white px-4 rounded">
          Go
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 opacity-70">
          <i className="fas fa-circle-notch fa-spin text-4xl text-bible-accent mb-4"></i>
          <p className="text-sm font-bold uppercase tracking-widest">{t('loading')}</p>
        </div>
      )}

      {!loading && result?.mapUrl && (
        <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-bible-border relative group">
          <img
            src={result.mapUrl}
            alt="Mapa Bíblico"
            className="w-full h-auto object-cover cursor-zoom-in"
            onClick={() => setFullScreenImage(result.mapUrl!)}
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-center">
            Gerado por IA
          </div>
          <button
            onClick={() => setFullScreenImage(result.mapUrl!)}
            className="absolute top-2 right-2 bg-bible-card/80 p-2 rounded-full text-bible-text hover:bg-bible-card"
          >
            <i className="fas fa-expand"></i>
          </button>
        </div>
      )}

      {!loading &&
        result &&
        result.locations.map((l, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-bold">{l.biblicalName}</h3>
            <p>{l.description}</p>
          </div>
        ))}

      {fullScreenImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setFullScreenImage(null)}
        >
          <img src={fullScreenImage} className="max-w-full max-h-full p-4" alt="Full Screen Map" />
        </div>
      )}
    </div>
  );
};
