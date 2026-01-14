import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
  title = 'Komikcast - Baca Komik Online Tanpa Iklan Bahasa Indonesia',
  description = 'Komikcast menghadirkan pengalaman baca komik online terbaik bahasa Indonesia. Dari One Piece sampai Apotheosis, semua tersedia gratis tanpa iklan',
  keywords = 'komikcast, komik indonesia, baca komik gratis, komik online, manga indonesia, manhwa indonesia, komik terbaru, komik trending, one piece, apotheosis',
  image = 'https://cloudassetskita.com/uploads/kclogo-d386495e.png',
  url,  // Optional - will auto-detect from current route if not provided
  type = 'website',
  structuredData = null
}) => {
  const siteTitle = 'Komikcast';
  const fullTitle = title.includes(siteTitle) ? title : `${title} - ${siteTitle}`;

  const location = useLocation();
<<<<<<< HEAD
  const baseUrl = 'https://s1.komikcast00.co.id';
=======
  const baseUrl = 'https://komikcast.co.id';
>>>>>>> 85a5b46c5b559e9e093417a671157890aef146b8
  
  // Auto-detect URL from current route if not explicitly provided
  const rawUrl = url || `${baseUrl}${location.pathname}`;
  
  // Ensure canonical URL is absolute, HTTPS, and clean (no query/hash)
  let canonicalUrl = rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
  
  // Strip query parameters and hash fragments from canonical URL
  try {
    const urlObj = new URL(canonicalUrl);
    canonicalUrl = `${urlObj.origin}${urlObj.pathname}`;
  } catch {
    // Fallback if URL parsing fails
    canonicalUrl = canonicalUrl.split('?')[0].split('#')[0];
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
