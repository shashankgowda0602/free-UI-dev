import React, { useState, useEffect } from 'react';
import { CustomizationConfig } from '../../types';

interface LiveDesignRendererProps {
  variant: string;
  config?: Partial<CustomizationConfig>;
  interactive?: boolean;
  scale?: number;
}

export const LiveDesignRenderer: React.FC<LiveDesignRendererProps> = ({
  variant,
  config,
  interactive = false,
  scale = 1,
}) => {
  // Fallback defaults
  const primary = config?.primaryColor || '#8b5cf6';
  const secondary = config?.secondaryColor || '#06b6d4';
  const bg = config?.backgroundColor || '#11131c';
  const radius = config?.borderRadius !== undefined ? `${config.borderRadius}px` : '12px';
  const headline = config?.sampleHeadline;
  const btnText = config?.sampleButtonText;
  const isLight = config?.themeMode === 'light';
  const buttonStyle = config?.buttonStyle || 'solid';
  const shadowLevel = config?.shadowLevel || 'subtle';
  const animationSpeed = config?.animationSpeed || 'normal';
  const fontSize = config?.fontSize || 14;

  // Dynamic Shadow based on shadowLevel token
  const getShadow = (overrideLevel?: string) => {
    const lvl = overrideLevel || shadowLevel;
    if (lvl === 'none') return 'none';
    if (lvl === 'subtle') return '0 2px 8px rgba(0,0,0,0.2)';
    if (lvl === 'medium') return '0 8px 24px rgba(0,0,0,0.35)';
    return `0 20px 50px -10px ${primary}40, 0 4px 20px rgba(0,0,0,0.6)`;
  };

  // Dynamic Button Style Generator (solid, outline, glass, glow)
  const getBtnStyle = (customRad?: string, extra?: React.CSSProperties): React.CSSProperties => {
    const r = customRad || `calc(${radius} / 2)`;
    const trans = `all ${animationSpeed === 'slow' ? '450ms' : animationSpeed === 'fast' ? '120ms' : '220ms'} ease`;
    const base: React.CSSProperties = {
      borderRadius: r,
      transition: trans,
      cursor: 'pointer',
      ...extra,
    };

    if (buttonStyle === 'outline') {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: isLight ? primary : '#ffffff',
        border: `1.5px solid ${primary}`,
      };
    }
    if (buttonStyle === 'glass') {
      return {
        ...base,
        backgroundColor: `${primary}25`,
        backdropFilter: 'blur(10px)',
        color: isLight ? '#0f172a' : '#ffffff',
        border: `1px solid ${primary}60`,
      };
    }
    if (buttonStyle === 'glow') {
      return {
        ...base,
        backgroundColor: primary,
        color: '#ffffff',
        border: 'none',
        boxShadow: `0 0 16px ${primary}90, 0 4px 12px rgba(0,0,0,0.4)`,
      };
    }
    // solid
    return {
      ...base,
      backgroundColor: primary,
      color: '#ffffff',
      border: 'none',
      boxShadow: getShadow(),
    };
  };

  // Surface and typography tokens
  const cardBg = isLight ? '#ffffff' : 'rgba(20, 23, 36, 0.85)';
  const cardBorder = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)';
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const textMuted = isLight ? '#64748b' : '#94a3b8';

  // Dynamic animation speeds for spinners and beams
  const animDuration = animationSpeed === 'slow' ? '5s' : animationSpeed === 'fast' ? '0.9s' : '2.5s';
  const spinDuration = animationSpeed === 'slow' ? '6s' : animationSpeed === 'fast' ? '1.5s' : '3s';

  const containerStyle: React.CSSProperties = {
    fontFamily: config?.fontFamily ? `'${config.fontFamily}', sans-serif` : "'Plus Jakarta Sans', sans-serif",
    fontSize: fontSize ? `${fontSize}px` : undefined,
    borderRadius: radius,
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: 'top center',
    boxShadow: getShadow(),
  };

  switch (variant) {
    case 'spatial-nexus':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : bg }}
          className="relative w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center overflow-hidden select-none"
        >
          {/* Orbital glow */}
          <div
            style={{
              background: `radial-gradient(circle, ${primary}40 0%, transparent 70%)`,
            }}
            className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-2xl pointer-events-none"
          />
          <div
            style={{
              background: `radial-gradient(circle, ${secondary}30 0%, transparent 70%)`,
            }}
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl pointer-events-none"
          />

          {/* 3D floating perspective card */}
          <div
            style={{
              borderRadius: radius,
              borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
            }}
            className="relative z-10 w-full max-w-[320px] p-4 bg-slate-900/60 backdrop-blur-md border shadow-lg transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span
                style={{ color: secondary }}
                className="text-[10px] font-mono tracking-widest uppercase font-semibold"
              >
                SPATIAL ENGINE
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-1">
              {headline || 'Spatial Computing Nexus'}
            </h4>
            <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
              Multi-layer depth acceleration for high-framerate WebGL viewports.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                style={{
                  backgroundColor: primary,
                  borderRadius: `calc(${radius} / 2)`,
                }}
                className="px-3 py-1.5 text-[11px] font-semibold text-white shadow hover:opacity-90 transition-opacity"
              >
                {btnText || 'Launch Orbit'}
              </button>
              <button
                style={{ borderRadius: `calc(${radius} / 2)` }}
                className="px-2.5 py-1.5 text-[11px] font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-colors"
              >
                Specs
              </button>
            </div>
          </div>
        </div>
      );

    case 'aurora-auth':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f1f5f9' : bg }}
          className="relative w-full h-full min-h-[220px] flex items-center justify-center p-4 overflow-hidden select-none"
        >
          {/* Subtle mesh background */}
          <div
            style={{
              background: `linear-gradient(135deg, ${primary}25, ${secondary}25)`,
            }}
            className="absolute inset-0 blur-xl opacity-60"
          />
          <div
            style={{
              borderRadius: radius,
              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)',
            }}
            className="relative z-10 w-full max-w-[280px] p-4 bg-[#141724]/90 backdrop-blur-md border shadow-xl"
          >
            <div className="text-center mb-3">
              <div
                style={{ backgroundColor: `${primary}20`, color: primary }}
                className="w-7 h-7 mx-auto mb-1.5 rounded-lg flex items-center justify-center text-xs font-bold"
              >
                ✦
              </div>
              <h5 className="text-xs font-bold text-white">
                {headline || 'Account Portal'}
              </h5>
              <p className="text-[10px] text-slate-400">Sign in to workspace</p>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-7 px-2.5 bg-black/40 rounded border border-white/10 flex items-center text-[10px] text-slate-400">
                alex@uiverse.studio
              </div>
              <div className="h-7 px-2.5 bg-black/40 rounded border border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span>••••••••••••</span>
                <span className="text-[9px] text-slate-500">Show</span>
              </div>
            </div>
            <button
              style={{
                backgroundColor: primary,
                borderRadius: `calc(${radius} / 2)`,
              }}
              className="w-full py-1.5 text-[11px] font-semibold text-white shadow hover:opacity-90 transition-opacity"
            >
              {btnText || 'Sign In'}
            </button>
          </div>
        </div>
      );

    case 'aether-glass':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-semibold">
                TELEMETRY
              </span>
              <h4 className="text-xs font-bold text-white">
                {headline || 'Aether Glass Engine'}
              </h4>
            </div>
            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
              Live
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="p-2.5 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-slate-400 block mb-0.5">Active Load</span>
              <span className="text-sm font-mono font-bold text-white">88.4%</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">▲ Optimal</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-slate-400 block mb-0.5">Throughput</span>
              <span className="text-sm font-mono font-bold text-white">4.2 GB/s</span>
              <span className="text-[9px] text-cyan-400 block mt-0.5">P99 12ms</span>
            </div>
          </div>
          <div className="h-9 w-full bg-slate-900/40 rounded border border-white/5 p-1.5 flex items-end gap-1">
            {[40, 65, 30, 85, 95, 60, 75, 90, 80, 100].map((h, i) => (
              <div
                key={i}
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 9 ? primary : `${secondary}80`,
                }}
                className="flex-1 rounded-sm transition-all"
              />
            ))}
          </div>
        </div>
      );

    case 'hypergradient-hero':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="relative w-full h-full min-h-[220px] p-5 flex flex-col justify-center items-center text-center overflow-hidden select-none"
        >
          <div
            style={{
              background: `radial-gradient(circle at center, ${primary}40, ${secondary}20, transparent 70%)`,
            }}
            className="absolute inset-0 blur-2xl"
          />
          <div className="relative z-10 max-w-[280px]">
            <span
              style={{ color: primary }}
              className="text-[9px] font-bold tracking-widest uppercase mb-1 block"
            >
              NEXT CREATIVE SYSTEM
            </span>
            <h3 className="text-base font-extrabold text-white leading-tight mb-1.5">
              {headline || 'Flowing Color Kinetic Mesh'}
            </h3>
            <p className="text-[10px] text-slate-300 mb-3 line-clamp-2">
              Zero-video lightweight gradient choreography for high-conversion hero banners.
            </p>
            <button
              style={{
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                borderRadius: radius,
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition-all"
            >
              {btnText || 'Explore Palette'}
            </button>
          </div>
        </div>
      );

    case 'veloce-grid':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : bg }}
          className="w-full h-full min-h-[220px] p-3.5 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="relative h-28 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center p-3">
            <span className="absolute top-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/30">
              Limited 04
            </span>
            {/* Minimal product sneaker silhouette */}
            <svg
              className="w-20 h-14 text-slate-300 drop-shadow-md"
              viewBox="0 0 100 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M10 40 C 25 40, 35 25, 55 20 C 70 16, 85 24, 90 35 C 92 40, 85 45, 80 45 L 15 45 Z"
                fill={`${primary}30`}
              />
              <path d="M25 45 L 30 35 L 45 35" stroke={secondary} />
              <circle cx="75" cy="35" r="4" fill={primary} />
            </svg>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                  Atelier Capsule
                </span>
                <h5 className="text-xs font-bold text-white">Veloce Carbon Core</h5>
              </div>
              <span className="text-xs font-mono font-bold text-white">$240.00</span>
            </div>
            <button
              style={{
                backgroundColor: primary,
                borderRadius: `calc(${radius} / 2)`,
              }}
              className="w-full mt-2 py-1 text-[11px] font-semibold text-slate-900 bg-amber-400 hover:opacity-90 transition-opacity"
            >
              {btnText || 'Quick Add · 42 EU'}
            </button>
          </div>
        </div>
      );

    case 'obsidian-pdp':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex gap-3 items-center overflow-hidden select-none"
        >
          <div className="w-1/2 h-full rounded-lg bg-slate-900/90 border border-white/10 flex flex-col items-center justify-center p-2 text-center">
            <div
              style={{ borderColor: primary }}
              className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-1 text-slate-300 font-mono text-xs shadow-inner"
            >
              40mm
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Planar Array</span>
          </div>
          <div className="w-1/2 flex flex-col justify-between py-1">
            <div>
              <span
                style={{ color: primary }}
                className="text-[9px] font-mono tracking-wider uppercase font-semibold"
              >
                PRO AUDIO
              </span>
              <h5 className="text-xs font-bold text-white leading-tight mt-0.5">
                {headline || 'Obsidian Monitors'}
              </h5>
              <div className="text-sm font-mono font-bold text-white mt-1">$549</div>
            </div>
            <button
              style={{
                backgroundColor: primary,
                borderRadius: `calc(${radius} / 2)`,
              }}
              className="py-1 px-2 text-[10px] font-semibold text-white mt-2 hover:opacity-90"
            >
              {btnText || 'Add to Bag'}
            </button>
          </div>
        </div>
      );

    case 'pricing-table':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f1f5f9' : bg }}
          className="w-full h-full min-h-[220px] p-3 flex gap-2 items-center justify-center overflow-hidden select-none"
        >
          {/* Card 1 */}
          <div className="flex-1 p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400">Basic</span>
            <div className="text-base font-bold font-mono text-white mt-0.5">$0</div>
            <div className="text-[9px] text-slate-500 my-1">Free forever</div>
            <div className="h-5 rounded bg-white/5 text-[9px] text-slate-300 flex items-center justify-center">
              Deploy
            </div>
          </div>
          {/* Card 2 Featured */}
          <div
            style={{
              borderColor: primary,
              boxShadow: `0 0 16px ${primary}25`,
            }}
            className="flex-1 p-2.5 rounded-lg bg-slate-900 border text-center scale-105 relative z-10"
          >
            <span
              style={{ color: primary }}
              className="text-[9px] font-bold uppercase tracking-wider block"
            >
              PRO TIER
            </span>
            <div className="text-lg font-extrabold font-mono text-white mt-0.5">
              $29<span className="text-[9px] text-slate-400 font-normal">/mo</span>
            </div>
            <div className="text-[9px] text-slate-400 my-1">Full code export</div>
            <button
              style={{
                backgroundColor: primary,
                borderRadius: `calc(${radius} / 2)`,
              }}
              className="w-full py-1 text-[9px] font-semibold text-white"
            >
              {btnText || 'Choose Pro'}
            </button>
          </div>
        </div>
      );

    case 'metrics-hub':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-white">
              {headline || 'MetricsStream Cluster'}
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
              Online
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-20 pt-4 px-1 border-b border-white/10">
            {[35, 55, 75, 45, 90, 65, 80, 95, 70, 85].map((val, idx) => (
              <div
                key={idx}
                style={{
                  height: `${val}%`,
                  backgroundColor: idx >= 7 ? primary : `${secondary}60`,
                }}
                className="flex-1 rounded-t-sm"
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1">
            <span>Throughput: 840 req/s</span>
            <span className="font-mono text-white">99.98% SLA</span>
          </div>
        </div>
      );

    case 'terminal-portfolio':
      return (
        <div
          style={{
            ...containerStyle,
            background: '#090a0f',
            fontFamily: "'JetBrains Mono', monospace",
          }}
          className="w-full h-full min-h-[220px] p-3 flex flex-col overflow-hidden select-none text-[10px]"
        >
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-slate-400 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-2 text-slate-500">alex@devcraft:~</span>
          </div>
          <div className="space-y-1 text-slate-300 flex-1 font-mono">
            <p>
              <span style={{ color: primary }}>$</span> whoami
            </p>
            <p className="text-slate-400 pl-3">Alex Chen · Staff Systems & UI Architect</p>
            <p>
              <span style={{ color: primary }}>$</span> stack --summary
            </p>
            <p className="text-slate-400 pl-3">[React, TypeScript, Rust, Tailwind, Postgres]</p>
            <p className="pt-1">
              <span style={{ color: primary }}>$</span> status: <span className="text-emerald-400">Available</span>
            </p>
          </div>
        </div>
      );

    case 'monochrome-agency':
      return (
        <div
          style={{ ...containerStyle, background: '#09090b' }}
          className="w-full h-full min-h-[220px] p-5 flex flex-col justify-between border border-white/10 select-none"
        >
          <div className="flex justify-between text-[9px] tracking-widest text-neutral-400 uppercase font-mono">
            <span>ATELIER</span>
            <span>EDITION 2026</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-white leading-tight tracking-tight">
              {headline || 'We Engineer Iconic Brands.'}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
              Architectural purity meets relentless motion craftsmanship.
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-800 flex justify-between items-center">
            <span className="text-[10px] text-neutral-300 font-medium">Tokyo · Berlin</span>
            <button className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded">
              {btnText || 'Contact'}
            </button>
          </div>
        </div>
      );

    case 'fluid-navbar':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-center overflow-hidden select-none"
        >
          <div className="w-full p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: primary }}
                className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-black"
              >
                U
              </div>
              <span className="text-xs font-bold text-white">UIverse</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-300 font-medium">
              <span style={{ color: primary }}>Explore</span>
              <span>Designs</span>
              <span>Pricing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-slate-400 font-mono">
                ⌘K
              </div>
              <button
                style={{
                  backgroundColor: primary,
                  borderRadius: `calc(${radius} / 2)`,
                }}
                className="px-2.5 py-1 text-[10px] font-semibold text-white"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      );

    case 'pro-sidebar':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3 flex gap-3 overflow-hidden select-none"
        >
          <div className="w-2/5 h-full rounded-lg bg-slate-900 border border-white/10 p-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <div
                  style={{ backgroundColor: primary }}
                  className="w-4 h-4 rounded text-[9px] font-bold text-white flex items-center justify-center"
                >
                  W
                </div>
                <span className="text-[10px] font-bold text-white truncate">UIverse Pro</span>
              </div>
              <div className="space-y-1 text-[9px]">
                <div className="p-1 rounded bg-white/10 text-white font-medium">Dashboard</div>
                <div className="p-1 text-slate-400">Deployments</div>
                <div className="p-1 text-slate-400">Analytics</div>
                <div className="p-1 text-slate-400">Settings</div>
              </div>
            </div>
            <div className="text-[8px] text-slate-500 font-mono">v2.4 Production</div>
          </div>
          <div className="flex-1 h-full rounded-lg bg-slate-900/40 border border-white/5 p-3 flex flex-col justify-center">
            <span className="text-[10px] text-slate-400">Workspace Canvas</span>
            <div className="text-xs font-bold text-white mt-1">Modular Application Rail</div>
            <span className="text-[9px] text-slate-500 mt-0.5">Foldable icon state supported</span>
          </div>
        </div>
      );

    case 'button-suite':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-center items-center gap-2.5 select-none"
        >
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-[260px]">
            <button
              style={{
                background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                borderRadius: radius,
              }}
              className="py-1.5 px-3 text-[10px] font-bold text-white shadow hover:scale-105 transition-transform"
            >
              Shimmer Wave
            </button>
            <button
              style={{
                borderColor: primary,
                color: primary,
                borderRadius: radius,
              }}
              className="py-1.5 px-3 text-[10px] font-bold border bg-transparent hover:bg-white/5 transition-colors"
            >
              Neon Glow
            </button>
            <button
              style={{ borderRadius: radius }}
              className="py-1.5 px-3 text-[10px] font-semibold text-slate-200 bg-white/10 border border-white/15 hover:bg-white/15"
            >
              Frosted Glass
            </button>
            <button
              style={{ borderRadius: radius }}
              className="py-1.5 px-3 text-[10px] font-semibold text-white bg-slate-800 border border-white/10 shadow hover:translate-y-[-1px]"
            >
              Tactile Press
            </button>
          </div>
        </div>
      );

    case 'bento-profile':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: primary }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md"
            >
              ER
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Elena Rostova</h5>
              <span className="text-[10px] text-slate-400">Design Systems Lead</span>
            </div>
            <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
              Available
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 my-2 text-center bg-white/[0.03] p-2 rounded-lg border border-white/5">
            <div>
              <span className="text-xs font-mono font-bold text-white">8+</span>
              <span className="text-[9px] text-slate-400 block">Years</span>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white">42</span>
              <span className="text-[9px] text-slate-400 block">Shipped</span>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white">99%</span>
              <span className="text-[9px] text-slate-400 block">CSAT</span>
            </div>
          </div>
          <button
            style={{
              backgroundColor: primary,
              borderRadius: `calc(${radius} / 2)`,
            }}
            className="w-full py-1 text-[10px] font-semibold text-white"
          >
            {btnText || 'Connect on UIverse'}
          </button>
        </div>
      );

    case 'testimonial-spotlight':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="text-amber-400 text-xs tracking-widest">★★★★★</div>
          <p className="text-[11px] text-slate-300 italic line-clamp-3 my-2 leading-relaxed">
            “UIverse Studio reduced our design sprint turnaround from two weeks to under four days.
            Clean, modular code.”
          </p>
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-white">
              MK
            </div>
            <div>
              <span className="text-[10px] font-bold text-white block">Marcus Keller</span>
              <span className="text-[8px] text-slate-400">VP Eng · FinTech Global</span>
            </div>
          </div>
        </div>
      );

    case 'inquiry-form':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between overflow-hidden select-none"
        >
          <div>
            <h5 className="text-xs font-bold text-white mb-2">
              {headline || 'Request Studio Proposal'}
            </h5>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <div className="h-6 px-2 bg-black/40 rounded border border-white/10 flex items-center text-[9px] text-slate-400">
                Full Name
              </div>
              <div className="h-6 px-2 bg-black/40 rounded border border-white/10 flex items-center text-[9px] text-slate-400">
                Work Email
              </div>
            </div>
            <div className="flex gap-1.5 mb-2">
              <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[8px]">
                Web App
              </span>
              <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded text-[8px]">
                Design System
              </span>
              <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded text-[8px]">
                Motion
              </span>
            </div>
          </div>
          <button
            style={{
              backgroundColor: primary,
              borderRadius: `calc(${radius} / 2)`,
            }}
            className="w-full py-1.5 text-[10px] font-semibold text-white"
          >
            {btnText || 'Send Request'}
          </button>
        </div>
      );

    case 'newsletter-form':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-center items-center text-center overflow-hidden select-none"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs mb-2">
            ✉
          </div>
          <h5 className="text-xs font-bold text-white mb-1">
            {headline || 'Weekly UIverse Digest'}
          </h5>
          <p className="text-[10px] text-slate-400 mb-3 max-w-[220px]">
            Curated components and architectures delivered weekly.
          </p>
          <div className="flex w-full max-w-[240px] p-1 bg-black/50 border border-white/10 rounded-lg">
            <input
              readOnly
              value="developer@company.com"
              className="bg-transparent px-2 text-[10px] text-slate-400 w-full outline-none"
            />
            <button
              style={{
                backgroundColor: primary,
                borderRadius: `calc(${radius} / 2)`,
              }}
              className="px-2.5 py-1 text-[9px] font-bold text-white shrink-0"
            >
              Join
            </button>
          </div>
        </div>
      );

    case 'masonry-gallery':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3 grid grid-cols-2 gap-2 overflow-hidden select-none"
        >
          <div className="rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 border border-white/10 p-2 flex items-end">
            <span className="text-[9px] text-white font-medium bg-black/60 px-1.5 py-0.5 rounded">
              Concrete
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-16 rounded-lg bg-gradient-to-b from-slate-800 to-slate-950 border border-white/10 p-2 flex items-end">
              <span className="text-[9px] text-slate-300 font-medium">Urban</span>
            </div>
            <div className="flex-1 rounded-lg bg-gradient-to-b from-slate-700 to-slate-800 border border-white/10 p-2 flex items-end">
              <span className="text-[9px] text-slate-300 font-medium">Glass</span>
            </div>
          </div>
        </div>
      );

    case 'kpi-deck':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3.5 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              EXECUTIVE KPI
            </span>
            <span className="text-[9px] text-emerald-400 font-mono">▲ 18.4%</span>
          </div>
          <div className="grid grid-cols-2 gap-2 my-1">
            <div className="p-2 rounded bg-white/[0.04] border border-white/5">
              <span className="text-[9px] text-slate-400">MRR</span>
              <div className="text-sm font-mono font-bold text-white">$184.2K</div>
            </div>
            <div className="p-2 rounded bg-white/[0.04] border border-white/5">
              <span className="text-[9px] text-slate-400">Retention</span>
              <div className="text-sm font-mono font-bold text-white">128.6%</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-white/5">
            <span>Quarterly Target: 104%</span>
            <span style={{ color: primary }} className="font-semibold">
              Full Deck →
            </span>
          </div>
        </div>
      );

    case 'chat-interface':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="text-[10px] font-bold text-white">#engineering</span>
            <span className="text-[8px] text-emerald-400">4 online</span>
          </div>
          <div className="space-y-1.5 my-2">
            <div className="flex gap-1.5 items-start">
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-[8px] font-bold text-white flex items-center justify-center shrink-0">
                SK
              </div>
              <div className="p-1.5 rounded-lg bg-white/10 text-[9px] text-slate-200 max-w-[180px]">
                Just verified ZIP generator package.
              </div>
            </div>
            <div className="flex justify-end">
              <div
                style={{ backgroundColor: primary }}
                className="p-1.5 rounded-lg text-[9px] text-white max-w-[180px]"
              >
                Awesome! Compiles perfectly.
              </div>
            </div>
          </div>
          <div className="h-6 bg-black/40 rounded border border-white/10 flex items-center px-2 text-[9px] text-slate-500">
            Write message...
          </div>
        </div>
      );

    case 'weather-dashboard':
      return (
        <div
          style={{
            ...containerStyle,
            background: `radial-gradient(circle at 80% 20%, ${secondary}30, #0c0e17)`,
          }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400">San Francisco, CA</span>
              <div className="text-2xl font-mono font-bold text-white mt-1">68°F</div>
            </div>
            <span className="text-2xl">☀️</span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-2 rounded-lg bg-black/30 text-center text-[9px]">
            <div>
              <span className="text-slate-400 block">Humidity</span>
              <span className="text-white font-mono font-bold">42%</span>
            </div>
            <div>
              <span className="text-slate-400 block">UV Index</span>
              <span className="text-white font-mono font-bold">2 Low</span>
            </div>
            <div>
              <span className="text-slate-400 block">Air Quality</span>
              <span className="text-emerald-400 font-mono font-bold">24 Pure</span>
            </div>
          </div>
        </div>
      );

    case 'expense-tracker':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3.5 flex flex-col justify-between overflow-hidden select-none"
        >
          <div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Total Liquidity</span>
              <span className="font-mono text-emerald-400">+4.2%</span>
            </div>
            <div className="text-lg font-mono font-bold text-white mt-0.5">$84,320.50</div>
          </div>
          <div className="space-y-1.5 my-1 text-[9px] border-t border-white/5 pt-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Stripe Payout</span>
              <span className="text-emerald-400 font-mono">+$3,400.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>AWS Cloud Infra</span>
              <span className="text-slate-400 font-mono">-$342.18</span>
            </div>
          </div>
          <button
            style={{
              backgroundColor: primary,
              borderRadius: `calc(${radius} / 2)`,
            }}
            className="w-full py-1 text-[10px] font-semibold text-white"
          >
            {btnText || 'Transfer Funds'}
          </button>
        </div>
      );

    case 'course-cards':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] flex flex-col justify-between overflow-hidden select-none border border-white/10"
        >
          <div className="h-20 bg-gradient-to-r from-indigo-900 to-slate-900 p-2.5 flex items-end justify-between">
            <span className="text-[9px] px-2 py-0.5 rounded bg-black/60 text-cyan-300 font-mono">
              12 Modules
            </span>
            <span className="text-[9px] text-slate-300">Advanced</span>
          </div>
          <div className="p-3">
            <h5 className="text-xs font-bold text-white mb-1.5 leading-snug">
              Distributed Systems & Raft
            </h5>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
              <div style={{ backgroundColor: primary, width: '65%' }} className="h-full" />
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 mb-2">
              <span>65% Finished</span>
              <span>4.5 hrs left</span>
            </div>
            <button
              style={{
                backgroundColor: primary,
                borderRadius: `calc(${radius} / 2)`,
              }}
              className="w-full py-1 text-[10px] font-semibold text-white"
            >
              Resume Lesson
            </button>
          </div>
        </div>
      );

    case 'checkout-sheet':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3.5 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-bold text-white">SwiftPay Order</h5>
            <span className="text-[9px] text-emerald-400 font-mono">🔒 256-bit</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-white/5 flex justify-between items-center text-[10px]">
            <span className="text-slate-300">UIverse Full Access</span>
            <span className="font-mono font-bold text-white">$289.00</span>
          </div>
          <div className="h-6 px-2 bg-black/40 rounded border border-white/10 flex items-center text-[9px] text-slate-400 font-mono">
            4242 •••• •••• 4242
          </div>
          <button
            style={{
              backgroundColor: primary,
              borderRadius: `calc(${radius} / 2)`,
            }}
            className="w-full py-1 text-[10px] font-semibold text-white"
          >
            {btnText || 'Pay $289.00 Securely'}
          </button>
        </div>
      );

    case 'magicui-retro-grid-hero':
      return (
        <div
          style={{ ...containerStyle, background: '#030712' }}
          className="relative w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 text-center overflow-hidden select-none"
        >
          {/* 3D Perspective Grid */}
          <div
            style={{
              backgroundImage: `linear-gradient(to right, ${primary}30 1px, transparent 1px), linear-gradient(to bottom, ${primary}30 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              transform: 'perspective(160px) rotateX(60deg) translateY(-10%)',
            }}
            className="absolute inset-0 w-full h-[180%] origin-bottom opacity-70 pointer-events-none"
          />
          {/* Horizon sunburst glow */}
          <div
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${primary}90, ${secondary}60, transparent 70%)`,
            }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-20 blur-xl opacity-60 pointer-events-none"
          />
          <div className="relative z-10 max-w-[280px]">
            <span
              style={{ color: secondary }}
              className="text-[9px] font-mono tracking-widest uppercase font-bold px-2 py-0.5 rounded bg-black/60 border border-white/10"
            >
              MAGICUI RETRO GRID
            </span>
            <h4 className="text-xs font-extrabold text-white mt-1.5 mb-1 leading-tight">
              {headline || 'Retro Grid Horizon Engine'}
            </h4>
            <p className="text-[10px] text-slate-300 line-clamp-2 mb-2.5">
              Infinite moving wireframe floor towards a chromatic horizon.
            </p>
            <button
              style={getBtnStyle(radius, { padding: '6px 14px', fontSize: '11px', fontWeight: 700 })}
              className="text-[10px] font-bold shadow hover:brightness-110 transition-all"
            >
              {btnText || 'Deploy Retro Grid'}
            </button>
          </div>
        </div>
      );

    case 'unlumen-neural-beam-hero':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : '#07090e' }}
          className="relative w-full h-full min-h-[220px] flex items-center justify-center p-3 overflow-hidden select-none"
        >
          {/* Animated SVG Conduit Beams */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 300 180">
            <path d="M 50 40 Q 150 40 150 90" stroke={`${primary}50`} strokeWidth="1.5" fill="none" />
            <path d="M 50 140 Q 150 140 150 90" stroke={`${secondary}50`} strokeWidth="1.5" fill="none" />
            <path d="M 250 40 Q 150 40 150 90" stroke={`${primary}50`} strokeWidth="1.5" fill="none" />
            <path d="M 250 140 Q 150 140 150 90" stroke={`${secondary}50`} strokeWidth="1.5" fill="none" />
            {/* Pulsing light sparks on paths */}
            <circle cx="100" cy="52" r="3" fill={primary} />
            <circle cx="100" cy="128" r="3" fill={secondary} />
            <circle cx="200" cy="52" r="3" fill={primary} />
            <circle cx="200" cy="128" r="3" fill={secondary} />
          </svg>

          {/* Central Neural Hub */}
          <div
            style={{
              borderColor: primary,
              boxShadow: `0 0 25px ${primary}50`,
            }}
            className="w-16 h-16 rounded-full bg-slate-950 border-2 flex flex-col items-center justify-center z-10 text-center"
          >
            <span className="text-[8px] font-mono font-bold text-white tracking-wider">NEURAL</span>
            <span style={{ color: secondary }} className="text-[7px] font-mono">
              CLUSTER
            </span>
          </div>

          {/* Satellite Nodes */}
          <span className="absolute top-4 left-4 px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-[9px] font-mono text-slate-300">
            Postgres
          </span>
          <span className="absolute bottom-4 left-4 px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-[9px] font-mono text-slate-300">
            Stripe
          </span>
          <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-[9px] font-mono text-slate-300">
            OpenAI
          </span>
          <span className="absolute bottom-4 right-4 px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-[9px] font-mono text-slate-300">
            VectorDB
          </span>
        </div>
      );

    case 'magicui-meteor-spatial-hero':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : '#08090f' }}
          className="relative w-full h-full min-h-[220px] flex items-center justify-center p-4 overflow-hidden select-none"
        >
          {/* Diagonal falling meteors */}
          <div className="absolute top-1 left-1/4 w-0.5 h-12 bg-gradient-to-b from-sky-400 to-transparent rotate-[-45deg] opacity-75" />
          <div className="absolute top-6 right-1/4 w-0.5 h-16 bg-gradient-to-b from-indigo-400 to-transparent rotate-[-45deg] opacity-60" />
          <div className="absolute bottom-10 left-12 w-0.5 h-10 bg-gradient-to-b from-cyan-400 to-transparent rotate-[-45deg] opacity-70" />

          <div
            style={{ borderRadius: radius, boxShadow: getShadow() }}
            className="relative z-10 w-full max-w-[280px] p-3.5 bg-slate-900/70 backdrop-blur-md border border-white/10 text-center shadow-2xl"
          >
            <span className="text-[9px] font-mono uppercase font-bold text-sky-400 tracking-wider">
              MAGICUI METEOR STREAM
            </span>
            <h4 className="text-xs font-bold text-white mt-1 mb-1">
              {headline || 'Build at the Speed of Light'}
            </h4>
            <p className="text-[10px] text-slate-400 line-clamp-2 mb-2.5">
              Cascading ambient spatial particles with zero runtime performance cost.
            </p>
            <button
              style={getBtnStyle(undefined, { padding: '6px 12px', width: '100%' })}
              className="w-full text-[10px] font-semibold"
            >
              {btnText || 'Start Experience'}
            </button>
          </div>
        </div>
      );

    case 'stitch-morph-hero':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between overflow-hidden select-none"
        >
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-full w-max border border-white/10">
            <span
              style={{ backgroundColor: primary }}
              className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold text-white shadow-sm"
            >
              Overview
            </span>
            <span className="px-2 py-0.5 text-[9px] font-medium text-slate-400">Physics</span>
            <span className="px-2 py-0.5 text-[9px] font-medium text-slate-400">Stitch</span>
          </div>

          <div className="my-2">
            <h4 className="text-xs font-bold text-white leading-tight">
              {headline || 'Elastic Tactility for Everyday Web'}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
              Google Stitch inspired dynamic elasticity with responsive spring physics.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-medium">
              Haptic
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-medium">
              Spring
            </span>
            <button
              style={{
                backgroundColor: primary,
                borderRadius: `calc(${radius} / 2)`,
              }}
              className="ml-auto px-2.5 py-1 text-[10px] font-semibold text-white"
            >
              {btnText || 'Inspect'}
            </button>
          </div>
        </div>
      );

    case 'magicui-border-beam-button':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : bg }}
          className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 text-center select-none"
        >
          <div className="relative group p-0.5 rounded-full overflow-hidden">
            {/* Conic rotating beam */}
            <div
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg 280deg, ${primary} 320deg, ${secondary} 360deg)`,
                animationDuration: spinDuration,
              }}
              className="absolute inset-[-4px] rounded-full animate-spin"
            />
            <button
              style={getBtnStyle(radius, {
                padding: '10px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isLight ? '#ffffff' : '#11131c',
                color: isLight ? '#0f172a' : '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
              })}
              className="relative rounded-full text-xs font-bold shadow-xl flex items-center gap-2 hover:brightness-110 transition-colors"
            >
              <span>{btnText || 'Explore MagicUI Beam'}</span>
              <span style={{ color: secondary }} className="text-xs">
                ✦
              </span>
            </button>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-3">
            Pure CSS rotating border beam highlight
          </span>
        </div>
      );

    case 'stitch-tactile-ripple-button':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : bg }}
          className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 text-center select-none"
        >
          <button
            style={getBtnStyle(radius, {
              padding: '12px 24px',
              fontSize: '12px',
              fontWeight: 700,
            })}
            className="relative overflow-hidden text-xs font-bold shadow-lg active:scale-95 transition-transform"
          >
            {/* Ripple ring illustration */}
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-12 h-12 rounded-full border border-white/30 animate-ping opacity-30" />
            </span>
            <span className="relative z-10">{btnText || 'Press for Tactile Ripple'}</span>
          </button>
          <span className="text-[10px] text-slate-400 mt-3">
            Google Stitch organic ink-spread ripple physics
          </span>
        </div>
      );

    case 'unlumen-liquid-capsule-button':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : bg }}
          className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 text-center select-none"
        >
          <button
            style={getBtnStyle('9999px', {
              padding: '12px 26px',
              fontSize: '12px',
              fontWeight: 800,
              background: buttonStyle === 'outline'
                ? 'transparent'
                : buttonStyle === 'glass'
                ? `${primary}25`
                : `linear-gradient(135deg, ${primary}, #8b5cf6, ${secondary})`,
              boxShadow: `0 0 24px ${primary}50`,
            })}
            className="text-xs font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>{btnText || 'Activate Fluid Core'}</span>
            <span className="text-xs">✦</span>
          </button>
          <span className="text-[10px] text-slate-400 mt-3">
            UnlumenUI chromatic fluid radial gradient
          </span>
        </div>
      );

    case 'cyber-bevel-arcade-button':
      return (
        <div
          style={{ ...containerStyle, background: isLight ? '#f8fafc' : bg }}
          className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 text-center select-none"
        >
          <div className="bg-emerald-950/80 rounded-lg p-0 pb-1.5 inline-block">
            <button
              style={getBtnStyle(radius, {
                fontFamily: "'JetBrains Mono', monospace",
                padding: '10px 20px',
                fontWeight: 900,
              })}
              className="font-mono text-xs active:translate-y-1 transition-transform border border-emerald-300"
            >
              {btnText || 'FIRE_TRIGGER [SPACE]'}
            </button>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-3">
            Neo-Arcade mechanical dimensional press
          </span>
        </div>
      );

    case 'stitch-animated-morph-icons':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3 flex flex-col justify-center select-none"
        >
          <div className="grid grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center hover:border-violet-500 transition-colors">
              <span className="text-base text-violet-400 mb-1">🔍</span>
              <span className="text-[8px] font-mono text-slate-400">Search/X</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center hover:border-violet-500 transition-colors">
              <span className="text-base text-cyan-400 mb-1">▶</span>
              <span className="text-[8px] font-mono text-slate-400">Play/Pause</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center hover:border-violet-500 transition-colors">
              <span className="text-base text-amber-400 mb-1">☰</span>
              <span className="text-[8px] font-mono text-slate-400">Menu/Back</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center hover:border-violet-500 transition-colors">
              <span className="text-base text-emerald-400 mb-1">📋</span>
              <span className="text-[8px] font-mono text-slate-400">Copy/Check</span>
            </div>
          </div>
          <span className="text-[10px] text-center text-slate-400 mt-2 font-mono">
            Google Stitch SVG path morphing suite
          </span>
        </div>
      );

    case 'holographic-3d-icons':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-3 flex flex-col justify-center select-none"
        >
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '✦', label: 'AI Core', color: primary },
              { icon: '⬡', label: 'DB Mesh', color: secondary },
              { icon: '⚡', label: 'Compute', color: '#f59e0b' },
              { icon: '🛡', label: 'Secure', color: '#10b981' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  style={{
                    boxShadow: `0 8px 20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3)`,
                  }}
                  className="w-11 h-11 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center text-base hover:scale-110 hover:-rotate-3 transition-transform text-white"
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <span className="text-[9px] text-slate-300 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <span className="text-[10px] text-center text-slate-400 mt-2">
            Unlumen 3D frosted prismatic insignias
          </span>
        </div>
      );

    case 'radar-telemetry-icons':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col justify-center items-center gap-3 select-none"
        >
          <div className="flex flex-col gap-2 w-full max-w-[240px]">
            <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>LIVE_STREAM // 840 req/s</span>
            </div>
            <div className="flex items-center gap-2.5 p-1.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
              </span>
              <span>SATELLITE // 99.98%</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Concentric pulse wave telemetry badges
          </span>
        </div>
      );

    case 'magicui-fluid-dock':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 select-none"
        >
          <div className="flex items-end gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-2xl">
            {['📁', '⚡', '⌘', '🌐', '⚙'].map((ico, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm cursor-pointer hover:scale-135 hover:-translate-y-2 transition-transform duration-150"
              >
                {ico}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 mt-3 font-mono">
            MagicUI macOS spring dynamic magnification dock
          </span>
        </div>
      );

    case 'magicui-velocity-marquee':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] flex flex-col justify-center overflow-hidden p-3 select-none"
        >
          <div className="relative overflow-hidden py-2 border-y border-white/10">
            <div className="flex gap-2 w-max animate-pulse">
              {['React 19', 'Next.js', 'Tailwind v4', 'TypeScript', 'Vite', 'Supabase'].map(
                (item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-200"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
          <span className="text-[10px] text-center text-slate-400 mt-3 font-mono">
            MagicUI continuous velocity marquee ticker
          </span>
        </div>
      );

    case 'unlumen-spotlight-bento':
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex items-center justify-center select-none"
        >
          <div
            style={{
              borderRadius: radius,
              background: `radial-gradient(circle at 60% 40%, ${primary}30, #111420)`,
            }}
            className="w-full max-w-[280px] p-4 border border-white/15 shadow-xl relative overflow-hidden"
          >
            <span
              style={{ color: primary }}
              className="text-[9px] font-mono uppercase tracking-wider font-bold block mb-1"
            >
              UNLUMEN SPOTLIGHT
            </span>
            <h4 className="text-xs font-bold text-white mb-1">
              {headline || 'Intelligent Code Synthesis'}
            </h4>
            <p className="text-[10px] text-slate-300 line-clamp-2">
              Radial cursor-tracking highlights reveal hairline card borders.
            </p>
          </div>
        </div>
      );

    case 'baby-tears-pipe-loader':
      return (
        <BabyTearsPipeLoader
          containerStyle={containerStyle}
          bg={bg}
          primary={primary}
          secondary={secondary}
          radius={radius}
          animationSpeed={animationSpeed}
          headline={headline}
        />
      );

    case 'running-man-loader':
      return (
        <RunningManLoader
          containerStyle={containerStyle}
          bg={bg}
          primary={primary}
          secondary={secondary}
          radius={radius}
          animationSpeed={animationSpeed}
          headline={headline}
        />
      );

    case 'celestial-day-night-toggle':
      return (
        <CelestialToggle
          containerStyle={containerStyle}
          bg={bg}
          primary={primary}
          secondary={secondary}
          radius={radius}
          animationSpeed={animationSpeed}
          headline={headline}
        />
      );

    case 'cyber-voltage-toggle':
      return (
        <CyberVoltageToggle
          containerStyle={containerStyle}
          bg={bg}
          primary={primary}
          secondary={secondary}
          radius={radius}
          animationSpeed={animationSpeed}
          headline={headline}
        />
      );

    case 'viscous-slime-morph-toggle':
      return (
        <ViscousSlimeToggle
          containerStyle={containerStyle}
          bg={bg}
          primary={primary}
          secondary={secondary}
          radius={radius}
          animationSpeed={animationSpeed}
          headline={headline}
        />
      );

    default:
      return (
        <div
          style={{ ...containerStyle, background: bg }}
          className="w-full h-full min-h-[220px] p-4 flex flex-col items-center justify-center text-center select-none"
        >
          <span style={{ color: primary }} className="text-xs font-bold mb-1">
            UIverse Template
          </span>
          <h4 className="text-sm font-semibold text-white">{headline || 'Design Preview'}</h4>
        </div>
      );
  }
};

/* =========================================================================
   CRAZY CREATIVE RENDERERS & BLENDER 3D HYDRAULIC LOADER
   ========================================================================= */

interface SubRendererProps {
  containerStyle: React.CSSProperties;
  bg: string;
  primary: string;
  secondary: string;
  radius: string;
  animationSpeed: string;
  headline?: string;
}

/**
 * 1. Blender 3D Baby Tears Hydraulic Pipe Loader
 * Expressive crying baby face with tear cascades filling a calibrated hydraulic pipe
 */
const BabyTearsPipeLoader: React.FC<SubRendererProps> = ({
  containerStyle,
  bg,
  primary,
  secondary,
  radius,
  headline,
}) => {
  const [fillPercent, setFillPercent] = useState(76);
  const [isTurbo, setIsTurbo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFillPercent((prev) => {
        const step = isTurbo ? 3 : 1;
        const next = prev + step;
        return next > 98 ? 25 : next;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [isTurbo]);

  return (
    <div
      style={{ ...containerStyle, background: bg }}
      onClick={() => setIsTurbo((prev) => !prev)}
      className="w-full h-full min-h-[250px] p-4 flex flex-col items-center justify-center select-none cursor-pointer relative overflow-hidden group"
      title="Click to toggle Turbo Cry / Pressure Flush!"
    >
      {/* Background soft hydraulic ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[70px] pointer-events-none opacity-30"
        style={{ background: `radial-gradient(circle, ${primary}, ${secondary} 70%, transparent)` }}
      />

      {/* Main Hydraulic Stage */}
      <div className="relative z-10 flex items-center justify-center gap-6 w-full max-w-sm">
        {/* Left: Blender 3D-styled Cartoon Crying Baby Head */}
        <div className="flex flex-col items-center">
          {/* Baby Face Head with 3D Spherical Shading */}
          <div
            className="relative w-20 h-20 rounded-full shadow-2xl flex flex-col items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ffedd5 0%, #fed7aa 40%, #fb923c 85%, #c2410c 100%)',
              boxShadow: 'inset -3px -4px 8px rgba(0,0,0,0.3), 0 10px 25px rgba(251,146,60,0.35)',
              animation: isTurbo ? 'cryTremble 0.1s infinite alternate' : 'cryTremble 0.22s infinite alternate',
            }}
          >
            {/* Baby Hair Tuft */}
            <div
              className="absolute -top-2 w-4 h-5 rounded-full"
              style={{
                background: '#ea580c',
                transform: 'rotate(-20deg)',
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.4)',
              }}
            />

            {/* Furrowed Brow Expressions */}
            <div className="flex gap-4 mb-0.5">
              <span className="w-3.5 h-1 bg-amber-900 rounded-full transform rotate-12" />
              <span className="w-3.5 h-1 bg-amber-900 rounded-full transform -rotate-12" />
            </div>

            {/* Crying Squeezed Eyes with Tear Fountains */}
            <div className="flex gap-5 items-center relative">
              {/* Left Eye */}
              <div className="relative">
                <span className="block text-amber-950 font-black text-xs leading-none">＞</span>
                {/* Tear Stream Erupting */}
                <div
                  className="absolute -bottom-2 -left-1 w-2.5 h-7 rounded-full opacity-90 animate-pulse pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, #ffffff, ${primary})`,
                    boxShadow: `0 0 8px ${primary}`,
                  }}
                />
              </div>

              {/* Right Eye */}
              <div className="relative">
                <span className="block text-amber-950 font-black text-xs leading-none">＜</span>
                {/* Tear Stream Erupting */}
                <div
                  className="absolute -bottom-2 -right-1 w-2.5 h-7 rounded-full opacity-90 animate-pulse pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, #ffffff, ${primary})`,
                    boxShadow: `0 0 8px ${primary}`,
                  }}
                />
              </div>
            </div>

            {/* Rosy Chubby Cheeks */}
            <div className="absolute top-11 flex justify-between w-14">
              <div className="w-3.5 h-2 rounded-full bg-rose-500/40 blur-[1px]" />
              <div className="w-3.5 h-2 rounded-full bg-rose-500/40 blur-[1px]" />
            </div>

            {/* Open Crying Mouth / Sobbing Wailing */}
            <div
              className="mt-2.5 w-6 h-5 rounded-b-full bg-rose-950 border border-rose-900 relative overflow-hidden flex items-end justify-center shadow-inner"
              style={{
                animation: 'mouthWail 0.4s ease-in-out infinite alternate',
              }}
            >
              <div className="w-3.5 h-2 rounded-t-full bg-rose-500 mb-0.5" />
            </div>
          </div>

          {/* Baby Label */}
          <span className="text-[10px] font-mono text-cyan-300 font-bold mt-2 tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {isTurbo ? 'TURBO WAILING' : 'TEARS JET: ACTIVE'}
          </span>
        </div>

        {/* Center: Conduit Pipe Feeding Tears into Reservoir */}
        <div className="relative flex flex-col items-center">
          {/* Animated Falling Droplets Pipe Bridge */}
          <div className="w-10 h-1 border-t-2 border-dashed border-cyan-400/60 relative">
            <div
              className="absolute -top-1 w-2 h-2 rounded-full bg-cyan-300 shadow-md animate-ping"
              style={{ left: '40%' }}
            />
          </div>
          <span className="text-[9px] font-mono text-slate-500 tracking-tighter uppercase mt-0.5">
            CONDUIT
          </span>
        </div>

        {/* Right: The Calibrated Industrial Glass Hydraulic Pipe */}
        <div className="flex flex-col items-center">
          <div
            className="relative w-14 h-40 rounded-full border-2 border-cyan-400/50 p-1 flex flex-col justify-end overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.12))',
              boxShadow: `inset 0 0 15px rgba(6,182,212,0.25), 0 0 25px ${primary}40`,
            }}
          >
            {/* Glass Specular Reflection Highlight */}
            <div className="absolute top-0 left-1 w-1.5 h-full bg-white/20 rounded-full pointer-events-none" />

            {/* Measurement Ticks & Scale Markers on the Pipe */}
            <div className="absolute inset-y-2 right-1.5 flex flex-col justify-between text-[7px] font-mono text-cyan-300/80 pointer-events-none select-none z-20">
              <span className="border-b border-cyan-400/60 pb-0.5 font-bold">100%</span>
              <span className="border-b border-cyan-400/40 pb-0.5">75%</span>
              <span className="border-b border-cyan-400/40 pb-0.5">50%</span>
              <span className="border-b border-cyan-400/40 pb-0.5">25%</span>
              <span className="border-b border-cyan-400/30 pb-0.5">0%</span>
            </div>

            {/* Dynamic Liquid Fill with Hydrodynamic Wave */}
            <div
              className="w-full relative rounded-b-full transition-all duration-300 flex flex-col justify-start overflow-hidden"
              style={{
                height: `${fillPercent}%`,
                background: `linear-gradient(to top, #0284c7 0%, ${primary} 70%, #67e8f9 100%)`,
                boxShadow: `0 0 16px ${primary}`,
              }}
            >
              {/* Animated Liquid Surface Wave */}
              <div
                className="w-full h-2 rounded-full opacity-80"
                style={{
                  background: 'radial-gradient(ellipse at 50% 50%, #ffffff, transparent 75%)',
                  animation: 'waveBob 0.6s ease-in-out infinite alternate',
                }}
              />

              {/* Bubbles Rising inside the Fluid */}
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce"
                style={{ left: '25%', bottom: '20%' }}
              />
              <div
                className="absolute w-2 h-2 rounded-full bg-white/70 animate-pulse"
                style={{ left: '60%', bottom: '45%' }}
              />
            </div>
          </div>

          {/* Digital Telemetry Gauge */}
          <div className="mt-2 text-center">
            <span className="text-xs font-mono font-black text-cyan-300 tracking-tight block">
              {fillPercent}% FILLED
            </span>
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tighter">
              HYDRAULIC LOAD
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive HUD Bar */}
      <div className="relative z-10 mt-3 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 flex items-center gap-2 text-[10px] font-mono text-slate-300 shadow">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-cyan-300 font-bold">{headline || 'Baby Cry Hydraulics'}</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400 group-hover:text-cyan-300 transition-colors">
          Click to Flush / Burst
        </span>
      </div>

      {/* Embedded CSS for Crying & Wave Physics */}
      <style>{`
        @keyframes cryTremble {
          0% { transform: translateY(0px) rotate(-1.5deg); }
          100% { transform: translateY(-3px) rotate(1.5deg); }
        }
        @keyframes mouthWail {
          0% { height: 16px; border-radius: 0 0 12px 12px; }
          100% { height: 24px; border-radius: 0 0 16px 16px; }
        }
        @keyframes waveBob {
          0% { transform: scaleX(0.9) translateY(0px); }
          100% { transform: scaleX(1.1) translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

/**
 * 2. Kinetic Sprint Runner Loader
 * Athletic neon runner silhouette on moving conveyor track with speed lines & telemetry
 */
const RunningManLoader: React.FC<SubRendererProps> = ({
  containerStyle,
  bg,
  primary,
  secondary,
  headline,
}) => {
  const [isTurbo, setIsTurbo] = useState(false);
  const [progress, setProgress] = useState(84);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 99 ? 20 : prev + 1));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{ ...containerStyle, background: bg }}
      onClick={() => setIsTurbo((prev) => !prev)}
      className="w-full h-full min-h-[250px] p-4 flex flex-col items-center justify-center select-none cursor-pointer relative overflow-hidden group"
      title="Click to toggle Super Sprint Turbo!"
    >
      {/* Dynamic Runner Stage */}
      <div className="relative w-full max-w-[280px] h-36 flex flex-col items-center justify-center">
        {/* Speed Wind Streaks */}
        <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-40">
          <div
            className="h-[1px] w-24 bg-gradient-to-l from-emerald-400 to-transparent"
            style={{ animation: 'windStreak 0.4s linear infinite', marginLeft: 'auto' }}
          />
          <div
            className="h-[1.5px] w-36 bg-gradient-to-l from-cyan-400 to-transparent"
            style={{ animation: 'windStreak 0.3s linear infinite 0.1s', marginLeft: 'auto' }}
          />
          <div
            className="h-[1px] w-20 bg-gradient-to-l from-emerald-300 to-transparent"
            style={{ animation: 'windStreak 0.5s linear infinite 0.2s', marginLeft: 'auto' }}
          />
        </div>

        {/* Biomechanical Athletic Silhouette Sprinter (SVG) */}
        <div
          className="relative z-10"
          style={{
            animation: isTurbo ? 'bobRun 0.18s ease-in-out infinite alternate' : 'bobRun 0.32s ease-in-out infinite alternate',
          }}
        >
          <svg
            width="80"
            height="85"
            viewBox="0 0 100 110"
            fill="none"
            className="filter drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]"
          >
            {/* Runner Head with aerodynamic tilt */}
            <circle cx="68" cy="22" r="10" fill={primary} />
            <path d="M64 22L76 22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

            {/* Runner Torso tilted in forward sprint */}
            <path d="M63 30L45 58" stroke={primary} strokeWidth="8" strokeLinecap="round" />

            {/* Left Arm Pumping Back */}
            <path
              d="M58 35L75 48L85 40"
              stroke={secondary}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isTurbo ? 'animate-pulse' : ''}
            />

            {/* Right Arm Driving Forward */}
            <path
              d="M58 35L38 42L25 55"
              stroke={primary}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Left High Driving Knee & Foot */}
            <path
              d="M45 58L65 72L50 92"
              stroke={primary}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Trailing Leg in Extension */}
            <path
              d="M45 58L22 75L12 94"
              stroke={secondary}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Ground Dust Puff */}
            <circle cx="20" cy="98" r="3" fill="#ffffff" opacity="0.6" />
            <circle cx="12" cy="100" r="2" fill="#ffffff" opacity="0.4" />
          </svg>
        </div>

        {/* Endless Conveyor Treadmill Track */}
        <div className="relative w-full h-4 bg-slate-900 border-t-2 border-emerald-500/80 mt-1 overflow-hidden rounded-full shadow-lg">
          <div
            className="w-[200%] h-full flex items-center"
            style={{
              animation: isTurbo ? 'conveyTrack 0.3s linear infinite' : 'conveyTrack 0.6s linear infinite',
            }}
          >
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="w-4 h-1.5 bg-emerald-400 mx-2 rounded-full shrink-0 shadow-sm shadow-emerald-400"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Telemetry & Metrics HUD */}
      <div className="mt-3 flex items-center justify-between w-full max-w-[280px] px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{isTurbo ? '42.0 KM/H' : '28.5 KM/H'}</span>
        </div>
        <div className="text-slate-300 font-bold">
          <span>PROGRESS: {progress}%</span>
        </div>
        <span className="text-[10px] text-cyan-400">194 SPM</span>
      </div>

      <style>{`
        @keyframes bobRun {
          0% { transform: translateY(0px) rotate(1deg); }
          100% { transform: translateY(-7px) rotate(-1deg); }
        }
        @keyframes conveyTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes windStreak {
          0% { transform: translateX(20px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(-80px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * 3. Eclipse Orbit Celestial Day/Night Toggle
 * Seamless day/night state morphing with rotating corona, celestial craters & stars
 */
const CelestialToggle: React.FC<SubRendererProps> = ({
  containerStyle,
  bg,
  headline,
}) => {
  const [isNight, setIsNight] = useState(false);

  return (
    <div
      style={{ ...containerStyle, background: bg }}
      onClick={() => setIsNight((prev) => !prev)}
      className="w-full h-full min-h-[250px] p-4 flex flex-col items-center justify-center select-none cursor-pointer relative overflow-hidden group"
      title="Click to toggle Celestial Day / Night!"
    >
      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-3 tracking-wider">
        {isNight ? '✦ LUNAR ECLIPSE (NIGHT)' : '☀ SOLAR CORONA (DAY)'}
      </span>

      {/* Celestial Pill Track */}
      <div
        className="relative w-36 h-18 rounded-full p-2 border-2 transition-all duration-500 flex items-center shadow-2xl cursor-pointer"
        style={{
          background: isNight
            ? 'linear-gradient(135deg, #090a18 0%, #1e1b4b 60%, #312e81 100%)'
            : 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #fef08a 100%)',
          borderColor: isNight ? '#818cf8' : '#fde047',
          boxShadow: isNight ? '0 0 30px rgba(99,102,241,0.4)' : '0 0 30px rgba(251,191,36,0.5)',
        }}
      >
        {/* Night Stars Background */}
        <div
          className={`absolute inset-0 p-2 overflow-hidden transition-opacity duration-500 pointer-events-none ${
            isNight ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="absolute top-2 left-6 text-white text-[8px] animate-ping">✦</span>
          <span className="absolute bottom-3 left-10 text-cyan-300 text-[6px] animate-pulse">✦</span>
          <span className="absolute top-4 left-14 text-indigo-300 text-[9px] animate-ping">★</span>
          <span className="absolute bottom-2 left-4 text-violet-200 text-[7px] animate-pulse">✦</span>
        </div>

        {/* Day Clouds Background */}
        <div
          className={`absolute inset-0 p-2 overflow-hidden transition-opacity duration-500 pointer-events-none ${
            isNight ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="absolute right-4 top-3 w-8 h-3 rounded-full bg-white/70 blur-[1px]" />
          <div className="absolute right-8 bottom-3 w-10 h-3 rounded-full bg-white/50 blur-[1px]" />
        </div>

        {/* Sliding Celestial Orb (Sun morphs to Moon) */}
        <div
          className="relative w-14 h-14 rounded-full transition-all duration-500 ease-out flex items-center justify-center shadow-2xl"
          style={{
            transform: isNight ? 'translateX(72px)' : 'translateX(0px)',
            background: isNight
              ? 'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #94a3b8 70%, #475569 100%)'
              : 'radial-gradient(circle at 35% 35%, #fffbeb 0%, #fbbf24 60%, #d97706 100%)',
            boxShadow: isNight
              ? 'inset -2px -2px 5px rgba(0,0,0,0.4), 0 0 20px #e2e8f0'
              : '0 0 25px #f59e0b, 0 0 50px rgba(245,158,11,0.5)',
          }}
        >
          {/* Day: Rotating Solar Corona Rays */}
          {!isNight && (
            <div
              className="absolute inset-[-6px] rounded-full border border-amber-300/40 border-dashed"
              style={{ animation: 'spinSun 8s linear infinite' }}
            />
          )}

          {/* Night: Realistic Lunar Craters */}
          {isNight && (
            <>
              <div className="absolute top-2.5 left-3 w-3 h-3 rounded-full bg-slate-500/50 shadow-inner" />
              <div className="absolute bottom-3 left-4 w-2 h-2 rounded-full bg-slate-500/40 shadow-inner" />
              <div className="absolute top-5 right-2.5 w-3.5 h-3.5 rounded-full bg-slate-500/60 shadow-inner" />
            </>
          )}
        </div>
      </div>

      <div className="mt-3 text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors">
        Click to Orbit Celestial Sphere
      </div>

      <style>{`
        @keyframes spinSun {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * 4. Cyberpunk Arc Knife-Switch Toggle
 * Heavy industrial breaker lever with crackling plasma electric spark discharge
 */
const CyberVoltageToggle: React.FC<SubRendererProps> = ({
  containerStyle,
  bg,
  primary,
  secondary,
  headline,
}) => {
  const [isEngaged, setIsEngaged] = useState(true);

  return (
    <div
      style={{ ...containerStyle, background: bg }}
      onClick={() => setIsEngaged((prev) => !prev)}
      className="w-full h-full min-h-[250px] p-4 flex flex-col items-center justify-center select-none cursor-pointer relative overflow-hidden group"
      title="Click to pull the High-Voltage Knife Switch!"
    >
      <div className="relative w-64 p-4 rounded-xl bg-[#0c0f17] border-2 border-emerald-500/60 shadow-2xl flex flex-col items-center">
        {/* Caution Hazard Stripes Border Top */}
        <div
          className="w-full h-2 rounded-full mb-3"
          style={{
            background: 'repeating-linear-gradient(45deg, #eab308 0, #eab308 10px, #000000 10px, #000000 20px)',
          }}
        />

        {/* Knife Switch Mechanism Stage */}
        <div className="relative w-48 h-20 flex items-center justify-between px-4">
          {/* Left Copper Terminal Post */}
          <div className="w-5 h-12 rounded bg-gradient-to-r from-amber-700 to-amber-500 border border-amber-300 shadow-md flex items-center justify-center">
            <span className="w-1.5 h-6 bg-slate-900 rounded-sm" />
          </div>

          {/* Crackling Electrical Arc Plasma when Engaged */}
          {isEngaged && (
            <div className="absolute left-10 right-10 flex items-center justify-center pointer-events-none">
              <svg width="120" height="40" viewBox="0 0 120 40" className="animate-pulse">
                <path
                  d="M5 20 L25 8 L45 28 L65 12 L85 26 L115 20"
                  stroke="#22c55e"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px #22c55e)"
                />
                <path
                  d="M5 20 L30 25 L55 10 L75 30 L95 15 L115 20"
                  stroke="#86efac"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* Right Copper Terminal Post */}
          <div className="w-5 h-12 rounded bg-gradient-to-r from-amber-500 to-amber-700 border border-amber-300 shadow-md flex items-center justify-center">
            <span className="w-1.5 h-6 bg-slate-900 rounded-sm" />
          </div>

          {/* Mechanical Lever Blade */}
          <div
            className="absolute left-6 w-36 h-4 rounded-full transition-transform duration-300 origin-left flex items-center"
            style={{
              transform: isEngaged ? 'rotate(0deg)' : 'rotate(-42deg)',
              background: 'linear-gradient(to right, #94a3b8, #cbd5e1)',
              boxShadow: isEngaged ? '0 0 15px #22c55e' : '0 5px 15px rgba(0,0,0,0.5)',
            }}
          >
            {/* Insulated Lever Handle Knob */}
            <div className="absolute right-0 w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-xl -mr-3" />
          </div>
        </div>

        {/* Voltage Telemetry Badge */}
        <div className="mt-4 flex items-center justify-between w-full pt-2 border-t border-slate-800 text-[10px] font-mono">
          <span className={isEngaged ? 'text-emerald-400 font-bold flex items-center gap-1' : 'text-rose-400 font-bold'}>
            <span className={`w-2 h-2 rounded-full ${isEngaged ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
            {isEngaged ? '10,000V HIGH VOLTAGE ACTIVE' : 'CIRCUIT DISENGAGED (SAFE)'}
          </span>
          <span className="text-slate-400 group-hover:text-emerald-300 transition-colors">
            Pull Knife Lever
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 5. Viscous Bio-Slime Gooey Toggle
 * SVG gooey filter fluid blob that pulls apart with elastic stretching slime tendons
 */
const ViscousSlimeToggle: React.FC<SubRendererProps> = ({
  containerStyle,
  bg,
  primary,
  secondary,
  headline,
}) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div
      style={{ ...containerStyle, background: bg }}
      onClick={() => setIsOn((prev) => !prev)}
      className="w-full h-full min-h-[250px] p-4 flex flex-col items-center justify-center select-none cursor-pointer relative overflow-hidden group"
      title="Click to stretch gooey bio-slime!"
    >
      <span className="text-[10px] font-mono uppercase text-violet-400 font-bold mb-3 tracking-wider">
        {isOn ? '☣ BIO-SLIME: MUTATED' : '✦ BIO-SLIME: DORMANT'}
      </span>

      {/* SVG Gooey Matrix Filter */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="uiv-slime-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gooey Slime Track Container */}
      <div
        className="relative w-40 h-20 rounded-full bg-slate-900/90 border-2 border-violet-500/50 p-2 flex items-center shadow-2xl cursor-pointer"
        style={{
          boxShadow: isOn ? '0 0 30px rgba(168,85,247,0.4)' : '0 0 20px rgba(16,185,129,0.3)',
        }}
      >
        {/* Filter Applied Goo Area */}
        <div
          className="relative w-full h-full flex items-center"
          style={{ filter: 'url(#uiv-slime-goo)' }}
        >
          {/* Base Slime Blob */}
          <div
            className="w-12 h-12 rounded-full absolute left-1 transition-colors duration-500"
            style={{
              background: isOn ? '#a855f7' : '#10b981',
              boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.3)',
            }}
          />

          {/* Stretching Knob Slime Blob */}
          <div
            className="w-12 h-12 rounded-full absolute transition-all duration-500 ease-out flex items-center justify-center"
            style={{
              left: isOn ? '5.5rem' : '0.25rem',
              background: isOn ? '#ec4899' : '#06b6d4',
              boxShadow: '0 0 15px rgba(236,72,153,0.6)',
            }}
          >
            <span className="w-3 h-3 rounded-full bg-white/70" />
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] font-mono text-slate-400 group-hover:text-violet-300 transition-colors">
        Click to Stretch & Snap Slime Bridge
      </div>
    </div>
  );
};

