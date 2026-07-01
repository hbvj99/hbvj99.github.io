import { getCollection } from 'astro:content';
import { getPostDate, getPostUrl } from '../utils/post';

export async function GET(context) {
  // Use the site URL defined in astro.config.mjs or fall back to production domain
  const siteUrl = context.site ? context.site.href : 'https://vijaypathak.com.np';
  const posts = await getCollection('posts');
  const todayStr = new Date().toISOString().split('T')[0];

  // Static site pages
  const staticPages = [
    { path: '', priority: '1.0' },
    { path: '/about/', priority: '0.8' },
    { path: '/contact/', priority: '0.8' },
    { path: '/posts/', priority: '0.8' },
    { path: '/privacy/', priority: '0.5' }
  ].map(p => ({
    url: `${siteUrl.replace(/\/$/, '')}${p.path}`,
    lastmod: todayStr,
    priority: p.priority
  }));

  // Dynamic posts
  const postPages = posts.map(post => {
    const postDate = getPostDate(post);
    const lastmodStr = postDate.toISOString().split('T')[0];
    return {
      url: `${siteUrl.replace(/\/$/, '')}${getPostUrl(post)}`,
      lastmod: lastmodStr,
      priority: '0.7'
    };
  });

  // Combine lists
  const allPages = [...staticPages, ...postPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
