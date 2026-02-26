import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { getAllTags } from '@/lib/tags';

// Maps category field → URL prefix
const CATEGORY_PATH: Record<string, string> = {
  news: 'news',
  alpha: 'alpha',
  autopsy: 'autopsy',
  launchpad: 'launchpad',
  'kol-watch': 'kol-watch',
  'market-pulse': 'market-pulse',
  academy: 'academy',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://memedesk.co';

  const articles = getAllArticles();

  const articleEntries = articles.map((a) => {
    const prefix = CATEGORY_PATH[a.category] ?? 'news';
    return {
      url: `${base}/${prefix}/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  const tags = getAllTags();

  const tagEntries = tags.map((t) => ({
    url: `${base}/tags/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/alpha`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/autopsy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/launchpad`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/kol-watch`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/market-pulse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/academy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/tags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...tagEntries,
    ...articleEntries,
  ];
}
