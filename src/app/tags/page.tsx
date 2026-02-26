import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllTags } from '@/lib/tags';

export const metadata: Metadata = {
  title: 'All Tags | MemeDesk',
  description: 'Browse all topics covered on MemeDesk — meme coins, Solana, AI narratives, rug autopsies, KOL calls, and more.',
  alternates: { canonical: 'https://memedesk.co/tags' },
  openGraph: {
    title: 'All Tags | MemeDesk',
    description: 'Browse all topics covered on MemeDesk.',
    type: 'website',
    url: 'https://memedesk.co/tags',
  },
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/" className="hover:text-white/70 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-white/70">Tags</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">All Tags</h1>
        <p className="mt-2 text-white/50">
          {tags.length} topics covered on MemeDesk — sorted by article count.
        </p>
      </header>

      {/* Tag grid */}
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, slug, count }) => (
          <Link
            key={slug}
            href={`/tags/${slug}`}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:border-emerald-400/30 hover:bg-emerald-400/5"
          >
            <span className="text-white/70 group-hover:text-emerald-300 transition-colors font-medium">
              #{tag}
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/40 group-hover:bg-emerald-400/10 group-hover:text-emerald-400 transition-colors">
              {count}
            </span>
          </Link>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white/40">No tags found.</p>
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-12 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
        <div className="text-lg font-bold text-white">🐸 Want more signal?</div>
        <div className="mt-1 text-sm text-white/60">
          MemeDesk delivers daily memecoin coverage. No shills, no cope — just the data.
        </div>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
        >
          Back to MemeDesk →
        </Link>
      </div>
    </div>
  );
}
