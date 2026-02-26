import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllTags, getArticlesByTag, slugToTag, articleUrl, tagToSlug } from '@/lib/tags';
import type { Article } from '@/lib/articles';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const tagName = slugToTag(slug);
  if (!tagName) return { title: 'Tag Not Found | MemeDesk' };

  return {
    title: `${tagName} Meme Coin News & Analysis | MemeDesk`,
    description: `All MemeDesk coverage tagged ${tagName} — KOL calls, alpha, rug autopsies, and market signals.`,
    alternates: { canonical: `https://memedesk.co/tags/${slug}` },
    openGraph: {
      title: `${tagName} Meme Coin News & Analysis | MemeDesk`,
      description: `All MemeDesk coverage tagged ${tagName} — KOL calls, alpha, rug autopsies, and market signals.`,
      type: 'website',
      url: `https://memedesk.co/tags/${slug}`,
    },
    twitter: {
      card: 'summary',
      title: `${tagName} Meme Coin News & Analysis | MemeDesk`,
      description: `All MemeDesk coverage tagged ${tagName} — KOL calls, alpha, rug autopsies, and market signals.`,
    },
  };
}

const signalColors: Record<string, string> = {
  legit: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
  speculative: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-300',
  shill: 'border-red-400/60 bg-red-400/10 text-red-300',
};

const categoryLabels: Record<string, string> = {
  news: 'News',
  alpha: 'Alpha',
  autopsy: 'Autopsy',
  launchpad: 'Launchpad',
  'kol-watch': 'KOL Watch',
  'market-pulse': 'Market Pulse',
  academy: 'Academy',
};

function ArticleCard({ article }: { article: Article }) {
  const published = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={articleUrl(article)}
      className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.08]"
    >
      {/* Signal + Category badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            signalColors[article.signalRating] ?? signalColors.speculative
          }`}
        >
          {article.signalEmoji} {article.signalLabel}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">
          {categoryLabels[article.category] ?? article.category}
        </span>
      </div>

      {/* Headline */}
      <h2 className="text-base font-bold leading-snug text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
        {article.headline}
      </h2>

      {/* Subheadline */}
      <p className="text-sm leading-relaxed text-white/60 line-clamp-2">
        {article.subheadline}
      </p>

      {/* Date */}
      <time className="mt-auto text-xs text-white/40" dateTime={article.publishedAt}>
        {published}
      </time>
    </Link>
  );
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: slug } = await params;
  const tagName = slugToTag(slug);
  if (!tagName) notFound();

  const articles = getArticlesByTag(slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://memedesk.co' },
      { '@type': 'ListItem', position: 2, name: 'Tags', item: 'https://memedesk.co/tags' },
      { '@type': 'ListItem', position: 3, name: tagName, item: `https://memedesk.co/tags/${slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/" className="hover:text-white/70 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/tags" className="hover:text-white/70 transition-colors">
          Tags
        </Link>
        <span>/</span>
        <span className="text-white/70">#{tagName}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="mb-2 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/5 px-4 py-1.5 text-sm font-semibold text-emerald-300">
          #{tagName}
        </div>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          {articles.length} article{articles.length !== 1 ? 's' : ''} tagged{' '}
          <span className="text-emerald-300">#{tagName}</span>
        </h1>
        <p className="mt-2 text-white/50">
          All MemeDesk coverage on {tagName} — KOL calls, alpha, rug autopsies, and market signals.
        </p>
      </header>

      {/* Article grid */}
      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white/40">No articles found for this tag.</p>
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-12 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
        <div className="text-lg font-bold text-white">🐸 Browse all tags</div>
        <div className="mt-1 text-sm text-white/60">
          Explore every topic covered on MemeDesk.
        </div>
        <Link
          href="/tags"
          className="mt-4 inline-block rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
        >
          View all tags →
        </Link>
      </div>
    </div>
  );
}
