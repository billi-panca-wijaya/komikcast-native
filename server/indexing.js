/**
 * Google Instant Indexing API Service
 * 
 * This module handles Google Indexing API requests for instant URL indexing.
 * The service account credentials should be stored in environment variables
 * or a secure credentials file (never in source code).
 * 
 * SETUP REQUIREMENTS:
 * 1. Create a service account in Google Cloud Console
 * 2. Enable the "Indexing API" for your project
 * 3. Download the JSON key file
 * 4. Add the service account email to Google Search Console as an owner
 * 5. Set GOOGLE_APPLICATION_CREDENTIALS env var to the path of your JSON key
 *    OR set individual env vars: GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY
 */

import { google } from 'googleapis';

// Indexing API types
const INDEXING_TYPES = {
  URL_UPDATED: 'URL_UPDATED',
  URL_DELETED: 'URL_DELETED'
};

/**
 * Get authenticated client for Google Indexing API
 */
async function getAuthClient() {
  // Option 1: Use GOOGLE_APPLICATION_CREDENTIALS environment variable
  // This should point to your service account JSON file
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    return auth.getClient();
  }
  
  // Option 2: Use individual environment variables
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!clientEmail || !privateKey) {
    throw new Error(
      'Missing Google API credentials. Set either GOOGLE_APPLICATION_CREDENTIALS ' +
      'or both GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.'
    );
  }
  
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });
  
  return auth;
}

/**
 * Submit a URL for indexing
 * @param {string} url - The URL to index
 * @param {string} type - Either 'URL_UPDATED' or 'URL_DELETED'
 * @returns {Promise<object>} - API response
 */
export async function submitUrlForIndexing(url, type = INDEXING_TYPES.URL_UPDATED) {
  try {
    const auth = await getAuthClient();
    const indexing = google.indexing({ version: 'v3', auth });
    
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type
      }
    });
    
    console.log(`✅ Indexing request submitted for: ${url}`);
    console.log(`   Type: ${type}`);
    console.log(`   Response:`, response.data);
    
    return {
      success: true,
      url: url,
      type: type,
      data: response.data
    };
  } catch (error) {
    console.error(`❌ Indexing failed for: ${url}`);
    console.error(`   Error:`, error.message);
    
    return {
      success: false,
      url: url,
      type: type,
      error: error.message,
      details: error.response?.data
    };
  }
}

/**
 * Submit multiple URLs for indexing (batch)
 * @param {string[]} urls - Array of URLs to index
 * @param {string} type - Either 'URL_UPDATED' or 'URL_DELETED'
 * @returns {Promise<object[]>} - Array of API responses
 */
export async function submitBatchForIndexing(urls, type = INDEXING_TYPES.URL_UPDATED) {
  const results = [];
  
  // Google allows up to 200 requests per day for the Indexing API
  // Process sequentially to avoid rate limiting
  for (const url of urls) {
    const result = await submitUrlForIndexing(url, type);
    results.push(result);
    
    // Small delay between requests to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n📊 Batch indexing complete: ${successful} succeeded, ${failed} failed`);
  
  return results;
}

/**
 * Get the metadata/status of a URL's indexing
 * @param {string} url - The URL to check
 * @returns {Promise<object>} - Metadata about the URL's indexing status
 */
export async function getUrlIndexingStatus(url) {
  try {
    const auth = await getAuthClient();
    const indexing = google.indexing({ version: 'v3', auth });
    
    const response = await indexing.urlNotifications.getMetadata({
      url: url
    });
    
    return {
      success: true,
      url: url,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      url: url,
      error: error.message,
      details: error.response?.data
    };
  }
}

// Export types for convenience
export { INDEXING_TYPES };
