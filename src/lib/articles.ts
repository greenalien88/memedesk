import fs from 'fs';
import path from 'path';

export interface Article {
  id: string;
  slug: string;
  articleType: string;
  category: string;
  headline: string;
  subheadline: string;
  heroImage?: string | null;
  signalRating: string;
  signalEmoji: string;
  signalLabel: string;
  publishedAt: string;
  author: string;
  tags: string[];
  chain: string;
  tokenData?: Record<string, any>;
  kol?: Record<string, any>;
  sourcePost?: Record<string, any>;
  quotedPost?: Record<string, any>;
  tokens?: Array<Record<string, any>>;
  walletData?: Record<string, any>;
  body: Array<Record<string, any>>;
}

const ARTICLES_DIR = path.join(process.cwd(), 'src/data/articles');

export function getAllArticles(): Article[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
  return files
    .map(f => JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8')) as Article)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticle(slug: string): Article | null {
  const file = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as Article;
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(a => a.category === category);
}
