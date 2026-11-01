export type CategoryType =
  | 'All'
  | 'Landing Page'
  | 'Dashboard'
  | 'E-commerce'
  | 'Auth'
  | 'Components'
  | 'Portfolio'
  | 'FinTech'
  | 'Navigation';

export type DesignPurpose =
  | 'Hero & Animation'
  | 'Button UI'
  | 'Icon Designs'
  | 'Components'
  | 'Crazy Loaders & Toggles'
  | 'Full Templates';

export type TechType =
  | 'React + Tailwind'
  | 'HTML5 + Modern CSS'
  | 'Vue + Tailwind'
  | 'Next.js App';

export type PriceType = 'free' | 'premium';

export type AnimationType =
  | 'Framer Motion'
  | 'CSS Keyframes'
  | 'WebGL/Canvas'
  | 'Smooth Transitions'
  | 'Micro-interactions';

export interface CustomizationConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentGradient: string;
  fontFamily: string;
  fontSize: number; // in px
  borderRadius: number; // in px
  shadowLevel: 'none' | 'subtle' | 'medium' | 'dramatic';
  spacing: 'compact' | 'normal' | 'relaxed';
  buttonStyle: 'solid' | 'outline' | 'glass' | 'glow';
  animationSpeed: 'slow' | 'normal' | 'fast';
  themeMode: 'dark' | 'light';
  sampleHeadline: string;
  sampleButtonText: string;
}

export interface DesignSourceCode {
  html: string;
  css: string;
  js?: string;
  reactJsx?: string;
  instructions: string;
}

export interface DesignItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  purpose: DesignPurpose;
  category: CategoryType;
  tags: string[];
  technology: TechType;
  priceType: PriceType;
  supportedScreens: ('Desktop' | 'Tablet' | 'Mobile')[];
  animationType: AnimationType;
  license: 'MIT' | 'UIverse Commercial' | 'Creative Commons 4.0';
  updatedAt: string;
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  favoritesCount: number;
  downloadsCount: number;
  defaultConfig: CustomizationConfig;
  sourceCode: DesignSourceCode;
  previewVariant: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  coverSlug?: string;
  designIds: string[];
  isCurated?: boolean;
  createdAt: string;
}

export interface CustomizedDesignItem {
  id: string;
  designId: string;
  designName: string;
  name: string;
  updatedAt: string;
  config: CustomizationConfig;
}

export interface DownloadHistoryItem {
  id: string;
  designId: string;
  designName: string;
  downloadedAt: string;
  format: 'zip-html' | 'zip-react';
  priceType: PriceType;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  isDemoUser: boolean;
  authProvider?: 'auth0' | 'local' | 'auth0-github' | 'auth0-google' | 'demo';
  auth0Sub?: string;
  roles?: string[];
  savedDesignIds: string[];
  collections: CollectionItem[];
  customizedDesigns: CustomizedDesignItem[];
  downloadHistory: DownloadHistoryItem[];
}

export type SortOption = 'popular' | 'newest' | 'name-asc' | 'downloads';
