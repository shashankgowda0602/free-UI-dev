import React, { useState } from 'react';
import { User, DesignItem, CollectionItem, CustomizedDesignItem } from '../../types';
import { authService } from '../../services/authService';
import { DesignCard } from '../cards/DesignCard';
import { downloadDesignPackage } from '../../utils/packageBuilder';
import { useToast } from '../common/ToastNotification';
import {
  Bookmark,
  FolderPlus,
  Sliders,
  Download,
  User as UserIcon,
  LogOut,
  Trash2,
  Edit2,
  Folder,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  allDesigns: DesignItem[];
  onOpenDetails: (design: DesignItem) => void;
  onOpenPreview: (design: DesignItem) => void;
  onOpenCustomizer: (design: DesignItem) => void;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  allDesigns,
  onOpenDetails,
  onOpenPreview,
  onOpenCustomizer,
  onLogout,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'saved' | 'collections' | 'customized' | 'downloads' | 'settings'
  >('saved');

  // Collection modal / creation states
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [showCreateCol, setShowCreateCol] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Profile edit
  const [editName, setEditName] = useState(user.fullName);
  const [editBio, setEditBio] = useState(user.bio || '');

  const savedDesigns = allDesigns.filter((d) => user.savedDesignIds.includes(d.id));

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    authService.createCollection(newColName, newColDesc);
    setNewColName('');
    setNewColDesc('');
    setShowCreateCol(false);
    showToast('Created new collection!', 'success');
  };

  const handleDeleteCollection = (id: string, name: string) => {
    if (confirm(`Delete collection "${name}"?`)) {
      authService.deleteCollection(id);
      if (selectedCollectionId === id) setSelectedCollectionId(null);
      showToast('Collection deleted.', 'info');
    }
  };

  const handleRemoveFromCollection = (collectionId: string, designId: string) => {
    authService.removeDesignFromCollection(collectionId, designId);
    showToast('Removed from collection.', 'info');
  };

  const handleReDownload = (designId: string) => {
    const item = allDesigns.find((d) => d.id === designId);
    if (item) {
      downloadDesignPackage(item);
      showToast(`Downloaded "${item.name}" package!`, 'success');
    } else {
      showToast('Design package not found in catalog.', 'error');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfile(editName, editBio);
    showToast('Updated profile settings.', 'success');
  };

  const activeCollection = user.collections.find((c) => c.id === selectedCollectionId);
  const collectionDesigns = activeCollection
    ? allDesigns.filter((d) => activeCollection.designIds.includes(d.id))
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Profile Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#141724] via-[#10121d] to-[#0d0f17] border border-slate-800 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-violet-600/30">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {user.fullName}
              </h1>
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {user.authProvider ? `AUTH0: ${user.authProvider.toUpperCase()}` : 'AUTH0 VERIFIED'}
              </span>
              <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                DB PERSISTED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">{user.bio}</p>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs text-slate-400">
          <div>
            <span className="block text-base font-bold font-mono text-white">
              {user.savedDesignIds.length}
            </span>
            <span>Saved</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="block text-base font-bold font-mono text-white">
              {user.collections.length}
            </span>
            <span>Collections</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="block text-base font-bold font-mono text-white">
              {user.customizedDesigns.length}
            </span>
            <span>Presets</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="block text-base font-bold font-mono text-white">
              {user.downloadHistory.length}
            </span>
            <span>Exports</span>
          </div>
        </div>
      </div>

      {/* Dashboard Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => {
            setActiveTab('saved');
            setSelectedCollectionId(null);
          }}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'saved'
              ? 'bg-violet-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Designs ({savedDesigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'collections'
              ? 'bg-violet-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>My Collections ({user.collections.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('customized');
            setSelectedCollectionId(null);
          }}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'customized'
              ? 'bg-violet-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Customized Presets ({user.customizedDesigns.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('downloads');
            setSelectedCollectionId(null);
          }}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'downloads'
              ? 'bg-violet-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download History ({user.downloadHistory.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            setSelectedCollectionId(null);
          }}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'settings'
              ? 'bg-violet-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab Panes */}
      <div>
        {/* Saved Designs */}
        {activeTab === 'saved' && (
          <div>
            {savedDesigns.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                <Bookmark className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">No saved designs yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Browse the catalog and click the heart icon on any design card to bookmark it for
                  quick access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedDesigns.map((design) => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    isFavorite={true}
                    onToggleFavorite={() => authService.toggleFavorite(design.id)}
                    onOpenDetails={onOpenDetails}
                    onOpenPreview={onOpenPreview}
                    onOpenCustomizer={onOpenCustomizer}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collections */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Your Collections</h3>
                <p className="text-xs text-slate-400">
                  Organize UI designs into project-specific moodboards and design systems.
                </p>
              </div>
              <button
                onClick={() => setShowCreateCol(true)}
                className="px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>New Collection</span>
              </button>
            </div>

            {/* Create Collection Modal / Inset Form */}
            {showCreateCol && (
              <form
                onSubmit={handleCreateCollection}
                className="p-5 rounded-xl bg-slate-900 border border-violet-500/40 space-y-3 max-w-lg"
              >
                <h4 className="text-xs font-bold text-white">Create New Collection</h4>
                <input
                  type="text"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="Collection Name (e.g., E-Commerce Redesign 2026)"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                  required
                />
                <textarea
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder="Short description..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white"
                  >
                    Save Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateCol(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.collections.map((col) => {
                const isSelected = selectedCollectionId === col.id;
                return (
                  <div
                    key={col.id}
                    onClick={() =>
                      setSelectedCollectionId(isSelected ? null : col.id)
                    }
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-950/20 border-violet-500 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center">
                        <Folder className="w-4 h-4" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(col.id, col.name);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">{col.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {col.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>{col.designIds.length} designs included</span>
                      <span className="text-violet-400 flex items-center gap-1 font-semibold">
                        {isSelected ? 'Viewing' : 'Open'} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Collection Contents View */}
            {activeCollection && (
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    Designs in &ldquo;{activeCollection.name}&rdquo; ({collectionDesigns.length})
                  </h4>
                  <button
                    onClick={() => setSelectedCollectionId(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close view
                  </button>
                </div>

                {collectionDesigns.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6">
                    No designs added to this collection yet. Open any design details and add it to
                    this collection!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {collectionDesigns.map((design) => (
                      <div key={design.id} className="relative group">
                        <DesignCard
                          design={design}
                          isFavorite={user.savedDesignIds.includes(design.id)}
                          onToggleFavorite={() => authService.toggleFavorite(design.id)}
                          onOpenDetails={onOpenDetails}
                          onOpenPreview={onOpenPreview}
                          onOpenCustomizer={onOpenCustomizer}
                        />
                        <button
                          onClick={() =>
                            handleRemoveFromCollection(activeCollection.id, design.id)
                          }
                          className="absolute top-2 right-12 z-20 px-2 py-1 bg-black/80 hover:bg-rose-950 text-rose-300 border border-rose-500/30 rounded text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Customized Presets */}
        {activeTab === 'customized' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Saved Customized Variants</h3>
              <p className="text-xs text-slate-400">
                Re-open customized tokens in the editor or export ZIP files directly.
              </p>
            </div>

            {user.customizedDesigns.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                <Sliders className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">No custom variants yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Open any design and click &ldquo;Customize&rdquo; to adjust tokens and save your
                  custom theme presets here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.customizedDesigns.map((item) => {
                  const targetDesign = allDesigns.find((d) => d.id === item.designId);
                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                          <span>Base: {item.designName}</span>
                          <span>{item.updatedAt}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2">{item.name}</h4>
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            style={{ backgroundColor: item.config.primaryColor }}
                            className="w-4 h-4 rounded-full border border-slate-900 inline-block shadow-sm"
                          />
                          <span
                            style={{ backgroundColor: item.config.secondaryColor }}
                            className="w-4 h-4 rounded-full border border-slate-900 inline-block shadow-sm"
                          />
                          <span className="text-[11px] text-slate-400">
                            {item.config.fontFamily} · {item.config.borderRadius}px
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                        {targetDesign && (
                          <button
                            onClick={() => onOpenCustomizer(targetDesign)}
                            className="flex-1 py-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 text-xs font-semibold border border-violet-500/30 transition-colors"
                          >
                            Edit Tokens
                          </button>
                        )}
                        {targetDesign && (
                          <button
                            onClick={() => {
                              downloadDesignPackage(targetDesign, item.config);
                              showToast(`Downloaded customized "${item.name}"!`, 'success');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            title="Download ZIP"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            authService.deleteCustomizedDesign(item.id);
                            showToast('Deleted preset', 'info');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:text-rose-400 text-slate-400"
                          title="Delete preset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Download History */}
        {activeTab === 'downloads' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Your Download History</h3>
              <p className="text-xs text-slate-400">
                Audit trail of downloaded archives and packages. Re-download at any time.
              </p>
            </div>

            {user.downloadHistory.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                <Download className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">No downloads recorded</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click &ldquo;ZIP&rdquo; or &ldquo;Download ZIP&rdquo; on any design to generate
                  instant source archives.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#141724] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Design Name</th>
                      <th className="py-3 px-4">Package Format</th>
                      <th className="py-3 px-4">License</th>
                      <th className="py-3 px-4">Downloaded At</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {user.downloadHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-sans font-semibold text-white">
                          {item.designName}
                        </td>
                        <td className="py-3 px-4 text-slate-400 uppercase">{item.format}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.priceType === 'free'
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-violet-950 text-violet-300'
                            }`}
                          >
                            {item.priceType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{item.downloadedAt}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleReDownload(item.designId)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-violet-600 text-slate-200 hover:text-white transition-colors text-[11px] font-semibold font-sans inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Re-download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4">Profile Information</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-white outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-slate-800 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-white outline-none focus:border-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors shadow"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            <div className="p-6 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Log Out from Session</h4>
                <p className="text-[11px] text-slate-400">
                  You can sign back in at any time or explore in guest mode.
                </p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
