import React, { useState, useEffect } from 'react';
import rawDesigns from './data/designs.json';
import { DesignItem, User } from './types';
import { authService } from './services/authService';
import { ToastProvider, useToast } from './components/common/ToastNotification';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { FreeDesignsPage } from './pages/FreeDesignsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { DesignDetailsModal } from './components/details/DesignDetailsModal';
import { LivePreviewModal } from './components/previews/LivePreviewModal';
import { DesignCustomizer } from './components/editor/DesignCustomizer';
import { AuthModal } from './components/auth/AuthModal';
import { DatabaseExplorerModal } from './components/auth/DatabaseExplorerModal';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';
import { downloadDesignPackage } from './utils/packageBuilder';
import { CustomizationConfig } from './types';

const ALL_DESIGNS: DesignItem[] = (rawDesigns as unknown) as DesignItem[];

function AppContent() {
  const { showToast } = useToast();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [exploreInitialCategory, setExploreInitialCategory] = useState<string>('All');
  const [exploreInitialPurpose, setExploreInitialPurpose] = useState<string>('All');

  // User auth state
  const [user, setUser] = useState<User | null>(authService.getUser());

  // Active modals state
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);
  const [previewDesign, setPreviewDesign] = useState<DesignItem | null>(null);
  const [customizerDesign, setCustomizerDesign] = useState<DesignItem | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);
  const [pendingDownloadDesign, setPendingDownloadDesign] = useState<DesignItem | null>(null);
  const [pendingCustomConfig, setPendingCustomConfig] = useState<CustomizationConfig | null>(null);
  const [isDbExplorerOpen, setIsDbExplorerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Subscribe to auth changes
  useEffect(() => {
    return authService.subscribe((updatedUser) => {
      setUser(updatedUser ? { ...updatedUser } : null);
    });
  }, []);

  // Global listener for compulsory download authentication gate
  useEffect(() => {
    const handleAuthRequired = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail?.design) {
        setPendingDownloadDesign(customEvt.detail.design);
        setPendingCustomConfig(customEvt.detail.customConfig || null);
        setAuthModalMode('login');
        showToast(
          `Auth0 Security: Compulsory login required to download "${customEvt.detail.design.name}".`,
          'info'
        );
      }
    };
    window.addEventListener('uiverse-auth-required', handleAuthRequired);
    return () => window.removeEventListener('uiverse-auth-required', handleAuthRequired);
  }, [showToast]);

  // Listen to window hash for shareable design URLs (e.g., #design-aurora-glass-auth)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#design-')) {
        const slug = hash.replace('#design-', '');
        const target = ALL_DESIGNS.find((d) => d.slug === slug || d.id === slug);
        if (target) {
          setSelectedDesign(target);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ⌘K global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: string, category?: string, purpose?: string) => {
    if (tab === 'dashboard' && !user) {
      setAuthModalMode('login');
      showToast('Please sign in to access your dashboard & collections.', 'info');
      return;
    }
    if (category) {
      setExploreInitialCategory(category);
    }
    if (purpose) {
      setExploreInitialPurpose(purpose);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id: string) => {
    const saved = authService.toggleFavorite(id);
    const item = ALL_DESIGNS.find((d) => d.id === id);
    const name = item ? item.name : 'Design';
    if (saved) {
      showToast(`Added "${name}" to your saved designs!`, 'success');
    } else {
      showToast(`Removed "${name}" from saved designs.`, 'info');
    }
  };

  const isFavorite = (id: string) => {
    return authService.isDesignFavorite(id);
  };

  const handleLogout = () => {
    authService.logout();
    showToast('Logged out successfully.', 'info');
    if (currentTab === 'dashboard') {
      setCurrentTab('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-slate-100 selection:bg-violet-600/30 selection:text-violet-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        user={user}
        onOpenAuth={(mode = 'login') => setAuthModalMode(mode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDatabaseHub={() => setIsDbExplorerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Router */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'home' && (
          <HomePage
            allDesigns={ALL_DESIGNS}
            onNavigate={handleNavigate}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetails={(d) => setSelectedDesign(d)}
            onOpenPreview={(d) => setPreviewDesign(d)}
            onOpenCustomizer={(d) => setCustomizerDesign(d)}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            initialCategory={exploreInitialCategory}
            initialPurpose={exploreInitialPurpose}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetails={(d) => setSelectedDesign(d)}
            onOpenPreview={(d) => setPreviewDesign(d)}
            onOpenCustomizer={(d) => setCustomizerDesign(d)}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage
            allDesigns={ALL_DESIGNS}
            onNavigate={handleNavigate}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetails={(d) => setSelectedDesign(d)}
            onOpenPreview={(d) => setPreviewDesign(d)}
            onOpenCustomizer={(d) => setCustomizerDesign(d)}
          />
        )}

        {currentTab === 'free' && (
          <FreeDesignsPage
            allDesigns={ALL_DESIGNS}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetails={(d) => setSelectedDesign(d)}
            onOpenPreview={(d) => setPreviewDesign(d)}
            onOpenCustomizer={(d) => setCustomizerDesign(d)}
          />
        )}

        {currentTab === 'collections' && (
          <CollectionsPage
            allDesigns={ALL_DESIGNS}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetails={(d) => setSelectedDesign(d)}
            onOpenPreview={(d) => setPreviewDesign(d)}
            onOpenCustomizer={(d) => setCustomizerDesign(d)}
          />
        )}

        {currentTab === 'dashboard' && user && (
          <UserDashboard
            user={user}
            allDesigns={ALL_DESIGNS}
            onOpenDetails={(d) => setSelectedDesign(d)}
            onOpenPreview={(d) => setPreviewDesign(d)}
            onOpenCustomizer={(d) => setCustomizerDesign(d)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Semantic Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Drawers */}
      {selectedDesign && (
        <DesignDetailsModal
          design={selectedDesign}
          isFavorite={isFavorite(selectedDesign.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => {
            setSelectedDesign(null);
            if (window.location.hash.startsWith('#design-')) {
              history.pushState(null, '', window.location.pathname);
            }
          }}
          onOpenPreview={(d) => {
            setSelectedDesign(null);
            setPreviewDesign(d);
          }}
          onOpenCustomizer={(d) => {
            setSelectedDesign(null);
            setCustomizerDesign(d);
          }}
          onSelectDesign={(d) => setSelectedDesign(d)}
        />
      )}

      {previewDesign && (
        <LivePreviewModal
          design={previewDesign}
          onClose={() => setPreviewDesign(null)}
          onOpenCustomizer={(d) => {
            setPreviewDesign(null);
            setCustomizerDesign(d);
          }}
        />
      )}

      {customizerDesign && (
        <DesignCustomizer
          design={customizerDesign}
          onClose={() => setCustomizerDesign(null)}
          onOpenLivePreview={(d) => {
            setCustomizerDesign(null);
            setPreviewDesign(d);
          }}
        />
      )}

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          downloadRequiredFor={
            pendingDownloadDesign
              ? { name: pendingDownloadDesign.name, slug: pendingDownloadDesign.slug }
              : null
          }
          onClose={() => {
            setAuthModalMode(null);
            setPendingDownloadDesign(null);
            setPendingCustomConfig(null);
          }}
          onSuccess={() => {
            setAuthModalMode(null);
            if (pendingDownloadDesign) {
              const target = pendingDownloadDesign;
              const targetConfig = pendingCustomConfig;
              setPendingDownloadDesign(null);
              setPendingCustomConfig(null);
              setTimeout(() => {
                try {
                  downloadDesignPackage(target, targetConfig || undefined, true);
                  authService.recordDownload(
                    target.id,
                    target.name,
                    'zip-react',
                    target.priceType
                  );
                  showToast(
                    `Auth0 Verified! Downloaded "${target.name}" source ZIP package.`,
                    'success'
                  );
                } catch {
                  showToast('Error generating ZIP package.', 'error');
                }
              }, 250);
            }
          }}
        />
      )}

      {/* Auth0 & Database Hub Live Explorer Modal */}
      <DatabaseExplorerModal
        isOpen={isDbExplorerOpen}
        onClose={() => setIsDbExplorerOpen(false)}
      />

      <CommandPaletteModal
        allDesigns={ALL_DESIGNS}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectDesign={(d) => setSelectedDesign(d)}
        onOpenPreview={(d) => setPreviewDesign(d)}
        onOpenCustomizer={(d) => setCustomizerDesign(d)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
