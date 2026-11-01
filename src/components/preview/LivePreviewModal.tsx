import React, { useState } from 'react';
import { DesignItem } from '../../types';
import { LiveDesignRenderer } from '../previews/LiveDesignRenderer';
import { downloadDesignPackage } from '../../utils/packageBuilder';
import { shareDesign } from '../../services/shareService';
import { useToast } from '../common/ToastNotification';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Sliders,
  Download,
  Share2,
  X,
  Code,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface LivePreviewModalProps {
  design: DesignItem;
  onClose: () => void;
  onOpenCustomizer: (design: DesignItem) => void;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  design,
  onClose,
  onOpenCustomizer,
}) => {
  const { showToast } = useToast();
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [codeTab, setCodeTab] = useState<'react' | 'html' | 'css'>('react');
  const [isCopied, setIsCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-[1200px] w-full';
    }
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
    showToast('Preview reloaded', 'info');
  };

  const handleDownload = () => {
    try {
      downloadDesignPackage(design);
      showToast(`Downloaded "${design.name}" package!`, 'success');
    } catch {
      showToast('Error downloading package.', 'error');
    }
  };

  const handleShare = async () => {
    const res = await shareDesign(design);
    showToast(res.message, res.success ? 'success' : 'info');
  };

  const handleCopyCode = async () => {
    const code =
      codeTab === 'react'
        ? design.sourceCode.reactJsx || design.sourceCode.html
        : codeTab === 'html'
        ? design.sourceCode.html
        : design.sourceCode.css;
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      showToast(`Copied ${codeTab.toUpperCase()} code to clipboard!`, 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('Failed to copy code.', 'error');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-[#07080c] transition-all ${
        isFullScreen ? 'p-0' : 'p-2 sm:p-4'
      }`}
    >
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0f111a] border border-slate-800 rounded-xl mb-3 shrink-0 shadow-xl">
        {/* Left: Design Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            ← Back to Catalog
          </button>
          <div className="hidden sm:block">
            <h3 className="text-xs font-bold text-white leading-tight">{design.name}</h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {design.category} · {design.technology}
            </span>
          </div>
        </div>

        {/* Center: Viewport Switcher Controls */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewport === 'desktop'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (1200px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewport === 'tablet'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewport === 'mobile'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
            title="Reload Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowCode((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              showCode
                ? 'bg-violet-600/30 text-violet-300 border-violet-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{showCode ? 'Hide Code' : 'Inspect Code'}</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenCustomizer(design);
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
            title="Share Design"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Preview Box & Code Inspector Split */}
      <div className="flex-1 flex gap-3 overflow-hidden">
        {/* Isolated Device Canvas Container */}
        <div className="flex-1 bg-[#0a0b10] border border-slate-800/80 rounded-xl overflow-y-auto flex items-center justify-center p-4">
          <div
            key={reloadKey}
            className={`transition-all duration-300 ${getViewportWidth()} h-full min-h-[460px] max-h-[85vh] bg-[#11131c] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden`}
          >
            {/* Viewport Frame Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="ml-2 text-slate-300">
                  {viewport === 'mobile'
                    ? '375 × 812'
                    : viewport === 'tablet'
                    ? '768 × 1024'
                    : '1200 × 800'}
                </span>
              </div>
              <span className="text-[10px] text-violet-400 uppercase tracking-wider font-semibold">
                ISOLATED RENDERER
              </span>
            </div>

            {/* Inner Content */}
            <div className="flex-1 p-6 flex items-center justify-center overflow-y-auto">
              <div className="w-full">
                <LiveDesignRenderer
                  variant={design.previewVariant}
                  config={design.defaultConfig}
                  interactive={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Code Inspector Drawer */}
        {showCode && (
          <aside className="w-full lg:w-96 bg-[#0f111a] border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl shrink-0">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#141724] border-b border-slate-800">
              <div className="flex items-center gap-1">
                {(['react', 'html', 'css'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCodeTab(tab)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                      codeTab === tab
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-black/40 font-mono text-[11px] text-slate-300 leading-relaxed">
              <pre className="whitespace-pre-wrap">
                {codeTab === 'react'
                  ? design.sourceCode.reactJsx || design.sourceCode.html
                  : codeTab === 'html'
                  ? design.sourceCode.html
                  : design.sourceCode.css}
              </pre>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
