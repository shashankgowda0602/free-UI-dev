import React from 'react';
import { Heart, Share2, Download, Eye, Sliders, Sparkles } from 'lucide-react';
import { DesignItem } from '../../types';
import { LiveDesignRenderer } from '../previews/LiveDesignRenderer';
import { downloadDesignPackage } from '../../utils/packageBuilder';
import { shareDesign } from '../../services/shareService';
import { useToast } from '../common/ToastNotification';

interface DesignCardProps {
  design: DesignItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
  onAddToCollection?: (design: DesignItem) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  design,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
}) => {
  const { showToast } = useToast();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      downloadDesignPackage(design);
      showToast(`Downloaded "${design.name}" ZIP package!`, 'success');
    } catch {
      showToast('Error generating ZIP package.', 'error');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await shareDesign(design);
    showToast(res.message, res.success ? 'success' : 'info');
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(design.id);
  };

  const isFree = design.priceType === 'free';

  return (
    <article
      onClick={() => onOpenDetails(design)}
      className="group relative flex flex-col rounded-2xl bg-[#11131c] border border-slate-800/80 hover:border-slate-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 overflow-hidden cursor-pointer"
    >
      {/* Top Card Preview Viewport */}
      <div className="relative w-full h-52 bg-[#0c0d14] overflow-hidden border-b border-slate-800/60 flex items-center justify-center">
        {/* Live Mini Preview Canvas */}
        <div className="w-full h-full transform transition-transform duration-300 group-hover:scale-[1.02]">
          <LiveDesignRenderer variant={design.previewVariant} config={design.defaultConfig} />
        </div>

        {/* Floating Quick Action Overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPreview(design);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white border border-white/20 hover:bg-violet-600 hover:border-violet-500 text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors"
            title="Open Live Preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCustomizer(design);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white border border-white/20 hover:bg-cyan-600 hover:border-cyan-500 text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors"
            title="Customize Design Tokens"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm ${
                isFree
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : 'bg-violet-950/80 text-violet-300 border border-violet-500/30'
              }`}
            >
              {isFree ? 'Free' : 'Pro'}
            </span>
            {design.trending && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Hot
              </span>
            )}
          </div>

          {/* Action buttons (Favorite & Share) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-black/60 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share design"
              className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-gradient-to-b from-[#111320] to-[#0c0d16]">
        <div>
          {/* Metadata row with zero-pill separators */}
          <div className="flex items-center gap-1.5 text-[11px] mb-2 font-mono">
            <span className="text-cyan-400 font-bold tracking-tight uppercase">{design.purpose}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-300 font-medium">{design.category}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-400 truncate">{design.technology}</span>
          </div>

          <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2 tracking-tight">
            {design.name}
          </h3>

          {/* High-Contrast Crazy Modern Micro-Specs (Replaces dull text) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-violet-950/70 border border-violet-500/40 text-violet-300 flex items-center gap-1">
              <span>⚡</span> {design.animationType}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-300">
              #{design.tags[0] || 'Interactive'}
            </span>
            {design.isNew && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/50 uppercase">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Metrics and Instant Download Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="text-slate-300 font-semibold">{design.favoritesCount + (isFavorite ? 1 : 0)}</span>
            <span className="text-slate-500">saves</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-300 font-semibold">{design.downloadsCount}</span>
            <span className="text-slate-500">dls</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomizer(design);
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-all hover:scale-105"
              title="Customize Tokens"
              aria-label="Customize Design Tokens"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPreview(design);
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-violet-400 border border-slate-700 transition-all hover:scale-105"
              title="Live Viewport Preview"
              aria-label="Live Preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105"
              title="Download ZIP package"
            >
              <Download className="w-3 h-3" />
              <span>ZIP</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
