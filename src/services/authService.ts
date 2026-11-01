import { User, CollectionItem, CustomizedDesignItem, DownloadHistoryItem, CustomizationConfig } from '../types';

const STORAGE_USER_KEY = 'uiverse_user_session';
const STORAGE_TOKEN_KEY = 'uiverse_auth_token';
const STORAGE_FAVORITES_KEY = 'uiverse_guest_favorites';

const DEFAULT_DEMO_USER: User = {
  id: 'usr-demo-01',
  email: 'alex.creator@uiverse.studio',
  fullName: 'Alex Vance',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  bio: 'Design Engineer & Open-Source UI Contributor',
  isDemoUser: true,
  authProvider: 'demo',
  auth0Sub: 'auth0|demo_alex_vance',
  roles: ['developer', 'verified_downloader'],
  savedDesignIds: ['uiv-01', 'uiv-02', 'uiv-07', 'uiv-11', 'uiv-24'],
  collections: [
    {
      id: 'col-01',
      name: 'Best Login Pages',
      description: 'Sleek dark-mode and glassmorphism authentication layouts.',
      designIds: ['uiv-02'],
      isCurated: true,
      createdAt: '2026-10-15',
    },
    {
      id: 'col-02',
      name: '3D & WebGL Experiences',
      description: 'Immersive spatial hero sections and futuristic interfaces.',
      designIds: ['uiv-01', 'uiv-04'],
      isCurated: true,
      createdAt: '2026-10-18',
    },
    {
      id: 'col-03',
      name: 'SaaS Analytics Dashboards',
      description: 'High-density telemetry consoles, frosted panels, and KPI grids.',
      designIds: ['uiv-03', 'uiv-08', 'uiv-19'],
      isCurated: true,
      createdAt: '2026-10-20',
    },
    {
      id: 'col-04',
      name: 'Developer Portfolios',
      description: 'CLI terminals, minimal monochrome, and bento identity cards.',
      designIds: ['uiv-09', 'uiv-10', 'uiv-14'],
      isCurated: true,
      createdAt: '2026-10-22',
    },
  ],
  customizedDesigns: [],
  downloadHistory: [],
};

class AuthService {
  private user: User | null = null;
  private token: string | null = null;
  private listeners: Set<(user: User | null) => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      this.token = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (stored) {
        this.user = JSON.parse(stored);
      } else {
        // Initial state is unauthenticated (guest) to enforce login gate on downloads
        this.user = null;
      }
    } catch {
      this.user = null;
    }
  }

  public subscribe(callback: (user: User | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.user);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    if (this.user) {
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(this.user));
        if (this.token) {
          localStorage.setItem(STORAGE_TOKEN_KEY, this.token);
        }
      } catch (err) {
        console.warn('Failed to persist user session', err);
      }
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      this.token = null;
    }
    this.listeners.forEach((fn) => fn(this.user));
  }

  public getUser(): User | null {
    return this.user;
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem(STORAGE_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return this.user !== null;
  }

  /**
   * Auth0 Authentication & Database Ingestion
   */
  public async loginWithAuth0(params: {
    email: string;
    fullName: string;
    avatarUrl?: string;
    authProvider?: 'auth0' | 'auth0-github' | 'auth0-google';
    auth0Sub?: string;
  }): Promise<User> {
    try {
      const res = await fetch('/api/auth0/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        this.token = data.token;
        this.user = {
          ...data.user,
          savedDesignIds: this.user?.savedDesignIds || ['uiv-01', 'uiv-02', 'uiv-39'],
          collections: this.user?.collections || DEFAULT_DEMO_USER.collections,
          customizedDesigns: this.user?.customizedDesigns || [],
          downloadHistory: this.user?.downloadHistory || [],
        };
        this.notify();
        return this.user!;
      }
    } catch (err) {
      console.warn('Backend API offline, falling back to client session:', err);
    }

    // Client-side fallback with Auth0 claims
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: params.email,
      fullName: params.fullName,
      avatarUrl: params.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(params.email)}`,
      bio: 'Verified Developer via Auth0 Shield',
      isDemoUser: false,
      authProvider: params.authProvider || 'auth0',
      auth0Sub: params.auth0Sub || `auth0|${Date.now()}`,
      roles: ['developer', 'verified_downloader'],
      savedDesignIds: ['uiv-01', 'uiv-02', 'uiv-39'],
      collections: DEFAULT_DEMO_USER.collections,
      customizedDesigns: [],
      downloadHistory: [],
    };

    this.token = `uiv_jwt_${Date.now()}`;
    this.user = newUser;
    this.notify();
    return newUser;
  }

  public async login(email: string, pass: string, rememberMe = true): Promise<User> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, rememberMe }),
      });

      if (res.ok) {
        const data = await res.json();
        this.token = data.token;
        this.user = {
          ...data.user,
          savedDesignIds: this.user?.savedDesignIds || ['uiv-01', 'uiv-02'],
          collections: this.user?.collections || DEFAULT_DEMO_USER.collections,
          customizedDesigns: this.user?.customizedDesigns || [],
          downloadHistory: this.user?.downloadHistory || [],
        };
        this.notify();
        return this.user!;
      }
    } catch (err) {
      console.warn('Backend login fallback:', err);
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      bio: 'Member of UIverse Studio',
      isDemoUser: false,
      authProvider: 'local',
      savedDesignIds: ['uiv-01', 'uiv-02'],
      collections: DEFAULT_DEMO_USER.collections,
      customizedDesigns: [],
      downloadHistory: [],
    };

    this.token = `uiv_token_${Date.now()}`;
    this.user = newUser;
    this.notify();
    return newUser;
  }

  public async loginDemo(): Promise<User> {
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        this.token = data.token;
        this.user = {
          ...DEFAULT_DEMO_USER,
          ...data.user,
        };
        this.notify();
        return this.user!;
      }
    } catch (err) {
      console.warn('Backend demo fallback:', err);
    }

    this.token = `uiv_demo_token_${Date.now()}`;
    this.user = { ...DEFAULT_DEMO_USER };
    this.notify();
    return this.user;
  }

  public async signup(fullName: string, email: string, pass: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        this.token = data.token;
        this.user = {
          ...data.user,
          savedDesignIds: [],
          collections: [
            {
              id: `col-${Date.now()}`,
              name: 'My First Collection',
              description: 'Personal favorite UI templates and components.',
              designIds: [],
              createdAt: new Date().toISOString().split('T')[0],
            },
          ],
          customizedDesigns: [],
          downloadHistory: [],
        };
        this.notify();
        return this.user!;
      }
    } catch (err) {
      console.warn('Backend signup fallback:', err);
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      bio: 'Creator at UIverse Studio',
      isDemoUser: false,
      authProvider: 'local',
      savedDesignIds: [],
      collections: [
        {
          id: `col-${Date.now()}`,
          name: 'My First Collection',
          description: 'Personal favorite UI templates and components.',
          designIds: [],
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
      customizedDesigns: [],
      downloadHistory: [],
    };

    this.token = `uiv_token_${Date.now()}`;
    this.user = newUser;
    this.notify();
    return newUser;
  }

  public logout() {
    this.user = null;
    this.token = null;
    this.notify();
  }

  public async getDatabaseTelemetry() {
    try {
      const res = await fetch('/api/database/telemetry');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Failed to fetch DB telemetry:', err);
    }
    return null;
  }

  // Favorite toggle
  public toggleFavorite(designId: string): boolean {
    if (!this.user) {
      // Guest mode storage
      try {
        const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
        const guestFavs: string[] = stored ? JSON.parse(stored) : [];
        const index = guestFavs.indexOf(designId);
        let nowSaved = false;
        if (index > -1) {
          guestFavs.splice(index, 1);
        } else {
          guestFavs.push(designId);
          nowSaved = true;
        }
        localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(guestFavs));
        return nowSaved;
      } catch {
        return false;
      }
    }

    const index = this.user.savedDesignIds.indexOf(designId);
    let isSaved = false;
    if (index > -1) {
      this.user.savedDesignIds = this.user.savedDesignIds.filter((id) => id !== designId);
      isSaved = false;
    } else {
      this.user.savedDesignIds = [...this.user.savedDesignIds, designId];
      isSaved = true;
    }
    this.notify();
    return isSaved;
  }

  public isDesignFavorite(designId: string): boolean {
    if (!this.user) {
      try {
        const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
        const guestFavs: string[] = stored ? JSON.parse(stored) : [];
        return guestFavs.includes(designId);
      } catch {
        return false;
      }
    }
    return this.user.savedDesignIds.includes(designId);
  }

  // Collections
  public createCollection(name: string, description: string): CollectionItem | null {
    if (!this.user) return null;
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      name,
      description,
      designIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.user.collections = [...this.user.collections, newCol];
    this.notify();
    return newCol;
  }

  public renameCollection(id: string, newName: string, newDesc?: string): boolean {
    if (!this.user) return false;
    this.user.collections = this.user.collections.map((col) => {
      if (col.id === id) {
        return {
          ...col,
          name: newName,
          description: newDesc !== undefined ? newDesc : col.description,
        };
      }
      return col;
    });
    this.notify();
    return true;
  }

  public deleteCollection(id: string): boolean {
    if (!this.user) return false;
    this.user.collections = this.user.collections.filter((col) => col.id !== id);
    this.notify();
    return true;
  }

  public addDesignToCollection(collectionId: string, designId: string): boolean {
    if (!this.user) return false;
    this.user.collections = this.user.collections.map((col) => {
      if (col.id === collectionId && !col.designIds.includes(designId)) {
        return { ...col, designIds: [...col.designIds, designId] };
      }
      return col;
    });
    this.notify();
    return true;
  }

  public removeDesignFromCollection(collectionId: string, designId: string): boolean {
    if (!this.user) return false;
    this.user.collections = this.user.collections.map((col) => {
      if (col.id === collectionId) {
        return { ...col, designIds: col.designIds.filter((id) => id !== designId) };
      }
      return col;
    });
    this.notify();
    return true;
  }

  // Customization
  public saveCustomizedDesign(
    designId: string,
    designName: string,
    variantName: string,
    config: CustomizationConfig
  ): CustomizedDesignItem | null {
    if (!this.user) return null;
    const item: CustomizedDesignItem = {
      id: `cust-${Date.now()}`,
      designId,
      designName,
      name: variantName,
      updatedAt: new Date().toISOString().split('T')[0],
      config,
    };
    this.user.customizedDesigns = [
      item,
      ...this.user.customizedDesigns.filter((c) => c.name !== variantName),
    ];
    this.notify();
    return item;
  }

  public deleteCustomizedDesign(id: string): boolean {
    if (!this.user) return false;
    this.user.customizedDesigns = this.user.customizedDesigns.filter((c) => c.id !== id);
    this.notify();
    return true;
  }

  // Record Download
  public recordDownload(
    designId: string,
    designName: string,
    format: 'zip-html' | 'zip-react',
    priceType: 'free' | 'premium'
  ) {
    if (!this.user) return;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord: DownloadHistoryItem = {
      id: `dl-${Date.now()}`,
      designId,
      designName,
      downloadedAt: formattedDate,
      format,
      priceType,
    };

    this.user.downloadHistory = [newRecord, ...this.user.downloadHistory.slice(0, 49)];
    this.notify();

    // Persist in backend database
    fetch('/api/downloads/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify({
        userId: this.user.id,
        userEmail: this.user.email,
        designId,
        designName,
        format,
        priceType,
      }),
    }).catch((err) => console.warn('Could not log download to server DB:', err));
  }

  public updateProfile(fullName: string, bio: string) {
    if (!this.user) return;
    this.user = {
      ...this.user,
      fullName,
      bio,
    };
    this.notify();
  }
}

export const authService = new AuthService();
