import React, { useState } from 'react';
import { DesignItem, DesignPurpose } from '../types';
import { DesignCard } from '../components/cards/DesignCard';
import { LiveDesignRenderer } from '../components/previews/LiveDesignRenderer';
import {
  Search,
  Sparkles,
  ArrowRight,
  Download,
  Sliders,
  Code2,
  MousePointerClick,
  Compass,
  Boxes,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  allDesigns: DesignItem[];
  onNavigate: (tab: string, category?: string, purpose?: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
}

interface PurposeMeta {
  purpose: DesignPurpose;
  icon: string;
  title: string;
  tagline: string;
  reference: string;
  description: string;
}

const PURPOSES_CATALOG: PurposeMeta[] = [
  {
    purpose: 'Crazy Loaders & Toggles',
    icon: '⚡',
    title: 'Crazy Loaders & Toggles',
    tagline: 'BLENDER 3D HYDRAULICS & CYBER TACTILE PHYSICS',
    reference: 'Baby Cry Tears Pipe · Kinetic Sprint Runner · Plasma Knife Switches',
    description:
      'Blender-level creative physics animations, weeping baby hydraulic tears filling glass pipes, kinetic sprint treadmill runners, celestial day/night orbit morphs, and crackling high-voltage knife switches.',
  },
  {
    purpose: 'Hero & Animation',
    icon: '🌌',
    title: 'Hero & Home Animations',
    tagline: 'High-Impact Kinetic Viewports',
    reference: 'Inspired by MagicUI Retro Grids & Unlumen Neural Beams',
    description:
      'Immersive perspective 3D wireframe floors, flowing SVG synaptic conduit beams, and meteoric particle streams built with lightweight CSS and canvas.',
  },
  {
    purpose: 'Button UI',
    icon: '🔘',
    title: 'Interactive Button UIs',
    tagline: 'Tactile Physics & Liquid Micro-Interactions',
    reference: 'Inspired by MagicUI Border Beams & Google Stitch Tactility',
    description:
      'Conic-gradient rotating border beams, ink-spread material physics ripples, and mercury liquid capsules engineered for high engagement and delightful clicks.',
  },
  {
    purpose: 'Icon Designs',
    icon: '✦',
    title: 'Icon Designs & Insignias',
    tagline: 'State-Morphing Vectors & 3D Badges',
    reference: 'Inspired by Google Stitch Morphing & Unlumen Holograms',
    description:
      'Dynamic SVG path morphing for interactive state toggles (Play/Pause, Search/Close), 3D frosted holographic insignias, and live sonar telemetry beacons.',
  },
  {
    purpose: 'Components',
    icon: '🧩',
    title: 'Interactive Components',
    tagline: 'Modular Atomic Widgets & Scrollers',
    reference: 'Inspired by MagicUI macOS Docks & Unlumen Spotlight Bentos',
    description:
      'Fluid spring-magnification docks, continuous velocity marquee tickers, radial cursor-following spotlight bento tiles, and verified social proof suites.',
  },
  {
    purpose: 'Full Templates',
    icon: '📦',
    title: 'Full Production Templates',
    tagline: 'End-to-End Application Consoles',
    reference: 'Complete Multi-Screen Layouts with Design Systems',
    description:
      'Comprehensive dark-glass enterprise dashboards, accessible Aurora auth suites, boutique e-commerce PDPs, and FinTech wealth trackers.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  allDesigns,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<DesignPurpose>('Crazy Loaders & Toggles');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('explore');
  };

  const activePurposeData = PURPOSES_CATALOG.find((p) => p.purpose === selectedPurpose)!;
  const purposeDesigns = allDesigns.filter((d) => d.purpose === selectedPurpose);

  // Trending & Free highlights
  const trendingDesigns = allDesigns.filter((d) => d.trending).slice(0, 3);
  const freeDesigns = allDesigns.filter((d) => d.priceType === 'free').slice(0, 3);

  // Hero showcase items featuring the new crazy creative animations
  const heroCard1 = allDesigns.find((d) => d.slug === 'baby-tears-pipe-loader') || allDesigns[0];
  const heroCard2 = allDesigns.find((d) => d.slug === 'running-man-loader') || allDesigns[1];
  const heroCard3 = allDesigns.find((d) => d.slug === 'celestial-day-night-toggle') || allDesigns[2];

  const categories = [
    { name: 'Landing Page', count: allDesigns.filter((d) => d.category === 'Landing Page').length, desc: '3D spatial heroes & kinetic typography' },
    { name: 'Dashboard', count: allDesigns.filter((d) => d.category === 'Dashboard').length, desc: 'Glassmorphic analytics & telemetry' },
    { name: 'Components', count: allDesigns.filter((d) => d.category === 'Components').length, desc: 'Fluid docks, marquees & spotlight bentos' },
    { name: 'Navigation', count: allDesigns.filter((d) => d.category === 'Navigation').length, desc: 'Dynamic app rails & command palettes' },
    { name: 'E-commerce', count: allDesigns.filter((d) => d.category === 'E-commerce').length, desc: 'Product grids & luxury audio PDPs' },
    { name: 'Auth', count: allDesigns.filter((d) => d.category === 'Auth').length, desc: 'Glassmorphic login & signup portals' },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION: Clean, Breathable, High-Contrast */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-[#0e1017] via-[#0b0c10] to-[#0b0c10]">
        {/* Soft Ambient Radiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Copy & Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* High-Contrast Crazy Modern Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/50 text-xs font-mono font-bold text-violet-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>UIverse Studio · 43 Crazy Creative UI Designs</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] text-balance">
                Crazy Creative UI.{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
                  Blender 3D Physics & Next-Gen Interactions.
                </span>
              </h1>

              {/* High-Contrast Modern Micro-Features (Replaces dull text) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 flex items-center gap-1.5 font-bold shadow-md shadow-cyan-950">
                  <span>⚡</span> Blender 3D Tears Hydraulics
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-1.5 font-bold shadow-md shadow-emerald-950">
                  <span>🏃</span> Kinetic Sprint Runner
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 flex items-center gap-1.5 font-bold shadow-md shadow-amber-950">
                  <span>🪐</span> Celestial Orbit Toggles
                </span>
                <span className="px-3 py-1 rounded-lg bg-violet-950/80 border border-violet-500/50 text-violet-300 flex items-center gap-1.5 font-bold shadow-md shadow-violet-950">
                  <span>📦</span> Zero-Dependency PKZIP
                </span>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
                <div className="flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-2xl transition-all">
                  <div className="pl-3 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search baby tears pipe loader, runners, celestial toggles, buttons..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-xs font-bold text-white transition-all shrink-0 shadow-lg shadow-cyan-500/20"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Purpose Chips for 1-Click Access */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium mr-1">Quick Jump:</span>
                {PURPOSES_CATALOG.map((p) => (
                  <button
                    key={p.purpose}
                    onClick={() => {
                      setSelectedPurpose(p.purpose);
                      const el = document.getElementById('purpose-studio');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>{p.icon}</span>
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
                >
                  <span>Explore Full Catalog (43)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('free')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700 transition-colors"
                >
                  Browse Free Open-Source
                </button>
              </div>

              {/* High-Contrast Live Telemetry HUD Strip */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-mono">
                <span className="text-cyan-400 font-bold">43 Production Designs</span>
                <span aria-hidden="true">·</span>
                <span className="text-violet-300 font-semibold">6 Segregated Purpose Labs</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300 font-semibold">Blender 3D Physics</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-semibold">1-Click ZIP Engine</span>
              </div>
            </div>

            {/* Right Column: Clean Interactive Preview Stage */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-[400px] flex items-center justify-center">
                {/* Back card (offset top right) */}
                <div
                  onClick={() => onOpenDetails(heroCard3)}
                  className="absolute -top-1 right-2 w-72 h-44 rounded-2xl bg-[#11131c] border border-slate-800 shadow-xl opacity-75 transform rotate-3 hover:opacity-100 hover:rotate-0 transition-all cursor-pointer overflow-hidden p-2"
                >
                  <LiveDesignRenderer variant={heroCard3.previewVariant} config={heroCard3.defaultConfig} />
                </div>

                {/* Bottom card (offset bottom left) */}
                <div
                  onClick={() => onOpenDetails(heroCard2)}
                  className="absolute bottom-1 left-2 w-72 h-44 rounded-2xl bg-[#11131c] border border-slate-800 shadow-xl opacity-75 transform -rotate-3 hover:opacity-100 hover:rotate-0 transition-all cursor-pointer overflow-hidden p-2"
                >
                  <LiveDesignRenderer variant={heroCard2.previewVariant} config={heroCard2.defaultConfig} />
                </div>

                {/* Center Main Card */}
                <div
                  onClick={() => onOpenDetails(heroCard1)}
                  className="relative z-10 w-80 h-56 rounded-2xl bg-[#141624] border border-violet-500/40 shadow-2xl hover:scale-105 transition-transform cursor-pointer overflow-hidden p-3"
                >
                  <LiveDesignRenderer variant={heroCard1.previewVariant} config={heroCard1.defaultConfig} />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <span className="font-bold text-white">{heroCard1.name}</span>
                    <span className="text-violet-400">Click to Inspect & Customize</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNIFIED INTERACTIVE PURPOSE STUDIO: Non-messy, Easy to Identify, User-Friendly */}
      <section id="purpose-studio" className="py-14 border-b border-slate-800/80 bg-[#0a0c12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold mb-1.5 block">
                INTERACTIVE DESIGN STUDIO
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Segregated by Design Purpose
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Select a purpose below to preview dedicated designs with live customizable tokens and instant ZIP export.
              </p>
            </div>

            <button
              onClick={() => onNavigate('explore', undefined, selectedPurpose)}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Explore all in {activePurposeData.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clean Segmented Purpose Switcher (Buttons with Clear States) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
            {PURPOSES_CATALOG.map((p) => {
              const isActive = selectedPurpose === p.purpose;
              const count = allDesigns.filter((d) => d.purpose === p.purpose).length;
              return (
                <button
                  key={p.purpose}
                  onClick={() => setSelectedPurpose(p.purpose)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span className="text-sm">{p.icon}</span>
                  <span>{p.title}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-violet-700 text-violet-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Purpose Briefing Banner: High-Contrast Cyber HUD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111326] via-[#0d0f1c] to-[#121526] border-2 border-violet-500/40 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-black text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-500/50 shadow-sm">
                  ⚡ {activePurposeData.tagline}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-violet-300 font-semibold px-2 py-0.5 rounded bg-violet-950/50 border border-violet-500/30">
                  {activePurposeData.reference}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed font-medium">
                {activePurposeData.description}
              </p>
            </div>

            <button
              onClick={() => onNavigate('explore', undefined, activePurposeData.purpose)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all shrink-0 hover:scale-105"
            >
              <span>View All ({purposeDesigns.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3-Card Curated Showcase for Selected Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {purposeDesigns.slice(0, 3).map((design) => (
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
      </section>

      {/* 3. COMMUNITY FAVORITES: Clean 3-Card Row */}
      <section className="py-14 border-b border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-violet-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HIGH ENGAGEMENT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Community Favorites
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trendingDesigns.map((design) => (
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
      </section>

      {/* 4. POPULAR CATEGORIES: Clean Compact Architecture Grid */}
      <section className="py-14 border-b border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1 block">
            BROWSE BY ARCHITECTURAL CATEGORY
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Popular Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onNavigate('explore', cat.name)}
              className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-600/15 text-violet-400 flex items-center justify-center text-xs font-bold mb-2 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                {cat.name.charAt(0)}
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono block mt-1">{cat.count} designs</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. WORKFLOW PIPELINE: Clean 4-Step Guide */}
      <section className="py-16 border-b border-slate-800/80 bg-[#090a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase text-violet-400 font-bold mb-2 block">
              WORKFLOW PIPELINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              From Discovery to Production in Minutes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              UIverse Studio pairs visual inspiration with real, extractable code packages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#11131c] border border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-slate-500 block mb-1">01. DISCOVER</span>
              <h3 className="text-sm font-bold text-white mb-2">Explore 38+ Designs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by purpose (hero animations, button UI, icon systems, components) and framework.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11131c] border border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-slate-500 block mb-1">02. CUSTOMIZE</span>
              <h3 className="text-sm font-bold text-white mb-2">Live Token Editor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adjust primary colors, typography, border radius, button styles, and motion velocity with live preview.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11131c] border border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-slate-500 block mb-1">03. DOWNLOAD</span>
              <h3 className="text-sm font-bold text-white mb-2">Pure Client-Side ZIP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download fully valid ZIP archives containing index.html, style.css, React JSX,
                package.json, and license files.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11131c] border border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono text-slate-500 block mb-1">04. BUILD</span>
              <h3 className="text-sm font-bold text-white mb-2">Seamless Integration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drop exported components straight into React, Vite, Next.js, or vanilla workflows
                with zero lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREE DESIGNS SPOTLIGHT: Permissive Open-Source */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold mb-1 block">
              PERMISSIVE OPEN-SOURCE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Featured Free Downloads
            </h2>
          </div>
          <button
            onClick={() => onNavigate('free')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Browse All Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {freeDesigns.map((design) => (
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
      </section>
    </div>
  );
};
