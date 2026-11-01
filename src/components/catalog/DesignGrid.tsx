import React from 'react';
import { DesignItem, SortOption } from '../../types';
import { DesignCard } from '../cards/DesignCard';
import { ArrowDownWideNarrow, SearchX } from 'lucide-react';

interface DesignGridProps {
  designs: DesignItem[];
  isLoading?: boolean;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
  onResetFilters?: () => void;
}

export const DesignGrid: React.FC<DesignGridProps> = ({
  designs,
  isLoading = false,
  sortBy,
  onSortChange,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
  onResetFilters,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Top Toolbar: Results count and Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white font-mono">{designs.length}</span>{' '}
          production-ready designs
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label
            htmlFor="sort-select"
            className="text-xs text-slate-400 flex items-center gap-1.5"
          >
            <ArrowDownWideNarrow className="w-3.5 h-3.5 text-violet-400" />
            <span>Sort by:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="downloads">Most Downloaded</option>
            <option value="newest">Recently Added</option>
            <option value="name-asc">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/60 h-80 animate-pulse flex flex-col p-4"
            >
              <div className="w-full h-44 bg-slate-800/50 rounded-xl mb-4" />
              <div className="w-3/4 h-4 bg-slate-800/50 rounded mb-2" />
              <div className="w-1/2 h-3 bg-slate-800/50 rounded mb-4" />
              <div className="mt-auto flex justify-between">
                <div className="w-16 h-3 bg-slate-800/50 rounded" />
                <div className="w-16 h-6 bg-slate-800/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : designs.length === 0 ? (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <div className="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No designs match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
            Try adjusting your search keywords, clear category selections, or reset all filters to
            explore our complete catalog.
          </p>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {designs.map((design) => (
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
      )}
    </div>
  );
};
