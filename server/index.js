import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  insertPageView,
  updatePopularPage,
  updateDailyStats,
  getPageViewsByDate,
  getPageViewsByHour,
  getPopularPages,
  getTotalStats,
  getRecentViews,
  getViewsByDevice,
  getViewsByCountry,
  detectDeviceType
} from './db.js';
import {
  submitUrlForIndexing,
  submitBatchForIndexing,
  getUrlIndexingStatus,
  INDEXING_TYPES
} from './indexing.js';

const app = express();

// Enable CORS
const allowedOrigins = [
  'http://45.127.34.136:5173',
  'https://backend-comic.antidonasi.web.id',
  'https://juju-manhwa-2-0.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Track page view
app.post('/api/track', async (req, res) => {
  try {
    const { pagePath, pageTitle, referrer } = req.body;
    const userAgent = req.get('user-agent') || '';

    // Detect device type from user agent
    const deviceType = detectDeviceType(userAgent);

    // Get country from Cloudflare header or default to Unknown
    const country = req.get('cf-ipcountry') || 'Unknown';

    // Insert page view with device and country info
    insertPageView.run(pagePath, pageTitle, userAgent, referrer, deviceType, country);

    // Update popular pages
    updatePopularPage.run(pagePath, pageTitle);

    // Update daily stats
    updateDailyStats.run();

    res.json({ success: true, message: 'Page view tracked' });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics overview
app.get('/api/stats/overview', (req, res) => {
  try {
    const stats = getTotalStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Error getting overview stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get daily views for last 30 days
app.get('/api/stats/daily', (req, res) => {
  try {
    const dailyViews = getPageViewsByDate.all();
    res.json(dailyViews);
  } catch (error) {
    console.error('Error getting daily stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get hourly views for today
app.get('/api/stats/hourly', (req, res) => {
  try {
    const hourlyViews = getPageViewsByHour.all();
    res.json(hourlyViews);
  } catch (error) {
    console.error('Error getting hourly stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get popular pages
app.get('/api/stats/popular', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const popularPages = getPopularPages.all(limit);
    res.json(popularPages);
  } catch (error) {
    console.error('Error getting popular pages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recent views
app.get('/api/stats/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const recentViews = getRecentViews.all(limit);
    res.json(recentViews);
  } catch (error) {
    console.error('Error getting recent views:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get views by device
app.get('/api/stats/device', (req, res) => {
  try {
    const deviceStats = getViewsByDevice.all();
    res.json(deviceStats);
  } catch (error) {
    console.error('Error getting device stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get views by country
app.get('/api/stats/country', (req, res) => {
  try {
    const countryStats = getViewsByCountry.all();
    res.json(countryStats);
  } catch (error) {
    console.error('Error getting country stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// Google Instant Indexing API Endpoints
// ============================================

// Middleware to verify admin API key for indexing endpoints
const verifyAdminKey = (req, res, next) => {
  const apiKey = req.headers['x-admin-key'] || req.query.key;
  const validKey = process.env.INDEXING_ADMIN_KEY;
  
  if (!validKey) {
    return res.status(500).json({ 
      success: false, 
      error: 'Server not configured for indexing. Set INDEXING_ADMIN_KEY in environment.' 
    });
  }
  
  if (apiKey !== validKey) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized. Invalid or missing admin key.' 
    });
  }
  
  next();
};

/**
 * POST /api/indexing/submit
 * Submit a single URL for indexing
 * Body: { url: string, type?: 'URL_UPDATED' | 'URL_DELETED' }
 * Headers: x-admin-key: YOUR_ADMIN_KEY
 */
app.post('/api/indexing/submit', verifyAdminKey, async (req, res) => {
  try {
    const { url, type } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    // Validate type if provided
    const validTypes = Object.values(INDEXING_TYPES);
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    const result = await submitUrlForIndexing(url, type);
    res.json(result);
  } catch (error) {
    console.error('Error submitting URL for indexing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/indexing/batch
 * Submit multiple URLs for indexing
 * Body: { urls: string[], type?: 'URL_UPDATED' | 'URL_DELETED' }
 * Headers: x-admin-key: YOUR_ADMIN_KEY
 */
app.post('/api/indexing/batch', verifyAdminKey, async (req, res) => {
  try {
    const { urls, type } = req.body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ success: false, error: 'URLs array is required' });
    }
    
    // Limit batch size (Google allows 200/day)
    if (urls.length > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Maximum 100 URLs per batch request' 
      });
    }
    
    const results = await submitBatchForIndexing(urls, type);
    
    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error batch indexing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/indexing/status
 * Get indexing status for a URL
 * Query: ?url=https://example.com/page
 * Headers: x-admin-key: YOUR_ADMIN_KEY
 */
app.get('/api/indexing/status', verifyAdminKey, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL query parameter is required' });
    }
    
    const result = await getUrlIndexingStatus(url);
    res.json(result);
  } catch (error) {
    console.error('Error getting indexing status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/indexing/auto
 * Auto-trigger indexing when a new chapter is published
 * This can be called from your admin panel or content management system
 * Body: { comicSlug: string, chapterNumber: string }
 */
app.post('/api/indexing/auto', verifyAdminKey, async (req, res) => {
  try {
    const { comicSlug, chapterNumber } = req.body;
    const baseUrl = 'https://komikcast.co.id';
    
    if (!comicSlug || !chapterNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'comicSlug and chapterNumber are required' 
      });
    }
    
    // Build URLs to index
    const urlsToIndex = [
      `${baseUrl}/read-comic/${comicSlug}/chapter-${chapterNumber}`,
      `${baseUrl}/detail-comic/${comicSlug}`,
      `${baseUrl}/terbaru` // Also update the "latest" page
    ];
    
    const results = await submitBatchForIndexing(urlsToIndex);
    
    res.json({
      success: true,
      message: `Indexing triggered for comic ${comicSlug} chapter ${chapterNumber}`,
      results: results
    });
  } catch (error) {
    console.error('Error auto-indexing:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 8062;
const API_URL = process.env.VITE_API_URL || 'https://backend-comic.antidonasi.web.id';

app.listen(port, () => {
  console.log(`🚀 Statistics API server running on ${API_URL}`);
  console.log(`📡 Indexing API endpoints available at /api/indexing/*`);
});
