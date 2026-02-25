import Link from 'next/link';
import Image from 'next/image';
import articles from '@/data/articles.json';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academy — Degen Education & Guides',
  description: 'Educational content for degens. Learn to read charts, spot rugs, and survive the memecoin trenches.',
  alternates: { canonical: 'https://memedesk.co/academy' },
  openGraph: {
    title: 'Academy | MemeDesk',
    description: 'Educational content for degens. Learn to read charts, spot rugs, and survive.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Academy | MemeDesk',
    description: 'Educational content for degens. Learn to read charts, spot rugs, and survive.',
  },
};

export default function AcademyPage() {
  const filtered = articles
    .filter((a: any) => a.category === 'academy')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const signalColors: Record<string, string> = {
    legit: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
    speculative: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-300',
    shill: 'border-red-400/60 bg-red-400/10 text-red-300',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🎓</span>
          <div>
            <h1 className="text-3xl font-bold">Academy</h1>
            <p className="mt-1 text-sm text-white/60">
              Degen education — learn to read charts, spot rugs, manage risk,
              and survive the memecoin trenches.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/40">{filtered.length} lesson{filtered.length !== 1 ? 's' : ''} published</p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white/40">No lessons yet. Class is about to start... stay tuned.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((article: any) => (
            <Link
              key={article.id}
              href={`/academy/${article.slug}`}
              className="group block overflow-hidden rounded-2xl border border-cyan-400/10 bg-white/5 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              {article.heroImage && (
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image src={article.heroImage} alt={article.headline} fill className="object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/60 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 backdrop-blur">
                      🎓 {article.signalLabel}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                  {!article.heroImage && (
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-semibold ${signalColors[article.signalRating] || signalColors.speculative}`}>
                      {article.signalEmoji} {article.signalLabel}
                    </span>
                  )}
                  <span>{article.chain}</span>
                  <span>·</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-cyan-300">{article.headline}</h2>
                <p className="mt-1 text-sm text-white/50 line-clamp-2">{article.subheadline}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.tags?.slice(0, 4).map((tag: string) => (
                    <span key={tag} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/50">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
