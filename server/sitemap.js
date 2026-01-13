/**
 * Dynamic Sitemap Generator
 * 
 * Generates XML sitemaps dynamically by fetching comics and chapters from the API.
 * Implements caching to avoid excessive API calls.
 */

import axios from 'axios';

const BASE_URL = 'https://komikcast.co.id';
const API_BASE = 'https://www.sankavollerei.com/comic';

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// Simple in-memory cache
let comicsCache = {
  data: null,
  timestamp: 0
};

/**
 * Fetch all comics from the API with caching
 */
async function fetchAllComics() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (comicsCache.data && (now - comicsCache.timestamp) < CACHE_DURATION) {
    return comicsCache.data;
  }

  try {
    // Fetch from multiple pages to get all comics
    const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const responses = await Promise.all(
      pages.map(page => 
        axios.get(`${API_BASE}/terbaru?page=${page}`)
          .catch(() => ({ data: { comics: [] } }))
      )
    );

    const allComics = responses.flatMap(response => response.data.comics || []);
    
    // Remove duplicates by title
    const uniqueComics = allComics.filter((comic, index, self) =>
      index === self.findIndex(c => c.title === comic.title)
    );

    // Filter out non-comic entries
    const filteredComics = uniqueComics.filter(item => 
      !item.title.toLowerCase().includes('apk') && 
      !item.chapter?.toLowerCase().includes('download')
    );

    // Process comics to generate slugs
    const processedComics = filteredComics.map(comic => {
      const slug = comic.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return {
        title: comic.title,
        slug: slug,
        chapter: comic.chapter,
        link: comic.link
      };
    });

    // Update cache
    comicsCache = {
      data: processedComics,
      timestamp: now
    };

    return processedComics;
  } catch (error) {
    console.error('Error fetching comics for sitemap:', error.message);
    return comicsCache.data || [];
  }
}

/**
 * Generate XML for a URL entry
 */
function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate sitemap index (points to child sitemaps)
 */
export function generateSitemapIndex(req) {
  const protocol = req.secure ? 'https' : 'http';
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  const today = getCurrentDate();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/api/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap-comics.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * Generate sitemap for static pages
 */
export function generateStaticSitemap() {
  const today = getCurrentDate();
  
  const staticPages = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/terbaru', changefreq: 'daily', priority: '0.9' },
    { path: '/trending', changefreq: 'daily', priority: '0.9' },
    { path: '/pustaka', changefreq: 'daily', priority: '0.8' },
    { path: '/unlimited', changefreq: 'daily', priority: '0.8' },
    { path: '/history', changefreq: 'weekly', priority: '0.5' },
    { path: '/kebijakan-privasi', changefreq: 'monthly', priority: '0.3' },
    { path: '/tentang-kami', changefreq: 'monthly', priority: '0.4' },
    { path: '/kontak', changefreq: 'monthly', priority: '0.4' },
    { path: '/pedoman-editorial', changefreq: 'monthly', priority: '0.3' },
    { path: '/dmca', changefreq: 'monthly', priority: '0.3' },
    { path: '/faq', changefreq: 'monthly', priority: '0.5' },
  ];

  const urls = staticPages.map(page => 
    urlEntry(`${BASE_URL}${page.path}`, today, page.changefreq, page.priority)
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate sitemap for all comics
 */
export async function generateComicsSitemap() {
  const today = getCurrentDate();
  const comics = await fetchAllComics();

  const urls = comics.map(comic => 
    urlEntry(
      `${BASE_URL}/detail-comic/${comic.slug}`,
      today,
      'weekly',
      '0.8'
    )
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Clear the comics cache (useful after new content is added)
 */
export function clearSitemapCache() {
  comicsCache = {
    data: null,
    timestamp: 0
  };
}

// Export for testing/debugging
export { fetchAllComics };
