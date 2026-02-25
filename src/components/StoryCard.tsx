import Link from 'next/link';
import ChainBadge from '@/components/ChainBadge';
import { timeAgo } from '@/lib/format';

interface Article {
  slug: string;
  headline: string;
  subheadline?: string;
  publishedAt: string;
  chain: string;
  signalEmoji: string;
  signalRating: string;
  category?: string;
  tags?: string[];
  kol?: {
    handle: string;
    name: string;
  };
}

const categoryMeta: Record<string, { label: string; color: string; path: string }> = {
  news: { label: 'News', color: 'border-red-400/40 bg-red-400/10 text-red-300', path: '/news' },
  alpha: { label: 'Alpha', color: 'border-violet-400/40 bg-violet-400/10 text-violet-300', path: '/alpha' },
  launchpad: { label: 'Launch Pad', color: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300', path: '/launchpad' },
  autopsy: { label: 'Autopsy', color: 'border-gray-400/40 bg-gray-400/10 text-gray-300', path: '/autopsy' },
  'kol-watch': { label: 'KOL Watch', color: 'border-amber-400/40 bg-amber-400/10 text-amber-300', path: '/kol-watch' },
  'market-pulse': { label: 'Market Pulse', color: 'border-blue-400/40 bg-blue-400/10 text-blue-300', path: '/market-pulse' },
  academy: { label: 'Academy', color: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300', path: '/academy' },
};

export default function StoryCard({ article }: { article: Article }) {
  const cat = categoryMeta[article.category || 'news'] || categoryMeta.news;
  const href = `${cat.path}/${article.slug}`;

  return (
    <Link href={href}>
      <article className="group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10">
        <div className="flex items-start justify-between">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cat.color}`}>
            {cat.label}
          </span>
          <ChainBadge chain={article.chain} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300">{article.headline}</h3>
          {article.subheadline && (
            <p className="mt-2 text-sm text-white/70 line-clamp-3">{article.subheadline}</p>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{timeAgo(article.publishedAt)}</span>
          {article.kol && <span className="text-emerald-400/70">{article.kol.handle}</span>}
        </div>
      </article>
    </Link>
  );
}
