import type { MetadataRoute } from 'next';
import articles from '@/data/articles.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://memedesk.vercel.app';

  const articleEntries = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: new Date(a.publishedAt),
  }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/articles`, lastModified: new Date() },
    ...articleEntries,
    { url: `${base}/launches`, lastModified: new Date() },
    { url: `${base}/rug-watch`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
  ];
}
