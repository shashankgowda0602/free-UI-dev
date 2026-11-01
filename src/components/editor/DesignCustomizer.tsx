import React, { useState } from 'react';
import { DesignItem, CustomizationConfig } from '../../types';
import { LiveDesignRenderer } from '../previews/LiveDesignRenderer';
import { downloadDesignPackage } from '../../utils/packageBuilder';
import { authService } from '../../services/authService';
import { useToast } from '../common/ToastNotification';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Download,
  Copy,
  BookmarkPlus,
  Check,
  Code2,
  Sparkles,
  X,
  Maximize2,
} from 'lucide-react';

interface DesignCustomizerProps {
  design: DesignItem;
  initialConfig?: CustomizationConfig;
  onClose: () => void;
  onOpenLivePreview?: (design: DesignItem) => void;
}

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  design,
  initialConfig,
  onClose,
  onOpenLivePreview,
}) => {
  const { showToast } = useToast();

  const [config, setConfig] = useState<CustomizationConfig>(
    initialConfig || { ...design.defaultConfig }
  );

  // Undo / Redo history stack
  const [history, setHistory] = useState<CustomizationConfig[]>([
    initialConfig || { ...design.defaultConfig },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active editor tab: 'tokens' | 'typography' | 'content' | 'code'
  const [activeTab, setActiveTab] = useState<'tokens' | 'typography' | 'content' | 'code'>('tokens');
  const [copiedCodeType, setCopiedCodeType] = useState<string | null>(null);
  const [variantName, setVariantName] = useState(`${design.name} (Custom Variant)`);

  const updateConfig = (updates: Partial<CustomizationConfig>) => {
    const nextConfig = { ...config, ...updates };
    setConfig(nextConfig);

    // Slice history up to current index and push new state
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextConfig);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setConfig(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setConfig(next);
    }
  };

  const handleReset = () => {
    const defaultConf = { ...design.defaultConfig };
    setConfig(defaultConf);
    setHistory([defaultConf]);
    setHistoryIndex(0);
    showToast('Reset customization to defaults.', 'info');
  };

  const handleSaveToAccount = () => {
    const saved = authService.saveCustomizedDesign(
      design.id,
      design.name,
      variantName,
      config
    );
    if (saved) {
      showToast(`Saved "${variantName}" to your dashboard!`, 'success');
    } else {
      showToast('Please sign in to permanently save customized presets.', 'info');
    }
  };

  const handleDownloadZip = () => {
    try {
      downloadDesignPackage(design, config);
      authService.recordDownload(
        design.id,
        `${design.name} (Custom)`,
        'zip-react',
        design.priceType
      );
      showToast('Generated & downloaded customized source package!', 'success');
    } catch {
      showToast('Failed to build customized archive.', 'error');
    }
  };

  const handleCopyCssVars = async () => {
    const cssVars = `:root {
  --uiv-primary: ${config.primaryColor};
  --uiv-secondary: ${config.secondaryColor};
  --uiv-bg: ${config.backgroundColor};
  --uiv-font-family: '${config.fontFamily}', sans-serif;
  --uiv-font-size: ${config.fontSize}px;
  --uiv-radius: ${config.borderRadius}px;
  --uiv-speed: ${config.animationSpeed === 'slow' ? '400ms' : config.animationSpeed === 'normal' ? '200ms' : '100ms'};
}`;
    try {
      await navigator.clipboard.writeText(cssVars);
      setCopiedCodeType('css');
      showToast('Copied CSS variables to clipboard!', 'success');
      setTimeout(() => setCopiedCodeType(null), 2000);
    } catch {
      showToast('Could not copy CSS variables.', 'error');
    }
  };

  const handleCopyReactCode = async () => {
    const code = design.sourceCode.reactJsx || design.sourceCode.html;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeType('react');
      showToast('Copied component code to clipboard!', 'success');
      setTimeout(() => setCopiedCodeType(null), 2000);
    } catch {
      showToast('Could not copy component code.', 'error');
    }
  };

  // Color preset palette shortcuts
  const COLOR_PALETTES = [
    { name: 'Electric Violet', primary: '#8b5cf6', secondary: '#06b6d4', bg: '#0b0c10' },
    { name: 'Cobalt Blue', primary: '#3b82f6', secondary: '#10b981', bg: '#0c0f18' },
    { name: 'Neon Amber', primary: '#f59e0b', secondary: '#ec4899', bg: '#121218' },
    { name: 'Emerald Clean', primary: '#10b981', secondary: '#3b82f6', bg: '#090b10' },
    { name: 'Rose Kinetic', primary: '#ec4899', secondary: '#8b5cf6', bg: '#100c14' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#0f111a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#131522]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Live Design Customizer</h3>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {design.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Adjust tokens with zero-latency preview and export full production ZIP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* History buttons */}
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 border border-slate-700/60 transition-colors"
              title="Undo last change"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 border border-slate-700/60 transition-colors"
              title="Redo change"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Reset to original design"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-slate-700 mx-1" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close customizer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Main Body: 2-Column Split */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Column: Live Canvas Preview */}
          <div className="lg:w-7/12 p-6 flex flex-col justify-between bg-[#0b0c10] border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
            {/* Canvas Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>Interactive Live Preview Canvas</span>
              </div>
              {onOpenLivePreview && (
                <button
                  onClick={() => onOpenLivePreview(design)}
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Viewport Modes</span>
                </button>
              )}
            </div>

            {/* Interactive Preview Viewport Box */}
            <div className="flex-1 min-h-[360px] flex items-center justify-center p-4 rounded-xl border border-slate-800/80 bg-[#07080d] shadow-inner overflow-hidden">
              <div className="w-full max-w-[480px]">
                <LiveDesignRenderer
                  variant={design.previewVariant}
                  config={config}
                  interactive={true}
                />
              </div>
            </div>

            {/* Canvas Bottom Action Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCssVars}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedCodeType === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodeType === 'css' ? 'Copied CSS' : 'Copy CSS Tokens'}</span>
                </button>
                <button
                  onClick={handleCopyReactCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedCodeType === 'react' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
                  <span>{copiedCodeType === 'react' ? 'Copied Code' : 'Copy Component'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToAccount}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-violet-300 flex items-center gap-1.5 transition-colors border border-violet-500/20"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save Preset</span>
                </button>
                <button
                  onClick={handleDownloadZip}
                  className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg shadow-violet-600/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Customized ZIP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Control Panels */}
          <div className="lg:w-5/12 flex flex-col bg-[#11131e] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-[#141724] px-4 pt-2">
              <button
                onClick={() => setActiveTab('tokens')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'tokens'
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Colors & Surface
              </button>
              <button
                onClick={() => setActiveTab('typography')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'typography'
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Geometry & Type
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sample Copy
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'code'
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                JSON Config
              </button>
            </div>

            {/* Tab Panes */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
              {activeTab === 'tokens' && (
                <>
                  {/* Preset Palettes */}
                  <div>
                    <label className="font-semibold text-slate-200 block mb-2">
                      Curated Palettes
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {COLOR_PALETTES.map((p) => (
                        <button
                          key={p.name}
                          onClick={() =>
                            updateConfig({
                              primaryColor: p.primary,
                              secondaryColor: p.secondary,
                              backgroundColor: p.bg,
                            })
                          }
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
                        >
                          <div className="flex -space-x-1">
                            <span
                              style={{ backgroundColor: p.primary }}
                              className="w-3.5 h-3.5 rounded-full inline-block border border-slate-900"
                            />
                            <span
                              style={{ backgroundColor: p.secondary }}
                              className="w-3.5 h-3.5 rounded-full inline-block border border-slate-900"
                            />
                          </div>
                          <span className="text-[11px] text-slate-300 font-medium truncate">
                            {p.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Individual Colors */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">Primary Accent</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-slate-400 text-[11px]">
                          {config.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">Secondary Accent</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-slate-400 text-[11px]">
                          {config.secondaryColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">Canvas Background</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-slate-400 text-[11px]">
                          {config.backgroundColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Theme Mode & Button Style */}
                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1.5">Theme Mode</label>
                      <div className="flex gap-2">
                        {(['dark', 'light'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => updateConfig({ themeMode: mode })}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-colors ${
                              config.themeMode === mode
                                ? 'bg-violet-600 text-white border-violet-500'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {mode} Mode
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-medium block mb-1.5">Button Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['solid', 'outline', 'glass', 'glow'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => updateConfig({ buttonStyle: style })}
                            className={`py-1.5 rounded-lg border text-xs font-medium capitalize transition-colors ${
                              config.buttonStyle === style
                                ? 'bg-violet-600 text-white border-violet-500'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'typography' && (
                <>
                  {/* Font Family */}
                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">Font Family</label>
                    <select
                      value={config.fontFamily}
                      onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-violet-500"
                    >
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Geometric)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Technical / Developer)</option>
                      <option value="Inter">Inter (System Neutral)</option>
                      <option value="Playfair Display">Playfair Display (Editorial Serif)</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Base Font Size</span>
                      <span className="font-mono text-slate-400">{config.fontSize || 14}px</span>
                    </div>
                    <input
                      type="range"
                      min="11"
                      max="20"
                      step="1"
                      value={config.fontSize || 14}
                      onChange={(e) => updateConfig({ fontSize: Number(e.target.value) })}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  {/* Border Radius */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Corner Radius</span>
                      <span className="font-mono text-slate-400">{config.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      step="2"
                      value={config.borderRadius}
                      onChange={(e) => updateConfig({ borderRadius: Number(e.target.value) })}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  {/* Shadow Level */}
                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">Elevation & Shadow</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['none', 'subtle', 'medium', 'dramatic'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => updateConfig({ shadowLevel: lvl })}
                          className={`py-1.5 rounded-lg border text-xs font-medium capitalize transition-colors ${
                            config.shadowLevel === lvl
                              ? 'bg-violet-600 text-white border-violet-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animation Speed */}
                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">Motion Speed</label>
                    <div className="flex gap-2">
                      {(['slow', 'normal', 'fast'] as const).map((spd) => (
                        <button
                          key={spd}
                          onClick={() => updateConfig({ animationSpeed: spd })}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-medium capitalize transition-colors ${
                            config.animationSpeed === spd
                              ? 'bg-violet-600 text-white border-violet-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'content' && (
                <>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">
                      Sample Headline
                    </label>
                    <input
                      type="text"
                      value={config.sampleHeadline}
                      onChange={(e) => updateConfig({ sampleHeadline: e.target.value })}
                      placeholder="Enter custom title..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">
                      Call-to-Action Text
                    </label>
                    <input
                      type="text"
                      value={config.sampleButtonText}
                      onChange={(e) => updateConfig({ sampleButtonText: e.target.value })}
                      placeholder="Enter button text..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">
                      Custom Variant Name (for Saving)
                    </label>
                    <input
                      type="text"
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      placeholder="My Custom Theme Preset"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-violet-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'code' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 font-mono text-[11px]">custom-theme.json</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                        showToast('Copied JSON tokens!', 'success');
                      }}
                      className="text-violet-400 hover:text-violet-300 text-[11px] font-medium"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-72">
                    {JSON.stringify(config, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
