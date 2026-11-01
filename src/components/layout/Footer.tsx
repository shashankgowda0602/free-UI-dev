import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#07080b] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">U</span>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">UIverse Studio</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
              A premium UI design marketplace and component laboratory. Discover production-ready
              interactive interfaces, customize visual tokens live, and download editable source
              code as complete ZIP archives.
            </p>
            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span>MIT & Commercial</span>
              <span aria-hidden="true">·</span>
              <span>38+ Hand-Crafted Designs</span>
              <span aria-hidden="true">·</span>
              <span>Client-Side ZIP Generator</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors"
                >
                  All 38 Designs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('free')}
                  className="hover:text-white transition-colors"
                >
                  Free Open-Source
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-white transition-colors"
                >
                  Curated Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-white transition-colors"
                >
                  Categories Index
                </button>
              </li>
            </ul>
          </div>

          {/* Syllabus Coverage */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Frontend Syllabus
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>Unit I: Semantic HTML5 & CSS</li>
              <li>Unit II: Vanilla JS & Async Fetch</li>
              <li>Unit III: React & Modular Hooks</li>
              <li>Responsive Viewport Isolation</li>
            </ul>
          </div>

          {/* Legal & Docs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors inline-flex items-center gap-1">
                  License Terms <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  ZIP Package Specs
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Backend Integration Docs
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Accessibility Checklist
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} UIverse Studio. Handcrafted for modern developers.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Pure PKZIP Client Packaging</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Tailwind CSS + React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
