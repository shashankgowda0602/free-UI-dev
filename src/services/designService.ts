import { DesignItem, CategoryType, DesignPurpose, TechType, PriceType, AnimationType, SortOption } from '../types';
import rawDesigns from '../data/designs.json';

export interface FilterCriteria {
  search?: string;
  purpose?: DesignPurpose | 'All';
  category?: CategoryType;
  technology?: TechType | 'All';
  priceType?: PriceType | 'All';
  animationType?: AnimationType | 'All';
  screenSize?: 'Desktop' | 'Tablet' | 'Mobile' | 'All';
  theme?: 'dark' | 'light' | 'All';
  sortBy?: SortOption;
}

// In-memory catalog with state
let cachedDesigns: DesignItem[] = (rawDesigns as unknown) as DesignItem[];

/**
 * Simulates an asynchronous data fetch using Fetch/Promise with network realism.
 */
export async function getDesigns(filters: FilterCriteria = {}): Promise<DesignItem[]> {
  // Simulate lightweight network resolution
  await new Promise((resolve) => setTimeout(resolve, 80));

  let results = [...cachedDesigns];

  // 1. Text Search Filter (name, shortDescription, tags, category, purpose)
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // 2. Purpose Filter (Segregation by Purpose)
  if (filters.purpose && filters.purpose !== 'All') {
    results = results.filter((item) => item.purpose === filters.purpose);
  }

  // 3. Category Filter
  if (filters.category && filters.category !== 'All') {
    results = results.filter((item) => item.category === filters.category);
  }

  // 3. Technology Filter
  if (filters.technology && filters.technology !== 'All') {
    results = results.filter((item) => item.technology === filters.technology);
  }

  // 4. Price Type Filter
  if (filters.priceType && filters.priceType !== 'All') {
    results = results.filter((item) => item.priceType === filters.priceType);
  }

  // 5. Animation Type Filter
  if (filters.animationType && filters.animationType !== 'All') {
    results = results.filter((item) => item.animationType === filters.animationType);
  }

  // 6. Screen Size Filter
  if (filters.screenSize && filters.screenSize !== 'All') {
    results = results.filter((item) => item.supportedScreens.includes(filters.screenSize as 'Desktop' | 'Tablet' | 'Mobile'));
  }

  // 7. Theme Filter
  if (filters.theme && filters.theme !== 'All') {
    results = results.filter((item) => item.defaultConfig.themeMode === filters.theme);
  }

  // 8. Sorting
  const sortBy = filters.sortBy || 'popular';
  results.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.favoritesCount - a.favoritesCount;
      case 'downloads':
        return b.downloadsCount - a.downloadsCount;
      case 'newest':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return results;
}

export async function getDesignBySlug(slug: string): Promise<DesignItem | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const found = cachedDesigns.find((item) => item.slug === slug || item.id === slug);
  return found || null;
}

export async function getFeaturedDesigns(): Promise<DesignItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return cachedDesigns.filter((item) => item.featured).slice(0, 6);
}

export async function getTrendingDesigns(): Promise<DesignItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return cachedDesigns.filter((item) => item.trending).slice(0, 8);
}

export async function getFreeDesigns(): Promise<DesignItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return cachedDesigns.filter((item) => item.priceType === 'free');
}

export async function getRelatedDesigns(currentId: string, category: CategoryType): Promise<DesignItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return cachedDesigns
    .filter((item) => item.id !== currentId && item.category === category)
    .slice(0, 3);
}
