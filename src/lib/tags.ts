import { getAllArticles, type Article } from '@/lib/articles';

/**
 * Convert a tag display name to a URL slug
 * "Pump.fun" → "pump-fun"
 * "AI Agents" → "ai-agents"
 * "Solana" → "solana"
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // strip special chars (periods, $, etc.)
    .trim()
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-')           // collapse multiple hyphens
    .replace(/^-|-$/g, '');        // trim leading/trailing hyphens
}

/**
 * Build slug → original tag mapping from all articles
 * Returns the first canonical form found (case-preserved)
 */
export function buildSlugToTagMap(): Map<string, string> {
  const articles = getAllArticles();
  const map = new Map<string, string>();
  for (const article of articles) {
    for (const tag of article.tags) {
      const slug = tagToSlug(tag);
      if (!map.has(slug)) {
        map.set(slug, tag);
      }
    }
  }
  return map;
}

/**
 * Convert a tag slug back to the original display tag
 * Returns null if slug doesn't match any known tag
 */
export function slugToTag(slug: string): string | null {
  const map = buildSlugToTagMap();
  return map.get(slug) ?? null;
}

export interface TagInfo {
  tag: string;
  slug: string;
  count: number;
}

/**
 * Get all tags sorted by article count (desc)
 */
export function getAllTags(): TagInfo[] {
  const articles = getAllArticles();
  const counts = new Map<string, { tag: string; count: number }>();

  for (const article of articles) {
    for (const tag of article.tags) {
      const slug = tagToSlug(tag);
      const existing = counts.get(slug);
      if (existing) {
        existing.count++;
      } else {
        counts.set(slug, { tag, count: 1 });
      }
    }
  }

  return Array.from(counts.entries())
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Get all articles that have a given tag slug
 */
export function getArticlesByTag(slug: string): Article[] {
  const tagName = slugToTag(slug);
  if (!tagName) return [];

  return getAllArticles().filter((article) =>
    article.tags.some((t) => tagToSlug(t) === slug)
  );
}

/** Category slug → URL path mapping */
export const CATEGORY_PATH: Record<string, string> = {
  news: 'highlights',
  alpha: 'alpha',
  autopsy: 'autopsy',
  'kol-watch': 'kol-watch',
  'market-pulse': 'runner-pulse',
  academy: 'academy',
};

export function articleUrl(article: Article): string {
  const prefix = CATEGORY_PATH[article.category] ?? 'news';
  return `/${prefix}/${article.slug}`;
}
