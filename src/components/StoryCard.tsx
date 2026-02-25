import Link from 'next/link';
import Image from 'next/image';
import ChainBadge from '@/components/ChainBadge';
import { timeAgo } from '@/lib/format';

import type { Article } from '@/lib/articles';

const categoryMeta: Record<string, { label: string; color: string; path: string }> = {
  news: { label: 'News', color: 'border-red-400/40 bg-red-400/10 text-red-300', path: '/news' },
  alpha: { label: 'Alpha', color: 'border-violet-400/40 bg-violet-400/10 text-violet-300', path: '/alpha' },
  launchpad: { label: 'Launch Pad', color: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300', path: '/launchpad' },
  autopsy: { label: 'Autopsy', color: 'border-gray-400/40 bg-gray-400/10 text-gray-300', path: '/autopsy' },
  'kol-watch': { label: 'KOL Watch', color: 'border-amber-400/40 bg-amber-400/10 text-amber-300', path: '/kol-watch' },
  'market-pulse': { label: 'Market Pulse', color: 'border-blue-400/40 bg-blue-400/10 text-blue-300', path: '/market-pulse' },
  academy: { label: 'Academy', color: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300', path: '/academy' },
};

const signalStyles: Record<string, string> = {
  legit: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300',
  speculative: 'border-yellow-400/50 bg-yellow-400/10 text-yellow-300',
  shill: 'border-red-400/50 bg-red-400/10 text-red-300',
};

export default function StoryCard({ article }: { article: Article }) {
  const cat = categoryMeta[article.category || 'news'] || categoryMeta.news;
  const href = `${cat.path}/${article.slug}`;
  const signalStyle = signalStyles[article.signalRating] || signalStyles.speculative;

  return (
    <Link href={href}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10">
        {/* Thumbnail */}
        {article.heroImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={article.heroImage}
              alt={article.headline}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Signal badge overlaid on image */}
            <div className={`absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ${signalStyle}`}>
              {article.signalEmoji} {article.signalRating}
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cat.color}`}>
              {cat.label}
            </span>
            <ChainBadge chain={article.chain} />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold leading-snug text-white group-hover:text-emerald-300">{article.headline}</h3>
            {article.subheadline && (
              <p className="mt-1.5 text-xs text-white/60 line-clamp-2">{article.subheadline}</p>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/40">
            <span>{timeAgo(article.publishedAt)}</span>
            {!article.heroImage && (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold ${signalStyle}`}>
                {article.signalEmoji} {article.signalRating}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
