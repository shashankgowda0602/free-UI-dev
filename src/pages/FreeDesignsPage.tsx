import React, { useState, useMemo } from 'react';
import { DesignItem, SortOption } from '../types';
import { DesignGrid } from '../components/catalog/DesignGrid';
import { SearchBar } from '../components/catalog/SearchBar';
import { Sparkles, Gift } from 'lucide-react';

interface FreeDesignsPageProps {
  allDesigns: DesignItem[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
}

export const FreeDesignsPage: React.FC<FreeDesignsPageProps> = ({
  allDesigns,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('All');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const freeDesigns = useMemo(() => {
    let list = allDesigns.filter((d) => d.priceType === 'free');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.shortDescription.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedPurpose !== 'All') {
      list = list.filter((d) => d.purpose === selectedPurpose);
    }

    if (selectedCat !== 'All') {
      list = list.filter((d) => d.category === selectedCat);
    }

    list.sort((a, b) => {
      if (sortBy === 'popular') return b.favoritesCount - a.favoritesCount;
      if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
      if (sortBy === 'newest')
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [allDesigns, search, sortBy, selectedPurpose, selectedCat]);

  const purposes = [
    { label: 'All Purposes', value: 'All' },
    { label: 'Hero Animations', value: 'Hero & Animation' },
    { label: 'Button UIs', value: 'Button UI' },
    { label: 'Icon Designs', value: 'Icon Designs' },
    { label: 'Components', value: 'Components' },
    { label: 'Templates', value: 'Full Templates' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#10141f] to-[#0c0d14] border border-emerald-500/30 p-8 mb-8 text-center max-w-3xl mx-auto shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
          <Gift className="w-5 h-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          100% Free & Open-Source UI Designs
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
          Permissive MIT licensed interfaces and components. Download editable source code ZIP
          archives directly with no paywall, no signup required, and zero subscription fees.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search free designs..."
          />
        </div>

        {/* Purpose Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {purposes.map((p) => (
            <button
              key={p.value}
              onClick={() => setSelectedPurpose(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPurpose === p.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <DesignGrid
        designs={freeDesigns}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onOpenDetails={onOpenDetails}
        onOpenPreview={onOpenPreview}
        onOpenCustomizer={onOpenCustomizer}
        onResetFilters={() => {
          setSearch('');
          setSelectedCat('All');
        }}
      />
    </div>
  );
};
