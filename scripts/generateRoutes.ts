/**
 * Dynamic Routes Generator for Sitemap
 * 
 * This script fetches all comics from the API and generates
 * dynamic route URLs for the sitemap at build time.
 */

const API_BASE = 'https://www.sankavollerei.com/comic';

interface Comic {
  title: string;
  chapter?: string;
}

interface ApiResponse {
  comics?: Comic[];
}

/**
 * Generate slug from comic title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch all comics from the API
 */
async function fetchAllComics(): Promise<Comic[]> {
  const allComics: Comic[] = [];
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (const page of pages) {
    try {
      const response = await fetch(`${API_BASE}/terbaru?page=${page}`);
      if (!response.ok) continue;
      
      const data: ApiResponse = await response.json();
      const comics = data.comics || [];
      allComics.push(...comics);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to fetch page ${page}:`, errorMessage);
    }
  }

  // Remove duplicates by title
  const uniqueComics = allComics.filter((comic, index, self) =>
    index === self.findIndex(c => c.title === comic.title)
  );

  // Filter out non-comic entries
  const filteredComics = uniqueComics.filter(item => 
    item.title &&
    !item.title.toLowerCase().includes('apk') && 
    !item.chapter?.toLowerCase().includes('download')
  );

  return filteredComics;
}

/**
 * Generate dynamic routes for sitemap
 * Returns an array of route paths
 */
export async function generateDynamicRoutes(): Promise<string[]> {
  console.log('🔍 Fetching comics for sitemap...');
  
  const comics = await fetchAllComics();
  const routes: string[] = [];

  // Generate /detail-comic/:slug routes
  for (const comic of comics) {
    const slug = generateSlug(comic.title);
    routes.push(`/detail-comic/${slug}`);
  }

  console.log(`✅ Generated ${routes.length} dynamic routes for sitemap`);
  return routes;
}

/**
 * Static routes configuration
 * These are always included in the sitemap
 */
export const staticRoutes: string[] = [
  '/terbaru',
  '/trending',
  '/pustaka',
  '/unlimited',
  '/kebijakan-privasi',
  '/tentang-kami',
  '/kontak',
  '/pedoman-editorial',
  '/dmca',
  '/faq',
];

/**
 * Routes to exclude from sitemap
 * These patterns will be excluded from the generated sitemap
 */
export const excludedRoutes: string[] = [
  '/history',                    // User-specific (localStorage)
  '/statistics',                 // Admin dashboard
  '/google9a67ae197255e3b1',     // Google verification file
];
