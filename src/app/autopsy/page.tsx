import Link from 'next/link';
import Image from 'next/image';
import articles from '@/data/articles.json';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autopsy — Deep Dives into Dead Coins',
  description: 'Forensic post-mortems on rug pulls, project deaths, and the biggest meme coin disasters. Learn from the wreckage.',
  alternates: { canonical: 'https://memedesk.co/autopsy' },
  openGraph: {
    title: 'Autopsy | MemeDesk',
    description: 'Forensic post-mortems on rug pulls, project deaths, and the biggest meme coin disasters.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Autopsy | MemeDesk',
    description: 'Forensic post-mortems on rug pulls, project deaths, and the biggest meme coin disasters.',
  },
};

export default function AutopsyPage() {
  const autopsies = articles
    .filter((a: any) => a.category === 'autopsy')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const signalColors: Record<string, string> = {
    legit: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
    speculative: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-300',
    shill: 'border-red-400/60 bg-red-400/10 text-red-300',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🪦</span>
          <div>
            <h1 className="text-3xl font-bold">Autopsy</h1>
            <p className="mt-1 text-sm text-white/60">
              Forensic deep dives into dead coins, rug pulls, and project failures. 
              Learn from the wreckage so you don&apos;t become the next victim.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/40">{autopsies.length} post-mortem{autopsies.length !== 1 ? 's' : ''} published</p>
      </div>

      {autopsies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white/40">No autopsies yet. The graveyard is empty... for now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {autopsies.map((article: any) => (
            <Link
              key={article.id}
              href={`/autopsy/${article.slug}`}
              className="group block overflow-hidden rounded-2xl border border-red-400/10 bg-white/5 transition hover:border-red-400/30 hover:bg-white/[0.07]"
            >
              {article.heroImage && (
                <div className="relative aspect-[3/1] w-full overflow-hidden">
                  <Image
                    src={article.heroImage}
                    alt={article.headline}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-400/60 bg-red-400/10 px-2.5 py-0.5 text-xs font-semibold text-red-300 backdrop-blur">
                      🔴 {article.signalLabel}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                  {!article.heroImage && (
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-semibold ${signalColors[article.signalRating] || signalColors.shill}`}>
                      {article.signalEmoji} {article.signalLabel}
                    </span>
                  )}
                  <span>{article.chain}</span>
                  <span>·</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {article.tokenData && (
                    <>
                      <span>·</span>
                      <span className="text-red-400">${article.tokenData.symbol}</span>
                    </>
                  )}
                </div>
                <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-red-300">{article.headline}</h2>
                <p className="mt-1 text-sm text-white/50 line-clamp-2">{article.subheadline}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.tags?.slice(0, 4).map((tag: string) => (
                    <span key={tag} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/50">
                      {tag}
                    </span>
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
