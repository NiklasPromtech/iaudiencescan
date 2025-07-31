import { useEffect } from 'react';

const Sitemap = () => {
  useEffect(() => {
    // Redirect to the actual sitemap.xml file in public folder
    window.location.href = '/sitemap.xml';
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', padding: '20px' }}>
      {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://audiencescan.io/</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/blog</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/blog/addressable-audiences</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/blog/personal-letter</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/blog/guaranteed-results</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/blog/tutorials</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/case-studies</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/pricing</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://audiencescan.io/proposed-features</loc>
    <lastmod>2025-01-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`}
    </div>
  );
};

export default Sitemap;