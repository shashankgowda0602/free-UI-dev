import React, { useState, useEffect, useRef } from 'react';
import { DesignItem } from '../../types';
import { Search, X, Eye, Sliders } from 'lucide-react';

interface CommandPaletteModalProps {
  allDesigns: DesignItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectDesign: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  allDesigns,
  isOpen,
  onClose,
  onSelectDesign,
  onOpenPreview,
  onOpenCustomizer,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? allDesigns.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.purpose.toLowerCase().includes(query.toLowerCase()) ||
          d.category.toLowerCase().includes(query.toLowerCase()) ||
          d.technology.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : allDesigns.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0f111a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-[#131522] gap-3">
          <Search className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 38+ designs, hero animations, buttons, icons, components..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No designs found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectDesign(item);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-slate-900 flex items-center justify-between gap-4 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/15 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-violet-300 truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-400">
                        {item.purpose}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">·</span>
                      <span className="text-[10px] font-mono text-violet-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPreview(item);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-violet-600 text-slate-300 hover:text-white"
                    title="Live Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCustomizer(item);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white"
                    title="Customize"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts note */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#0d0f17] flex items-center justify-between text-[11px] text-slate-500">
          <span>{filtered.length} design results</span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
