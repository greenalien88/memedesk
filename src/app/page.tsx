import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TickerBar from '@/components/TickerBar';
import StoryCard from '@/components/StoryCard';
import ChainBadge from '@/components/ChainBadge';
import staticCoins from '../../data/coins.json';
import { getAllArticles } from '@/lib/articles';
import { fetchLiveCoins } from '@/lib/coingecko';
import { timeAgo } from '@/lib/format';

export const metadata: Metadata = {
  description: 'Daily memecoin intelligence: KOL calls, token analysis, rug alerts, and degen signal reports. No shills, no cope — just the data.',
  openGraph: {
    title: 'MemeDesk — The Signal in the Noise',
    description: 'Daily memecoin intelligence: KOL calls, token analysis, rug alerts, and degen signal reports.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MemeDesk — The Signal in the Noise',
    description: 'Daily memecoin intelligence: KOL calls, token analysis, rug alerts, and degen signal reports.',
  },
};

async function fetchFearGreed(): Promise<{ value: number; label: string }> {
  try {
    const res = await fetch('https://api.alternative.me/fng/', { next: { revalidate: 3600 } });
    const json = await res.json();
    const value = parseInt(json.data?.[0]?.value ?? '50', 10);
    const label = json.data?.[0]?.value_classification ?? 'Neutral';
    return { value, label };
  } catch {
    return { value: 50, label: 'Neutral' };
  }
}

function sentimentStyle(value: number) {
  if (value <= 10) return { color: 'text-red-400', border: 'border-red-400/30', bg: 'bg-red-400/5', emoji: '💀', label: 'NGMI', quip: 'Your portfolio called. It\'s not coming home.' };
  if (value <= 25) return { color: 'text-red-400', border: 'border-red-400/30', bg: 'bg-red-400/5', emoji: '💀', label: 'Max Cope', quip: 'Ser, this is a Wendy\'s.' };
  if (value <= 45) return { color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/5', emoji: '😰', label: 'Paper Hands', quip: 'Weak hands getting shaken out.' };
  if (value <= 55) return { color: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/5', emoji: '🦀', label: 'Crab Mode', quip: 'Sideways until further notice.' };
  if (value <= 75) return { color: 'text-emerald-300', border: 'border-emerald-400/30', bg: 'bg-emerald-400/5', emoji: '🐂', label: 'Aping In', quip: 'Few understand.' };
  return { color: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/5', emoji: '🚀', label: 'Full Degen', quip: 'Number go up technology activated.' };
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

const signalStyles: Record<string, string> = {
  legit: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300',
  speculative: 'border-yellow-400/50 bg-yellow-400/10 text-yellow-300',
  shill: 'border-red-400/50 bg-red-400/10 text-red-300',
};


export const revalidate = 60;

export default async function HomePage() {
  const [liveCoins, fearGreed] = await Promise.all([fetchLiveCoins(), fetchFearGreed()]);
  const coins = liveCoins.length > 0 ? liveCoins : staticCoins;
  const style = sentimentStyle(fearGreed.value);
  const articles = getAllArticles();
  const featured = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3, 11);

  const featuredCat = featured ? (categoryMeta[featured.category || 'news'] || categoryMeta.news) : categoryMeta.news;
  const featuredHref = featured ? `${featuredCat.path}/${featured.slug}` : '/news';
  const featuredSignal = featured ? (signalStyles[featured.signalRating] || signalStyles.speculative) : signalStyles.speculative;

  return (
    <div className="space-y-6">
      <div className="-mx-4">
        <TickerBar coins={coins.slice(0, 10)} />
      </div>

      {/* Featured + Secondary articles */}
      {featured && (
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          {/* Featured article — large card with hero image */}
          <Link href={featuredHref} className="group">
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10">
              {featured.heroImage && (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={featured.heroImage}
                    alt={featured.headline}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Signal badge on featured image */}
                  <div className={`absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-sm max-w-[200px] ${featuredSignal}`}>
                    <span className="shrink-0">{featured.signalEmoji}</span>
                    <span className="truncate">{featured.signalLabel || featured.signalRating}</span>
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${featuredCat.color}`}>
                    {featuredCat.label}
                  </span>
                  <ChainBadge chain={featured.chain} />
                </div>
                <h2 className="text-2xl font-bold leading-tight text-white group-hover:text-emerald-300 transition-colors">
                  {featured.headline}
                </h2>
                {featured.subheadline && (
                  <p className="text-sm text-white/60 line-clamp-3">{featured.subheadline}</p>
                )}
                <div className="mt-auto flex items-center text-xs text-white/40 pt-2">
                  <span>{timeAgo(featured.publishedAt)}</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Secondary articles — stacked on the right with thumbnails */}
          <div className="flex flex-col gap-4">
            {secondary.map((article) => {
              const cat = categoryMeta[article.category || 'news'] || categoryMeta.news;
              const href = `${cat.path}/${article.slug}`;
              const signal = signalStyles[article.signalRating] || signalStyles.speculative;
              return (
                <Link key={article.id} href={href} className="group flex-1">
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10">
                    {article.heroImage && (
                      <div className="relative aspect-[3/1] w-full overflow-hidden">
                        <Image
                          src={article.heroImage}
                          alt={article.headline}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className={`absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm max-w-[160px] ${signal}`}>
                          <span className="shrink-0">{article.signalEmoji}</span>
                          <span className="truncate">{article.signalLabel || article.signalRating}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cat.color}`}>
                          {cat.label}
                        </span>
                        <ChainBadge chain={article.chain} />
                      </div>
                      <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                        {article.headline}
                      </h3>
                      <div className="mt-auto text-[11px] text-white/40 pt-1">
                        <span>{timeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Fear & Greed + Ad (300×250 Medium Rectangle) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Fear & Greed — matched to 300×250 */}
        <div className={`w-full sm:w-[300px] h-[250px] shrink-0 rounded-2xl border ${style.border} bg-black/60 px-6 py-5 text-sm ${style.color} flex flex-col justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">{style.emoji}</span>
            <div>
              <div className="font-bold text-lg tracking-wide">{style.label}</div>
              <div className="mt-0.5 text-xs opacity-50">Fear &amp; Greed Index</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs opacity-40 mb-1">
              <span>Extreme Fear</span>
              <span className="font-bold opacity-80">{fearGreed.value}/100</span>
              <span>Extreme Greed</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${fearGreed.value <= 25 ? 'bg-red-400' : fearGreed.value <= 45 ? 'bg-orange-400' : fearGreed.value <= 55 ? 'bg-yellow-400' : 'bg-emerald-400'}`} style={{ width: `${fearGreed.value}%` }} />
            </div>
          </div>
          <div className="text-sm italic opacity-40 leading-snug">&ldquo;{style.quip}&rdquo;</div>
        </div>

        {/* Sponsored — Jupiter × Sushi video ad */}
        <a
          href="https://jup.ag"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex-1 w-full h-[250px] overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition block"
        >
          <video
            src="/jupiter-sushi-ad.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2.5 right-3 text-[10px] text-white/40 tracking-widest uppercase bg-black/40 px-1.5 py-0.5 rounded">Sponsored</span>
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm font-semibold">Jupiter × Sushi</span>
            <span className="text-emerald-300 text-xs font-semibold">Trade on Solana →</span>
          </div>
        </a>
      </div>

      {/* More articles grid */}
      {rest.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">More Stories</h2>
            <Link href="/news" className="text-xs text-emerald-400 hover:text-emerald-300 transition">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((article) => (
              <StoryCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
