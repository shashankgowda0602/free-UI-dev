import fs from 'fs';
import path from 'path';

export interface DbUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  authProvider: 'auth0' | 'local' | 'auth0-github' | 'auth0-google' | 'demo';
  auth0Sub?: string;
  passwordHash?: string;
  createdAt: string;
  lastLoginAt: string;
  loginCount: number;
  downloadCount: number;
  roles: string[];
}

export interface DbLoginSession {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  authProvider: string;
  auth0Sub?: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  loggedInAt: string;
  expiresAt: string;
  status: 'active' | 'revoked';
}

export interface DbDownloadRecord {
  id: string;
  userId: string;
  userEmail: string;
  designId: string;
  designName: string;
  format: 'zip-html' | 'zip-react';
  downloadedAt: string;
  priceType: 'free' | 'premium';
}

interface DatabaseSchema {
  version: string;
  users: DbUser[];
  loginSessions: DbLoginSession[];
  downloads: DbDownloadRecord[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'uiverse_database.json');

const INITIAL_DEMO_USER: DbUser = {
  id: 'usr-demo-01',
  email: 'alex.creator@uiverse.studio',
  fullName: 'Alex Vance',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  bio: 'Design Engineer & Open-Source UI Contributor',
  authProvider: 'demo',
  auth0Sub: 'auth0|demo_alex_vance',
  createdAt: '2026-10-15T09:00:00.000Z',
  lastLoginAt: '2026-11-01T08:00:00.000Z',
  loginCount: 14,
  downloadCount: 8,
  roles: ['developer', 'verified_downloader'],
};

class DatabaseService {
  private data: DatabaseSchema = {
    version: '1.0.0',
    users: [],
    loginSessions: [],
    downloads: [],
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {
          version: '1.0.0',
          users: [INITIAL_DEMO_USER],
          loginSessions: [
            {
              id: 'sess-init-01',
              userId: INITIAL_DEMO_USER.id,
              email: INITIAL_DEMO_USER.email,
              fullName: INITIAL_DEMO_USER.fullName,
              authProvider: 'demo',
              auth0Sub: INITIAL_DEMO_USER.auth0Sub,
              token: 'jwt_mock_initial_session_alex_vance',
              ipAddress: '127.0.0.1',
              userAgent: 'Mozilla/5.0 (AI Studio Container)',
              loggedInAt: INITIAL_DEMO_USER.lastLoginAt,
              expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
              status: 'active',
            },
          ],
          downloads: [
            {
              id: 'dl-init-01',
              userId: INITIAL_DEMO_USER.id,
              userEmail: INITIAL_DEMO_USER.email,
              designId: 'baby-tears-pipe-loader',
              designName: 'Blender 3D Baby Cry Hydraulic Pipe Loader',
              format: 'zip-react',
              downloadedAt: '2026-11-01T07:55:00.000Z',
              priceType: 'premium',
            },
          ],
        };
        this.save();
      }
    } catch (err) {
      console.error('Failed to load database file:', err);
      this.data = {
        version: '1.0.0',
        users: [INITIAL_DEMO_USER],
        loginSessions: [],
        downloads: [],
      };
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  // Users
  public getUsers(): DbUser[] {
    return [...this.data.users];
  }

  public findUserByEmail(email: string): DbUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): DbUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByAuth0Sub(sub: string): DbUser | undefined {
    return this.data.users.find((u) => u.auth0Sub === sub);
  }

  public upsertUser(userData: Partial<DbUser> & { email: string; fullName: string }): DbUser {
    const existing = this.findUserByEmail(userData.email);
    const now = new Date().toISOString();

    if (existing) {
      existing.fullName = userData.fullName || existing.fullName;
      if (userData.avatarUrl) existing.avatarUrl = userData.avatarUrl;
      if (userData.bio) existing.bio = userData.bio;
      if (userData.auth0Sub) existing.auth0Sub = userData.auth0Sub;
      if (userData.authProvider) existing.authProvider = userData.authProvider;
      existing.lastLoginAt = now;
      existing.loginCount = (existing.loginCount || 0) + 1;
      this.save();
      return existing;
    }

    const newUser: DbUser = {
      id: userData.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: userData.email,
      fullName: userData.fullName,
      avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(userData.email)}`,
      bio: userData.bio || 'UIverse Studio Verified Developer',
      authProvider: userData.authProvider || 'auth0',
      auth0Sub: userData.auth0Sub || `auth0|${Date.now()}`,
      passwordHash: userData.passwordHash,
      createdAt: now,
      lastLoginAt: now,
      loginCount: 1,
      downloadCount: 0,
      roles: ['developer', 'verified_downloader'],
    };

    this.data.users.unshift(newUser);
    this.save();
    return newUser;
  }

  // Login Sessions (Audit log stored in database)
  public recordLoginSession(params: {
    userId: string;
    email: string;
    fullName: string;
    authProvider: string;
    auth0Sub?: string;
    ipAddress?: string;
    userAgent?: string;
  }): DbLoginSession {
    const now = new Date();
    const expires = new Date(now.getTime() + 14 * 24 * 3600 * 1000); // 14 days
    const sessionToken = `uiv_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const session: DbLoginSession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      email: params.email,
      fullName: params.fullName,
      authProvider: params.authProvider,
      auth0Sub: params.auth0Sub,
      token: sessionToken,
      ipAddress: params.ipAddress || '127.0.0.1',
      userAgent: params.userAgent || 'WebBrowser/UIverse',
      loggedInAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: 'active',
    };

    this.data.loginSessions.unshift(session);
    // Keep max 500 recent sessions in log
    if (this.data.loginSessions.length > 500) {
      this.data.loginSessions = this.data.loginSessions.slice(0, 500);
    }
    this.save();
    return session;
  }

  public getSessionByToken(token: string): DbLoginSession | undefined {
    return this.data.loginSessions.find(
      (s) => s.token === token && s.status === 'active' && new Date(s.expiresAt) > new Date()
    );
  }

  public getRecentSessions(limit = 25): DbLoginSession[] {
    return this.data.loginSessions.slice(0, limit);
  }

  // Downloads tracking in database
  public recordDownload(params: {
    userId: string;
    userEmail: string;
    designId: string;
    designName: string;
    format: 'zip-html' | 'zip-react';
    priceType: 'free' | 'premium';
  }): DbDownloadRecord {
    const record: DbDownloadRecord = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      userEmail: params.userEmail,
      designId: params.designId,
      designName: params.designName,
      format: params.format,
      priceType: params.priceType,
      downloadedAt: new Date().toISOString(),
    };

    this.data.downloads.unshift(record);

    // Update user's download count
    const user = this.findUserById(params.userId);
    if (user) {
      user.downloadCount = (user.downloadCount || 0) + 1;
    }

    this.save();
    return record;
  }

  public getDownloadsByUser(userId: string): DbDownloadRecord[] {
    return this.data.downloads.filter((d) => d.userId === userId);
  }

  public getAllDownloads(limit = 30): DbDownloadRecord[] {
    return this.data.downloads.slice(0, limit);
  }

  public getDatabaseStats() {
    return {
      totalUsers: this.data.users.length,
      totalLoginSessions: this.data.loginSessions.length,
      totalDownloads: this.data.downloads.length,
      dbPath: DB_FILE,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const db = new DatabaseService();
