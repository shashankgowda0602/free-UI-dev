import React, { useState, useRef, useEffect } from 'react';
import { Search, User as UserIcon, Bookmark, LogOut, Sliders, ChevronDown, Database, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  user: User | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenSearch: () => void;
  onOpenDatabaseHub: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  user,
  onOpenAuth,
  onOpenSearch,
  onOpenDatabaseHub,
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0c10]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-md py-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-600/20">
              <span className="text-white font-extrabold text-sm tracking-tight">U</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                UIverse Studio
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-violet-400 font-semibold hidden sm:inline">
                PRO
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise Single-line Nav Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <button
            onClick={() => onNavigate('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              currentTab === 'explore'
                ? 'text-white font-semibold border-b-2 border-violet-500'
                : 'text-slate-400'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              currentTab === 'categories'
                ? 'text-white font-semibold border-b-2 border-violet-500'
                : 'text-slate-400'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => onNavigate('free')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              currentTab === 'free'
                ? 'text-white font-semibold border-b-2 border-violet-500'
                : 'text-slate-400'
            }`}
          >
            Free Designs
          </button>
          <button
            onClick={() => onNavigate('collections')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 ${
              currentTab === 'collections'
                ? 'text-white font-semibold border-b-2 border-violet-500'
                : 'text-slate-400'
            }`}
          >
            Collections
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search trigger + User Auth) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-xs"
            aria-label="Quick Search"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search designs...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Auth0 & Database Hub button */}
          <button
            onClick={onOpenDatabaseHub}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-violet-500/40 hover:border-violet-400 text-xs text-violet-300 font-mono transition-colors shadow-sm"
            title="Inspect Auth0 Security & Live Persistent Database Logs"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold hidden sm:inline">DB & Auth0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* User Auth or Avatar */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-300 font-bold text-xs flex items-center justify-center border border-violet-500/30">
                  {user.fullName.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[90px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 mr-1" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900/95 border border-slate-800 p-2 shadow-2xl backdrop-blur-md z-50">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono uppercase bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      {user.authProvider ? user.authProvider.toUpperCase() : 'AUTH0'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-violet-400" />
                    My Saved & Collections
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Customized Designs
                  </button>
                  <button
                    onClick={() => {
                      onOpenDatabaseHub();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-emerald-300 hover:bg-slate-800 hover:text-emerald-200 transition-colors text-left"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Live DB & Auth0 Audit Logs
                  </button>
                  <div className="border-t border-slate-800 my-1" />
                  <button
                    onClick={() => {
                      onLogout();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Subnav Strip for accessibility on small screens */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 px-2 py-2 text-xs bg-[#0b0c10]/95 overflow-x-auto">
        <button
          onClick={() => onNavigate('explore')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            currentTab === 'explore' ? 'bg-violet-600/20 text-violet-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => onNavigate('categories')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            currentTab === 'categories' ? 'bg-violet-600/20 text-violet-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => onNavigate('free')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            currentTab === 'free' ? 'bg-violet-600/20 text-violet-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => onNavigate('collections')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            currentTab === 'collections' ? 'bg-violet-600/20 text-violet-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Collections
        </button>
      </div>
    </header>
  );
};
