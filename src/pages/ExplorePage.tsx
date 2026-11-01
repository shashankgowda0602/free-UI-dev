import React, { useState, useEffect } from 'react';
import { DesignItem, SortOption } from '../types';
import { CategorySidebar } from '../components/catalog/CategorySidebar';
import { DesignGrid } from '../components/catalog/DesignGrid';
import { SearchBar } from '../components/catalog/SearchBar';
import { FilterCriteria, getDesigns } from '../services/designService';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

interface ExplorePageProps {
  initialCategory?: string;
  initialPurpose?: string;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
}

const PURPOSE_TABS = [
  { label: 'All Designs', value: 'All', icon: '✦', count: 43 },
  { label: 'Crazy Loaders & Toggles', value: 'Crazy Loaders & Toggles', icon: '⚡', count: 5 },
  { label: 'Hero & Animations', value: 'Hero & Animation', icon: '🌌', count: 7 },
  { label: 'Button UI Designs', value: 'Button UI', icon: '🔘', count: 5 },
  { label: 'Icon Designs', value: 'Icon Designs', icon: '✦', count: 3 },
  { label: 'Components', value: 'Components', icon: '🧩', count: 15 },
  { label: 'Full Templates', value: 'Full Templates', icon: '📦', count: 8 },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({
  initialCategory = 'All',
  initialPurpose = 'All',
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
}) => {
  const [filters, setFilters] = useState<FilterCriteria>({
    search: '',
    purpose: (initialPurpose as FilterCriteria['purpose']) || 'All',
    category: (initialCategory as FilterCriteria['category']) || 'All',
    technology: 'All',
    priceType: 'All',
    animationType: 'All',
    screenSize: 'All',
    theme: 'All',
    sortBy: 'popular',
  });

  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync props when user navigates with new category or purpose
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: (initialCategory as FilterCriteria['category']) || 'All',
      purpose: (initialPurpose as FilterCriteria['purpose']) || 'All',
    }));
  }, [initialCategory, initialPurpose]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getDesigns(filters).then((results) => {
      if (active) {
        setDesigns(results);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [filters]);

  const handleUpdateFilters = (updates: Partial<FilterCriteria>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      purpose: 'All',
      category: 'All',
      technology: 'All',
      priceType: 'All',
      animationType: 'All',
      screenSize: 'All',
      theme: 'All',
      sortBy: 'popular',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Explore UIverse Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover and customize 38+ production designs segregated by role: Hero Animations, Button UI, Icon Systems, and Components.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-96">
          <SearchBar
            value={filters.search || ''}
            onChange={(q) => handleUpdateFilters({ search: q })}
            placeholder="Search designs by name, tags, tech..."
          />
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Purpose Quick Segregation Bar */}
      <div className="mb-8 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PURPOSE_TABS.map((tab) => {
            const isActive = (filters.purpose || 'All') === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleUpdateFilters({ purpose: tab.value as FilterCriteria['purpose'] })}
                className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-violet-700 text-violet-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Catalog Layout: Left Sidebar + Right Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block">
          <CategorySidebar
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onResetFilters={handleResetFilters}
            totalCount={designs.length}
          />
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/80 backdrop-blur-sm">
            <div className="w-80 max-w-[85vw] h-full bg-[#0f111a] border-l border-slate-800 p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="text-sm font-bold text-white">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CategorySidebar
                filters={filters}
                onUpdateFilters={(upd) => {
                  handleUpdateFilters(upd);
                }}
                onResetFilters={handleResetFilters}
                totalCount={designs.length}
              />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 py-2 rounded-lg bg-violet-600 font-semibold text-white text-xs"
              >
                Apply Filters ({designs.length})
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area: Design Grid */}
        <main className="flex-1 w-full">
          {/* Active Filter Badges Bar */}
          {((filters.purpose && filters.purpose !== 'All') ||
            (filters.category && filters.category !== 'All') ||
            (filters.search && filters.search.trim() !== '')) && (
            <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Filtering by:</span>
              {filters.purpose && filters.purpose !== 'All' && (
                <button
                  onClick={() => handleUpdateFilters({ purpose: 'All' })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-colors"
                  title="Remove purpose filter"
                >
                  <span>Purpose: {filters.purpose}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.category && filters.category !== 'All' && (
                <button
                  onClick={() => handleUpdateFilters({ category: 'All' })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 transition-colors"
                  title="Remove category filter"
                >
                  <span>Category: {filters.category}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.search && filters.search.trim() !== '' && (
                <button
                  onClick={() => handleUpdateFilters({ search: '' })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30 transition-colors"
                  title="Clear search keyword"
                >
                  <span>Search: &ldquo;{filters.search}&rdquo;</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={handleResetFilters}
                className="ml-auto text-[11px] text-slate-400 hover:text-white underline transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          <DesignGrid
            designs={designs}
            isLoading={isLoading}
            sortBy={filters.sortBy || 'popular'}
            onSortChange={(sort) => handleUpdateFilters({ sortBy: sort })}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onOpenDetails={onOpenDetails}
            onOpenPreview={onOpenPreview}
            onOpenCustomizer={onOpenCustomizer}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>
    </div>
  );
};
