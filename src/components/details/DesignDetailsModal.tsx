import React, { useState, useEffect } from 'react';
import { DesignItem } from '../../types';
import { LiveDesignRenderer } from '../previews/LiveDesignRenderer';
import { downloadDesignPackage } from '../../utils/packageBuilder';
import { shareDesign } from '../../services/shareService';
import { getRelatedDesigns } from '../../services/designService';
import { useToast } from '../common/ToastNotification';
import {
  Heart,
  Share2,
  Download,
  Sliders,
  Eye,
  X,
  ShieldCheck,
  Check,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DesignDetailsModalProps {
  design: DesignItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
  onSelectDesign: (design: DesignItem) => void;
}

export const DesignDetailsModal: React.FC<DesignDetailsModalProps> = ({
  design,
  isFavorite,
  onToggleFavorite,
  onClose,
  onOpenPreview,
  onOpenCustomizer,
  onSelectDesign,
}) => {
  const { showToast } = useToast();
  const [related, setRelated] = useState<DesignItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    getRelatedDesigns(design.id, design.category).then((items) => {
      if (isMounted) setRelated(items);
    });
    return () => {
      isMounted = false;
    };
  }, [design.id, design.category]);

  const handleDownload = () => {
    try {
      downloadDesignPackage(design);
      showToast(`Downloaded "${design.name}" ZIP package!`, 'success');
    } catch {
      showToast('Error generating package.', 'error');
    }
  };

  const handleShare = async () => {
    const res = await shareDesign(design);
    showToast(res.message, res.success ? 'success' : 'info');
  };

  const isFree = design.priceType === 'free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f111a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131522]">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                isFree
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : 'bg-violet-950/80 text-violet-300 border border-violet-500/30'
              }`}
            >
              {isFree ? 'Free Template' : 'Pro Commercial'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Updated {design.updatedAt}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Visual Showcase Area */}
          <div className="relative w-full h-72 sm:h-80 rounded-xl bg-[#07080d] border border-slate-800/80 overflow-hidden flex items-center justify-center shadow-inner">
            <div className="w-full h-full max-w-lg p-4 flex items-center justify-center">
              <LiveDesignRenderer variant={design.previewVariant} config={design.defaultConfig} />
            </div>

            {/* Quick Floating Action Triggers */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => onOpenPreview(design)}
                className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white border border-white/20 hover:bg-violet-600 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Viewport</span>
              </button>
              <button
                onClick={() => onOpenCustomizer(design)}
                className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white border border-white/20 hover:bg-cyan-600 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize Tokens</span>
              </button>
            </div>
          </div>

          {/* Title, Description & Action Strip */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-violet-400 font-semibold">{design.category}</span>
                <span aria-hidden="true">·</span>
                <span>{design.technology}</span>
                <span aria-hidden="true">·</span>
                <span>{design.animationType}</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{design.name}</h1>
              <p className="text-sm text-slate-300 leading-relaxed">{design.longDescription}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {design.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sticky Action Stack */}
            <div className="w-full md:w-64 p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 shrink-0">
              <button
                onClick={handleDownload}
                className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Editable ZIP</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => onToggleFavorite(design.id)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isFavorite
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
                  <span>{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="py-2 px-3 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  title="Share link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metric note */}
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                <span>{design.favoritesCount + (isFavorite ? 1 : 0)} bookmarks</span>
                <span>{design.downloadsCount} downloads</span>
              </div>
            </div>
          </div>

          {/* Technical Specs & License Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span>Technical Specifications</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                <li className="flex justify-between">
                  <span className="text-slate-400">Framework:</span>
                  <span className="font-medium text-white">{design.technology}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Supported Devices:</span>
                  <span className="font-medium text-white">
                    {design.supportedScreens.join(', ')}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Animation Engine:</span>
                  <span className="font-medium text-white">{design.animationType}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Package Contents:</span>
                  <span className="font-medium text-white">HTML, CSS, React JSX, Theme JSON</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>License & Usage Rights</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {isFree
                  ? 'Licensed under MIT. Free for unlimited personal and commercial web projects, client builds, and open-source applications.'
                  : 'UIverse Studio Commercial License. Permitted for unlimited commercial and SaaS web builds. Direct resale of template files is prohibited.'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>No attribution required in production builds</span>
              </div>
            </div>
          </div>

          {/* Related Designs */}
          {related.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Related {design.category} Designs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectDesign(rel)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] text-violet-400 font-mono block mb-1">
                      {rel.technology}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{rel.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {rel.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
