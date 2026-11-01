import React, { useState } from 'react';
import { DesignItem, CollectionItem } from '../types';
import { DesignCard } from '../components/cards/DesignCard';
import { Folder, Layers, Sparkles, ArrowRight } from 'lucide-react';

interface CollectionsPageProps {
  allDesigns: DesignItem[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
}

const CURATED_COLLECTIONS: CollectionItem[] = [
  {
    id: 'curated-01',
    name: 'Best Login Pages & Auth Suites',
    description: 'Sleek dark-mode, frosted glassmorphism, and split-screen authentication forms.',
    designIds: ['uiv-02'],
    isCurated: true,
    createdAt: '2026-10-26',
  },
  {
    id: 'curated-02',
    name: '3D and WebGL Experiences',
    description: 'Perspective-tilted heroes, floating orbital meshes, and spatial computing viewports.',
    designIds: ['uiv-01', 'uiv-04'],
    isCurated: true,
    createdAt: '2026-10-25',
  },
  {
    id: 'curated-03',
    name: 'SaaS Analytics & Telemetry Dashboards',
    description: 'Frosted telemetry consoles, live throughput meters, and executive KPI summaries.',
    designIds: ['uiv-03', 'uiv-08', 'uiv-19'],
    isCurated: true,
    createdAt: '2026-10-24',
  },
  {
    id: 'curated-04',
    name: 'Developer Portfolios & Resumes',
    description: 'CLI terminals, brutalist monochrome typography, and personal bento profile cards.',
    designIds: ['uiv-09', 'uiv-10', 'uiv-14'],
    isCurated: true,
    createdAt: '2026-10-23',
  },
  {
    id: 'curated-05',
    name: 'E-commerce & Luxury Retail UI',
    description: 'High-end footwear catalog grids, audiophile PDPs, and frictionless 1-click checkouts.',
    designIds: ['uiv-05', 'uiv-06', 'uiv-24'],
    isCurated: true,
    createdAt: '2026-10-22',
  },
  {
    id: 'curated-06',
    name: 'Gradient UI & Kinetic Mesh Systems',
    description: 'CSS-only chromatic radial flows, smooth ambient transitions, and vibrant hero banners.',
    designIds: ['uiv-04', 'uiv-13', 'uiv-21'],
    isCurated: true,
    createdAt: '2026-10-21',
  },
  {
    id: 'curated-07',
    name: 'Minimalist Components & Micro-Interactions',
    description: 'Kinetic button suites, verified testimonials, and floating command paletted navbars.',
    designIds: ['uiv-07', 'uiv-11', 'uiv-13', 'uiv-15'],
    isCurated: true,
    createdAt: '2026-10-20',
  },
  {
    id: 'curated-08',
    name: 'Interactive Tools & FinTech Ledgers',
    description: 'Wealth liquidity trackers, interactive LMS course cards, and multi-step inquiry studio forms.',
    designIds: ['uiv-16', 'uiv-20', 'uiv-22', 'uiv-23'],
    isCurated: true,
    createdAt: '2026-10-19',
  },
];

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  allDesigns,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
}) => {
  const [selectedColId, setSelectedColId] = useState<string>(CURATED_COLLECTIONS[0].id);

  const activeCollection =
    CURATED_COLLECTIONS.find((c) => c.id === selectedColId) || CURATED_COLLECTIONS[0];
  const collectionDesigns = allDesigns.filter((d) =>
    activeCollection.designIds.includes(d.id)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold mb-2 inline-block">
          HAND-PICKED DIRECTORY
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Curated UI Collections
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Thematic groupings of production-grade UI patterns, animations, and components tailored
          for specific product requirements.
        </p>
      </div>

      {/* Collections Selector Carousel / Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {CURATED_COLLECTIONS.map((col) => {
          const isSelected = col.id === selectedColId;
          return (
            <button
              key={col.id}
              onClick={() => setSelectedColId(col.id)}
              className={`p-4 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-violet-950/30 border-violet-500 shadow-lg shadow-violet-950/40 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                    isSelected
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {col.designIds.length} items
                </span>
              </div>
              <h3 className="text-xs font-bold leading-snug line-clamp-2">{col.name}</h3>
            </button>
          );
        })}
      </div>

      {/* Active Collection View Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121420] via-[#0f111a] to-[#0c0d14] border border-slate-800 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-violet-950/80 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded font-bold">
              CURATED COLLECTION
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {collectionDesigns.length} templates ready to download
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{activeCollection.name}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">{activeCollection.description}</p>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {collectionDesigns.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            isFavorite={isFavorite(design.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenDetails={onOpenDetails}
            onOpenPreview={onOpenPreview}
            onOpenCustomizer={onOpenCustomizer}
          />
        ))}
      </div>
    </div>
  );
};
