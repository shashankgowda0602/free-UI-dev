import React from 'react';
import { FilterCriteria } from '../../services/designService';
import { CategoryType, DesignPurpose, TechType, PriceType, AnimationType } from '../../types';
import { RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react';

interface CategorySidebarProps {
  filters: FilterCriteria;
  onUpdateFilters: (updates: Partial<FilterCriteria>) => void;
  onResetFilters: () => void;
  totalCount: number;
}

const PURPOSES: { label: string; value: DesignPurpose | 'All'; icon?: string }[] = [
  { label: 'All Purposes', value: 'All' },
  { label: 'Crazy Loaders & Toggles', value: 'Crazy Loaders & Toggles' },
  { label: 'Hero & Animations', value: 'Hero & Animation' },
  { label: 'Button UI Designs', value: 'Button UI' },
  { label: 'Icon Designs', value: 'Icon Designs' },
  { label: 'Components', value: 'Components' },
  { label: 'Full Templates', value: 'Full Templates' },
];

const CATEGORIES: CategoryType[] = [
  'All',
  'Landing Page',
  'Dashboard',
  'E-commerce',
  'Auth',
  'Components',
  'Portfolio',
  'FinTech',
  'Navigation',
];

const TECHNOLOGIES: (TechType | 'All')[] = [
  'All',
  'React + Tailwind',
  'HTML5 + Modern CSS',
  'Vue + Tailwind',
  'Next.js App',
];

const PRICE_TYPES: { label: string; value: PriceType | 'All' }[] = [
  { label: 'All Licenses', value: 'All' },
  { label: 'Free (MIT/CC0)', value: 'free' },
  { label: 'Pro Commercial', value: 'premium' },
];

const ANIMATION_TYPES: (AnimationType | 'All')[] = [
  'All',
  'Framer Motion',
  'CSS Keyframes',
  'WebGL/Canvas',
  'Smooth Transitions',
  'Micro-interactions',
];

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalCount,
}) => {
  const activeFiltersCount = [
    filters.purpose && filters.purpose !== 'All',
    filters.category && filters.category !== 'All',
    filters.technology && filters.technology !== 'All',
    filters.priceType && filters.priceType !== 'All',
    filters.animationType && filters.animationType !== 'All',
    filters.screenSize && filters.screenSize !== 'All',
    filters.theme && filters.theme !== 'All',
  ].filter(Boolean).length;

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <SlidersHorizontal className="w-4 h-4 text-violet-400" />
          <span>Filters</span>
          <span className="text-xs font-mono text-slate-400">({totalCount})</span>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-violet-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      {/* Purpose Segregation Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Design Purpose</span>
          </h4>
        </div>
        <div className="space-y-1">
          {PURPOSES.map((p) => {
            const isSelected = (filters.purpose || 'All') === p.value;
            return (
              <button
                key={p.value}
                onClick={() => onUpdateFilters({ purpose: p.value })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{p.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Section */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Category
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All') === cat;
            return (
              <button
                key={cat}
                onClick={() => onUpdateFilters({ category: cat })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing / License Section */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Pricing & License
        </h4>
        <div className="space-y-1">
          {PRICE_TYPES.map((pt) => {
            const isSelected = (filters.priceType || 'All') === pt.value;
            return (
              <button
                key={pt.value}
                onClick={() => onUpdateFilters({ priceType: pt.value })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{pt.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Technology Section */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Technology
        </h4>
        <div className="space-y-1">
          {TECHNOLOGIES.map((tech) => {
            const isSelected = (filters.technology || 'All') === tech;
            return (
              <button
                key={tech}
                onClick={() => onUpdateFilters({ technology: tech })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{tech}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation System */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Animation System
        </h4>
        <div className="space-y-1">
          {ANIMATION_TYPES.map((anim) => {
            const isSelected = (filters.animationType || 'All') === anim;
            return (
              <button
                key={anim}
                onClick={() => onUpdateFilters({ animationType: anim })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{anim}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Support */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Device Support
        </h4>
        <div className="flex gap-2">
          {['All', 'Desktop', 'Tablet', 'Mobile'].map((screen) => {
            const isSelected = (filters.screenSize || 'All') === screen;
            return (
              <button
                key={screen}
                onClick={() =>
                  onUpdateFilters({
                    screenSize: screen as 'Desktop' | 'Tablet' | 'Mobile' | 'All',
                  })
                }
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-colors ${
                  isSelected
                    ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {screen}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
