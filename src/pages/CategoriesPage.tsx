import React, { useState } from 'react';
import { DesignItem, CategoryType, DesignPurpose } from '../types';
import { DesignCard } from '../components/cards/DesignCard';
import { ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';

interface CategoriesPageProps {
  allDesigns: DesignItem[];
  onNavigate: (tab: string, category?: string, purpose?: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
}

const PURPOSE_META: { purpose: DesignPurpose; icon: string; tagline: string; description: string }[] = [
  {
    purpose: 'Hero & Animation',
    icon: '🌌',
    tagline: 'MagicUI retro grids, Unlumen neural beams & spatial meteors',
    description: 'High-impact kinetic landing heroes with canvas particle systems, 3D perspective grids, and SVG morphs.',
  },
  {
    purpose: 'Button UI',
    icon: '🔘',
    tagline: 'Border beam kinetics, tactile physics ripples & liquid mercury',
    description: 'Micro-interaction buttons designed for high click-through rates, tactile feedback, and seamless CSS keyframes.',
  },
  {
    purpose: 'Icon Designs',
    icon: '✦',
    tagline: 'Google Stitch morphing state vectors & 3D holographic insignias',
    description: 'Dynamic iconography and telemetry indicators that seamlessly transition between states with smooth paths.',
  },
  {
    purpose: 'Components',
    icon: '🧩',
    tagline: 'Fluid macOS docks, velocity marquees & spotlight bentos',
    description: 'Autonomous modular building blocks with spring physics, cursor spotlight effects, and dense data presentation.',
  },
  {
    purpose: 'Full Templates',
    icon: '📦',
    tagline: 'Multi-screen dashboards, auth portals & eCommerce suites',
    description: 'End-to-end production templates with unified design systems, responsive layouts, and token hooks.',
  },
];

const CATEGORY_META: { category: CategoryType; tagline: string; description: string }[] = [
  {
    category: 'Landing Page',
    tagline: 'Hero sections, 3D spatial scenes & kinetic typography',
    description: 'High-conversion, fluid landing components engineered to make brand launches unforgettable.',
  },
  {
    category: 'Dashboard',
    tagline: 'Enterprise telemetry, glassmorphic analytics & KPI cards',
    description: 'Data-dense consoles with real-time throughput graphs, modular tiles, and dark-mode elegance.',
  },
  {
    category: 'E-commerce',
    tagline: 'Product grids, luxury audio PDPs & SwiftPay checkout',
    description: 'Built for high average order values with quick-add actions and frictionless checkout flows.',
  },
  {
    category: 'Auth',
    tagline: 'Aurora glass login, signup & security modals',
    description: 'Accessible, responsive authentication interfaces ready for Firebase or Supabase.',
  },
  {
    category: 'Components',
    tagline: 'Kinetic buttons, verified testimonials, chat threads & forms',
    description: 'Atomic building blocks with meticulous micro-interactions, liquid borders, and tactile clicks.',
  },
  {
    category: 'Portfolio',
    tagline: 'CLI developer terminals & personal identity bento cards',
    description: 'Distinctive personal sites and resume layouts that stand out to technical hiring managers.',
  },
  {
    category: 'FinTech',
    tagline: 'Ledger wealth trackers & liquidity overview consoles',
    description: 'Financial dashboard cards with balance privacy toggles, merchant logs, and spending breakdowns.',
  },
  {
    category: 'Navigation',
    tagline: 'Command palette fluid navbars & modular app rails',
    description: 'Clean responsive headers with embedded ⌘K quick-search and collapsible workspace rails.',
  },
];

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  allDesigns,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
}) => {
  const [viewMode, setViewMode] = useState<'purpose' | 'category'>('purpose');
  const [selectedPurpose, setSelectedPurpose] = useState<DesignPurpose>('Hero & Animation');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Landing Page');

  const activePurposeMeta = PURPOSE_META.find((p) => p.purpose === selectedPurpose)!;
  const activeCategoryMeta = CATEGORY_META.find((c) => c.category === selectedCategory)!;

  const filteredDesigns =
    viewMode === 'purpose'
      ? allDesigns.filter((d) => d.purpose === selectedPurpose)
      : allDesigns.filter((d) => d.category === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold mb-2 inline-block">
          ARCHITECTURAL TAXONOMY
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Explore by Purpose & Category
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Segregate hand-crafted interfaces either by their functional purpose (Hero Animations, Buttons, Icons, Components) or architectural category.
        </p>

        {/* View Mode Toggle */}
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl mt-6">
          <button
            onClick={() => setViewMode('purpose')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'purpose'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Segregate by Purpose</span>
          </button>
          <button
            onClick={() => setViewMode('category')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'category'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Browse by Category</span>
          </button>
        </div>
      </div>

      {/* Purpose Pills Selector */}
      {viewMode === 'purpose' && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {PURPOSE_META.map((meta) => {
            const isSelected = selectedPurpose === meta.purpose;
            const count = allDesigns.filter((d) => d.purpose === meta.purpose).length;
            return (
              <button
                key={meta.purpose}
                onClick={() => setSelectedPurpose(meta.purpose)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25 border border-violet-500'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.purpose}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSelected ? 'bg-violet-700 text-violet-100' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Category Pills Selector */}
      {viewMode === 'category' && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORY_META.map((meta) => {
            const isSelected = selectedCategory === meta.category;
            const count = allDesigns.filter((d) => d.category === meta.category).length;
            return (
              <button
                key={meta.category}
                onClick={() => setSelectedCategory(meta.category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25 border border-violet-500'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{meta.category}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSelected ? 'bg-violet-700 text-violet-100' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Spotlight Header */}
      <div className="p-6 rounded-2xl bg-[#11131c] border border-slate-800 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-violet-400 font-bold">
            {viewMode === 'purpose' ? activePurposeMeta.tagline : activeCategoryMeta.tagline}
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            {viewMode === 'purpose' && <span>{activePurposeMeta.icon}</span>}
            <span>{viewMode === 'purpose' ? activePurposeMeta.purpose : activeCategoryMeta.category}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({filteredDesigns.length} designs)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {viewMode === 'purpose' ? activePurposeMeta.description : activeCategoryMeta.description}
          </p>
        </div>

        <button
          onClick={() => {
            if (viewMode === 'purpose') {
              onNavigate('explore', undefined, activePurposeMeta.purpose);
            } else {
              onNavigate('explore', activeCategoryMeta.category, undefined);
            }
          }}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0"
        >
          <span>Open in Catalog Filter</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of designs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDesigns.map((design) => (
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

