import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import articles from '@/data/articles.json';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: 'Not Found | MemeDesk' };

  const imageUrl = `https://memedesk.vercel.app/images/articles/${slug}.webp`;

  return {
    title: `${article.headline} | MemeDesk`,
    description: article.subheadline,
    openGraph: {
      title: `${article.headline} | MemeDesk`,
      description: article.subheadline,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.headline} | MemeDesk`,
      description: article.subheadline,
      images: [imageUrl],
    },
  };
}

type Article = (typeof articles)[number];

function SignalBadge({ rating, emoji, label }: { rating: string; emoji: string; label: string }) {
  const colors: Record<string, string> = {
    legit: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
    speculative: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-300',
    shill: 'border-red-400/60 bg-red-400/10 text-red-300',
  };
  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${colors[rating] || colors.speculative}`}>
      <span className="text-lg">{emoji}</span> {label}
    </div>
  );
}

function TokenCard({ data }: { data: Article['tokenData'] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Token Data</div>
      <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <div className="text-white/40">Price</div>
          <div className="text-lg font-bold text-white">{data.price}</div>
        </div>
        <div>
          <div className="text-white/40">Market Cap</div>
          <div className="text-lg font-bold text-white">{data.marketCap}</div>
        </div>
        <div>
          <div className="text-white/40">ATH</div>
          <div className="text-lg font-bold text-white">{data.ath}</div>
        </div>
        <div>
          <div className="text-white/40">From ATH</div>
          <div className="text-lg font-bold text-red-400">{data.athDrop}</div>
        </div>
      </div>
      {data.recentAction && (
        <div className="mt-3 text-xs text-white/50">{data.recentAction}</div>
      )}
    </div>
  );
}

function KolCard({ kol }: { kol: Article['kol'] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">KOL Profile</div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20 text-xl">
          👤
        </div>
        <div className="flex-1">
          <div className="font-bold text-white">{kol.name}</div>
          <div className="text-sm text-emerald-300">{kol.handle} · {kol.followers} followers</div>
          <div className="mt-1 text-sm text-white/60">{kol.bio}</div>
          <div className="mt-1 text-xs text-white/40">Primary bag: {kol.primaryBag}</div>
        </div>
      </div>
    </div>
  );
}

function SourcePost({ post, quoted }: { post: Article['sourcePost']; quoted: Article['quotedPost'] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Source Post</div>
      <blockquote className="border-l-2 border-emerald-400/40 pl-4 text-white/90 italic">
        &ldquo;{post.text}&rdquo;
      </blockquote>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
        <span>💬 {post.engagement.replies}</span>
        <span>🔁 {post.engagement.reposts}</span>
        <span>❤️ {post.engagement.likes}</span>
        <span>👁 {(post.engagement.views / 1000).toFixed(1)}K</span>
      </div>
      {quoted && (
        <div className="mt-4 rounded-lg border border-white/5 bg-white/5 p-4">
          <div className="text-xs text-white/40">Quoting {quoted.handle} ({quoted.followers} followers)</div>
          <div className="mt-1 font-semibold text-white">{quoted.title}</div>
          <div className="mt-1 text-sm text-white/60">{quoted.summary}</div>
        </div>
      )}
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-xs text-emerald-400 hover:underline"
      >
        View original post →
      </a>
    </div>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const published = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description: article.subheadline,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: 'MemeDesk Editorial' },
    image: `https://memedesk.vercel.app/images/articles/${slug}.webp`,
    publisher: {
      '@type': 'Organization',
      name: 'MemeDesk',
      logo: { '@type': 'ImageObject', url: 'https://memedesk.vercel.app/icon.png' },
    },
  };

  return (
    <div className="mx-auto max-w-3xl py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Back */}
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70">
        ← Back to MemeDesk
      </Link>

      {/* Signal Rating */}
      <div className="mb-4">
        <SignalBadge rating={article.signalRating} emoji={article.signalEmoji} label={article.signalLabel} />
      </div>

      {/* Headline */}
      <h1 className="mb-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
        {article.headline}
      </h1>
      <p className="mb-4 text-lg text-white/60">{article.subheadline}</p>

      {/* Meta */}
      <div className="mb-8 flex flex-wrap gap-4 text-sm text-white/40">
        <span>{published}</span>
        <span>·</span>
        <span>{article.author}</span>
        <span>·</span>
        <span className="uppercase">{article.chain}</span>
      </div>

      {/* Tags */}
      <div className="mb-8 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
            #{tag}
          </span>
        ))}
      </div>

      {/* Hero Image */}
      {(article as any).heroImage && (
        <div className="relative mb-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/10">
          <Image
            src={(article as any).heroImage}
            alt={article.headline}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Source Post */}
      <div className="mb-8">
        <SourcePost post={article.sourcePost} quoted={article.quotedPost} />
      </div>

      {/* Token Data */}
      <div className="mb-8">
        <TokenCard data={article.tokenData} />
      </div>

      {/* Article Body */}
      <div className="prose-invert space-y-5">
        {article.body.map((block, i) => {
          if (block.type === 'heading') {
            return (
              <h2 key={i} className="mt-8 text-xl font-bold text-emerald-300">
                {block.text}
              </h2>
            );
          }
          return (
            <p key={i} className="leading-relaxed text-white/80">
              {block.text}
            </p>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-12 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
        <div className="text-lg font-bold text-white">🐸 Want more signal?</div>
        <div className="mt-1 text-sm text-white/60">
          MemeDesk delivers daily memecoin coverage. No shills, no cope — just the data.
        </div>
      </div>

      {/* Token ticker footer */}
      <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-sm">
        <span className="font-bold text-white">${article.tokenData.symbol}</span>
        <span className="mx-2 text-white/30">·</span>
        <span className="text-white/70">{article.tokenData.price}</span>
        <span className="mx-2 text-white/30">·</span>
        <span className="text-white/70">MC {article.tokenData.marketCap}</span>
        <span className="mx-2 text-white/30">·</span>
        <span className="text-red-400">{article.tokenData.athDrop} from ATH</span>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
