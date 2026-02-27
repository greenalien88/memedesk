import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllArticles, getArticle, type Article } from '@/lib/articles';
import { tagToSlug } from '@/lib/tags';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'Not Found | MemeDesk' };

  const imageUrl = `https://memedesk.co/images/news/${slug}.webp`;

  const ogImageUrl = `https://memedesk.co/images/og/${slug}-og.webp`;

  return {
    title: article.headline,
    description: article.subheadline,
    alternates: { canonical: `https://memedesk.co/market-pulse/${slug}` },
    openGraph: {
      title: `${article.headline} | MemeDesk`,
      description: article.subheadline,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.headline} | MemeDesk`,
      description: article.subheadline,
      images: [ogImageUrl],
    },
  };
}


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
  if (!data) return null;
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

function RunnerStatsTable({ stats }: { stats: NonNullable<Article['runnerStats']> }) {
  const scoreColor =
    stats.organicScore >= 80 ? 'text-emerald-400' :
    stats.organicScore >= 50 ? 'text-yellow-400' :
    'text-red-400';
  const scoreBg =
    stats.organicScore >= 80 ? 'bg-emerald-400' :
    stats.organicScore >= 50 ? 'bg-yellow-400' :
    'bg-red-400';
  const scoreBorder =
    stats.organicScore >= 80 ? 'border-emerald-400/30' :
    stats.organicScore >= 50 ? 'border-yellow-400/30' :
    'border-red-400/30';
  const priceIsNeg = stats.priceChange24h?.startsWith('-');

  return (
    <div className="w-full overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-400/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-400/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏃</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Runner Status</span>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${scoreBorder} ${scoreColor} bg-black/20`}>
          {stats.organicScoreLabel} organic
        </span>
      </div>

      {/* Stats grid — 2×2 on mobile, 4-col on sm+ */}
      <div className="grid grid-cols-2 divide-x divide-y divide-white/5 sm:grid-cols-4 sm:divide-y-0">
        {/* MCAP */}
        <div className="flex flex-col gap-1 px-5 py-4">
          <span className="text-xs text-white/40">Market Cap</span>
          <span className="text-xl font-bold text-white">{stats.mcap}</span>
          {stats.priceChange24h && (
            <span className={`text-xs font-semibold ${priceIsNeg ? 'text-red-400' : 'text-emerald-400'}`}>
              {stats.priceChange24h} 24h
            </span>
          )}
        </div>

        {/* 24h Vol */}
        <div className="flex flex-col gap-1 px-5 py-4">
          <span className="text-xs text-white/40">24h Volume</span>
          <span className="text-xl font-bold text-white">{stats.vol24h}</span>
          {stats.mcapRaw && stats.vol24hRaw && (
            <span className="text-xs text-white/30">
              {(stats.vol24hRaw / stats.mcapRaw).toFixed(1)}× mcap
            </span>
          )}
        </div>

        {/* Holders */}
        <div className="flex flex-col gap-1 px-5 py-4">
          <span className="text-xs text-white/40">Holders</span>
          <span className="text-xl font-bold text-white">{stats.holders.toLocaleString()}</span>
        </div>

        {/* Organic Score */}
        <div className="flex flex-col gap-1 px-5 py-4">
          <span className="text-xs text-white/40">Organic Score</span>
          <span className={`text-xl font-bold ${scoreColor}`}>{Math.round(stats.organicScore)}<span className="text-sm font-normal text-white/30">/100</span></span>
          {/* Progress bar */}
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className={`h-full rounded-full ${scoreBg}`} style={{ width: `${Math.min(stats.organicScore, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Snapshot timestamp */}
      {stats.snapshotAt && (
        <div className="border-t border-white/5 px-5 py-2 text-right text-xs text-white/20">
          Data snapshot: {new Date(stats.snapshotAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC
        </div>
      )}
    </div>
  );
}

function KolCard({ kol }: { kol: Article['kol'] }) {
  if (!kol) return null;
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
  if (!post) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Source Post</div>
      <blockquote className="border-l-2 border-emerald-400/40 pl-4 text-white/90 italic">
        &ldquo;{post.text}&rdquo;
      </blockquote>
      {post.engagement && (
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
        <span>💬 {post.engagement.replies}</span>
        <span>🔁 {post.engagement.reposts}</span>
        <span>❤️ {post.engagement.likes}</span>
        <span>👁 {(post.engagement.views / 1000).toFixed(1)}K</span>
      </div>
      )}
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

function getRelatedArticles(current: Article, allArticles: Article[], count = 3) {
  const others = allArticles.filter((a) => a.slug !== current.slug && (a as any).category === 'market-pulse');
  const scored = others.map((a) => {
    const sharedTags = a.tags.filter((t) => current.tags.includes(t)).length;
    const sameChain = a.chain === current.chain ? 1 : 0;
    return { article: a, score: sharedTags * 2 + sameChain };
  });
  scored.sort((a, b) => b.score - a.score || new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime());
  return scored.slice(0, count).map((s) => s.article);
}

function getReadingTime(body: Article['body']): number {
  const words = body.reduce((sum, block: any) => {
    if (block.text) return sum + block.text.split(/\s+/).length;
    if (block.bullets) return sum + block.bullets.join(' ').split(/\s+/).length;
    if (block.items) return sum + block.items.map((i: any) => `${i.question} ${i.answer}`).join(' ').split(/\s+/).length;
    if (block.reactions) return sum + block.reactions.map((r: any) => r.text).join(' ').split(/\s+/).length;
    return sum;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
}

// Inline markdown renderer: handles **bold**, *italic*, newlines
function renderMd(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, li) => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let last = 0, m;
    while ((m = regex.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      if (m[1] !== undefined) parts.push(<strong key={m.index}>{m[1]}</strong>);
      else if (m[2] !== undefined) parts.push(<em key={m.index}>{m[2]}</em>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return <Fragment key={li}>{parts}{li < lines.length - 1 && <br />}</Fragment>;
  });
}


export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const published = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const isoDate = new Date(article.publishedAt).toISOString();
  const readingTime = getReadingTime(article.body);
  const related = getRelatedArticles(article, getAllArticles());

  const signalColors: Record<string, string> = {
    legit: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
    speculative: 'border-yellow-400/60 bg-yellow-400/10 text-yellow-300',
    shill: 'border-red-400/60 bg-red-400/10 text-red-300',
  };

  const faqBlock = article.body.find((b: any) => b.type === 'faq') as any;
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description: article.subheadline,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: 'MemeDesk Editorial' },
    image: `https://memedesk.co/images/og/${slug}-og.webp`,
    publisher: {
      '@type': 'Organization',
      name: 'MemeDesk',
      logo: { '@type': 'ImageObject', url: 'https://memedesk.co/icon.png' },
    },
  };

  // Add FAQ schema if present (gets rich snippets in Google)
  const faqJsonLd = faqBlock?.items?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlock.items.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://memedesk.co' },
      { '@type': 'ListItem', position: 2, name: 'Runner Pulse', item: 'https://memedesk.co/market-pulse' },
      { '@type': 'ListItem', position: 3, name: article.headline, item: `https://memedesk.co/market-pulse/${slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <header>
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
        <div className="mb-8 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/40">
          <time dateTime={isoDate}>{published}</time>
          <span className="hidden sm:inline">·</span>
          <span>{article.author}</span>
          <span className="hidden sm:inline">·</span>
          <span className="uppercase">{article.chain}</span>
          <span className="hidden sm:inline">·</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tagToSlug(tag)}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 transition hover:border-emerald-400/30 hover:text-emerald-300">
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Hero Image */}
      {(article as any).heroImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border border-white/10">
          <Image
            src={(article as any).heroImage}
            alt={article.headline}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Runner Stats Table — runner-radar only */}
      {article.articleType === 'runner-radar' && article.runnerStats && (
        <div className="mb-8">
          <RunnerStatsTable stats={article.runnerStats} />
        </div>
      )}

      {/* Source Post */}
      {article.sourcePost && (
        <div className="mb-8">
          <SourcePost post={article.sourcePost} quoted={article.quotedPost} />
        </div>
      )}

      {/* Token Data — removed: static prices are misleading */}

      {/* News Body */}
      <section className="prose-invert space-y-5">
        {article.body.map((block: any, i: number) => {
          if (block.type === 'heading') {
            return (
              <h2 key={i} className="mt-8 text-xl font-bold text-emerald-300">
                {block.text}
              </h2>
            );
          }
          if (block.type === 'quickTake') {
            return (
              <div key={i} className="my-6 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">⚡ Quick Take</div>
                <ul className="space-y-2">
                  {(block.bullets || []).map((b: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="mt-1 text-emerald-400">→</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          if (block.type === 'trackRecord') {
            return (
              <div key={i} className="my-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">📊 KOL Track Record</div>
                {block.calls?.length > 0 ? (
                  <div className="space-y-2">
                    {block.calls.map((call: any, j: number) => (
                      <div key={j} className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{call.token}</span>
                          <span className={call.result === 'hit' ? 'text-emerald-400' : call.result === 'miss' ? 'text-red-400' : 'text-yellow-400'}>
                            {call.result === 'hit' ? '✅' : call.result === 'miss' ? '❌' : '⏳'} {call.result}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-white/50">
                          <span>{call.date}</span>
                          <span>{call.priceThen} → {call.priceNow}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/50 italic">Track record data limited — treat all signals with caution.</p>
                )}
              </div>
            );
          }
          if (block.type === 'communityReactions') {
            return (
              <div key={i} className="my-6 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/40">💬 What the Community Is Saying</div>
                {(block.reactions || []).map((r: any, j: number) => (
                  <div key={j} className={`rounded-xl border p-4 ${
                    r.sentiment === 'bull' ? 'border-emerald-400/20 bg-emerald-400/5' :
                    r.sentiment === 'bear' ? 'border-red-400/20 bg-red-400/5' :
                    'border-white/10 bg-white/5'
                  }`}>
                    <div className="mb-1 text-xs text-white/40">
                      {r.handle} {r.followers && `· ${r.followers} followers`}
                      {r.sentiment && <span className="ml-2">{r.sentiment === 'bull' ? '🟢' : r.sentiment === 'bear' ? '🔴' : '⚪'}</span>}
                    </div>
                    <p className="text-sm text-white/80 italic">&ldquo;{r.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            );
          }
          if (block.type === 'timeline') {
            return (
              <div key={i} className="my-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">🕐 Timeline</div>
                <div className="space-y-3 border-l-2 border-white/10 pl-4">
                  {(block.events || []).map((evt: any, j: number) => (
                    <div key={j} className="relative">
                      <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-emerald-400"></div>
                      <div className="text-xs font-semibold text-emerald-400">{evt.time}</div>
                      <div className="text-sm text-white/80">{evt.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (block.type === 'tokenTable') {
            return (
              <div key={i} className="my-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">📊 Token Overview</div>
                <div className="space-y-2">
                  {(block.tokens || []).map((t: any, j: number) => (
                    <div key={j} className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">${t.symbol}</span>
                        <span className={t.change?.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>{t.change}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-white/50">
                        <span>{t.price}</span>
                        <span>{t.mcap}</span>
                        {t.narrative && <span className="rounded-full bg-white/10 px-2 py-0.5">{t.narrative}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (block.type === 'statGrid') {
            return (
              <div key={i} className="my-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">📊 The Numbers</div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(block.stats || []).map((s: any, j: number) => (
                    <div key={j} className="rounded-lg border border-white/5 bg-white/5 p-3">
                      <div className="text-xs text-white/40">{s.label}</div>
                      <div className={`mt-1 text-sm font-bold ${s.highlight === 'green' ? 'text-emerald-400' : s.highlight === 'red' ? 'text-red-400' : 'text-white'}`}>{s.value}</div>
                      {s.note && <div className="mt-0.5 text-xs text-white/30">{s.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (block.type === 'projectCard') {
            return (
              <div key={i} className="my-6 rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">🔍 Project Info</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(block.fields || []).map((f: any, j: number) => (
                    <div key={j} className="rounded-lg border border-white/5 bg-white/5 p-3">
                      <div className="text-xs text-white/40">{f.label}</div>
                      {f.url ? (
                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-sm font-semibold text-cyan-400 hover:underline">{f.value}</a>
                      ) : (
                        <div className="mt-1 text-sm font-semibold text-white">{f.value}</div>
                      )}
                    </div>
                  ))}
                </div>
                {block.note && <p className="mt-3 text-xs italic text-white/40">{block.note}</p>}
              </div>
            );
          }
          if (block.type === 'kolList') {
            const badgeColors: Record<string, string> = {
              blue: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
              purple: 'border-purple-400/40 bg-purple-400/10 text-purple-300',
              emerald: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
              yellow: 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300',
              red: 'border-red-400/40 bg-red-400/10 text-red-300',
            };
            return (
              <div key={i} className="my-6 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/40">📣 Who&apos;s Calling It</div>
                {(block.kols || []).map((kol: any, j: number) => {
                  const badgeCls = badgeColors[kol.badgeColor] ?? badgeColors.purple;
                  return (
                    <div key={j} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-cyan-400">{kol.handle}</span>
                        {kol.name && <span className="text-sm text-white/50">{kol.name}</span>}
                        {kol.badge && (
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeCls}`}>
                            {kol.badge}
                          </span>
                        )}
                        {kol.reach && <span className="ml-auto text-xs text-white/30">{kol.reach}</span>}
                      </div>
                      <p className="text-sm text-white/80">{kol.call}</p>
                      {kol.result && (
                        <div className="mt-2 text-xs font-semibold text-emerald-400">{kol.result}</div>
                      )}
                    </div>
                  );
                })}
                {block.verdict && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 italic">
                    {block.verdict}
                  </div>
                )}
              </div>
            );
          }
          if (block.type === 'redFlags') {
            return (
              <div key={i} className="my-6 space-y-2">
                {block.safe?.length > 0 && (
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">✅ Green Flags</div>
                    <ul className="space-y-1">
                      {(block.safe || []).map((flag: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                          <span className="mt-0.5 text-emerald-400">✓</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400">🚩 Red Flags</div>
                  <ul className="space-y-2">
                    {(block.flags || []).map((flag: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="mt-0.5 text-red-400">⚠️</span> {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          }
          if (block.type === 'verdict') {
            const ratingColors: Record<string, { border: string; bg: string; text: string; badge: string }> = {
              green:  { border: 'border-emerald-400/40', bg: 'bg-emerald-400/5',  text: 'text-emerald-400', badge: 'bg-emerald-400/20 text-emerald-300' },
              yellow: { border: 'border-yellow-400/40', bg: 'bg-yellow-400/5',   text: 'text-yellow-400',  badge: 'bg-yellow-400/20 text-yellow-300' },
              red:    { border: 'border-red-400/40',    bg: 'bg-red-400/5',      text: 'text-red-400',     badge: 'bg-red-400/20 text-red-300' },
            };
            const c = ratingColors[block.rating ?? 'yellow'] ?? ratingColors.yellow;
            return (
              <div key={i} className={`my-6 rounded-xl border ${c.border} ${c.bg} p-5`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{block.emoji ?? '🟡'}</span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Verdict</div>
                    <div className={`text-base font-bold ${c.text}`}>{block.label ?? 'Speculative'}</div>
                  </div>
                </div>
                {block.bull && (
                  <div className="mb-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">✅ Why it&apos;s {block.emoji}</div>
                    <p className="text-sm leading-relaxed text-white/80">{block.bull}</p>
                  </div>
                )}
                {block.bear && (
                  <div className="mb-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-400">⚠️ Why not 🟢</div>
                    <p className="text-sm leading-relaxed text-white/80">{block.bear}</p>
                  </div>
                )}
                {block.watch && (
                  <div className={`mt-3 rounded-lg border ${c.border} bg-black/20 p-3`}>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">👀 What to watch</div>
                    <p className="text-sm text-white/70">{block.watch}</p>
                  </div>
                )}
              </div>
            );
          }
          if (block.type === 'faq') {
            return (
              <div key={i} className="my-6">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">❓ Frequently Asked Questions</div>
                <div className="space-y-4">
                  {(block.items || []).map((faq: any, j: number) => (
                    <div key={j} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <h3 className="mb-2 text-sm font-bold text-white">{faq.question}</h3>
                      <p className="text-sm leading-relaxed text-white/70">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (block.type === 'callout') {
            const variants: Record<string, string> = {
              warning: 'border-yellow-400/30 bg-yellow-400/5 text-yellow-400',
              info: 'border-blue-400/30 bg-blue-400/5 text-blue-400',
              success: 'border-emerald-400/30 bg-emerald-400/5 text-emerald-400',
              danger: 'border-red-400/30 bg-red-400/5 text-red-400',
            };
            const style = variants[block.variant] || variants.info;
            const [labelColor] = style.split(' ').slice(-1);
            return (
              <div key={i} className={`my-6 rounded-xl border p-5 ${style}`}>
                {block.title && <div className={`mb-2 text-xs font-semibold uppercase tracking-wider ${labelColor}`}>⚡ {block.title}</div>}
                {(block.content || '').split('\\n').filter(Boolean).map((line: string, j: number) => (
                  <p key={j} className="text-sm text-white/80 leading-relaxed">{line.replace(/^•\\s*/, '')}</p>
                ))}
              </div>
            );
          }
          if (block.type === 'statGrid') {
            return (
              <div key={i} className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(block.stats || []).map((stat: any, j: number) => (
                  <div key={j} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            );
          }
          if (block.type === 'verdict') {
            const ratingColor = block.rating === 'legit' ? 'emerald' : block.rating === 'shill' ? 'red' : 'yellow';
            return (
              <div key={i} className={`my-6 rounded-xl border border-${ratingColor}-400/30 bg-${ratingColor}-400/5 p-5`}>
                <div className={`mb-2 text-xs font-semibold uppercase tracking-wider text-${ratingColor}-400`}>🎯 Verdict</div>
                <p className="text-sm leading-relaxed text-white/80">{renderMd(block.content || block.text || '')}</p>
              </div>
            );
          }
          return (
            <p key={i} className="leading-relaxed text-white/80">
              {renderMd(block.text || block.content || '')}
            </p>
          );
        })}
      </section>

      {/* Related News */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-white">More from Runner Pulse</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/market-pulse/${rel.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className={`mb-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${signalColors[rel.signalRating] || signalColors.speculative}`}>
                  {rel.signalEmoji} {rel.signalRating}
                </div>
                <h3 className="text-sm font-semibold leading-snug text-white line-clamp-3">{rel.headline}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <div className="mt-12 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
        <div className="text-lg font-bold text-white">🐸 Want more signal?</div>
        <div className="mt-1 text-sm text-white/60">
          MemeDesk delivers daily memecoin coverage. No shills, no cope — just the data.
        </div>
      </div>

      {/* Token ticker footer — removed: static prices are misleading */}
    </article>
  );
}

export async function generateStaticParams() {
  return getAllArticles().filter((a) => a.category === 'market-pulse').map((a) => ({ slug: a.slug }));
}
