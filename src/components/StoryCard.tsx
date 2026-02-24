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
  tags?: string[];
  kol?: {
    handle: string;
    name: string;
  };
}

export default function StoryCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`}>
      <article className="group flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10">
        <div className="flex items-start justify-between">
          <span className="text-2xl">{article.signalEmoji}</span>
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
