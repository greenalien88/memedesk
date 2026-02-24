import type { MetadataRoute } from 'next';
import articles from '@/data/articles.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://memedesk.co';

  const newsEntries = articles
    .filter((a: any) => a.category !== 'autopsy')
    .map((a) => ({
      url: `${base}/news/${a.slug}`,
      lastModified: new Date(a.publishedAt),
    }));

  const autopsyEntries = articles
    .filter((a: any) => a.category === 'autopsy')
    .map((a) => ({
      url: `${base}/autopsy/${a.slug}`,
      lastModified: new Date(a.publishedAt),
    }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/news`, lastModified: new Date() },
    { url: `${base}/autopsy`, lastModified: new Date() },
    ...newsEntries,
    ...autopsyEntries,
    { url: `${base}/about`, lastModified: new Date() },
  ];
}
