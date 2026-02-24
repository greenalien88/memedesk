import Link from 'next/link';
import Image from 'next/image';
import articles from '@/data/articles.json';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Every MemeDesk article — KOL calls, meme coin analysis, and degen signal reports.',
  alternates: { canonical: 'https://memedesk.vercel.app/articles' },
  openGraph: {
    title: 'All Articles | MemeDesk',
    description: 'Every MemeDesk article — KOL calls, meme coin analysis, and degen signal reports.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'All Articles | MemeDesk',
    description: 'Every MemeDesk article — KOL calls, meme coin analysis, and degen signal reports.',
  },
};

export default function ArticlesPage() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const signalColors: Record<string, string> = {
    legit: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
    speculative: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-300',
    shill: 'border-red-400/60 bg-red-400/10 text-red-300',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">All Articles</h1>
        <p className="mt-1 text-sm text-white/50">{sorted.length} reports published</p>
      </div>

      <div className="space-y-4">
        {sorted.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/[0.07]"
          >
            {(article as any).heroImage && (
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={(article as any).heroImage}
                  alt={article.headline}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-semibold ${signalColors[article.signalRating] || signalColors.speculative}`}
              >
                {article.signalEmoji} {article.signalLabel}
              </span>
              <span>{article.chain}</span>
              <span>·</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
{/* editorial */}
            </div>
            <h2 className="mt-2 text-lg font-semibold leading-snug">{article.headline}</h2>
            <p className="mt-1 text-sm text-white/50 line-clamp-2">{article.subheadline}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags?.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/50">
                  {tag}
                </span>
              ))}
            </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
