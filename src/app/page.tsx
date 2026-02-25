import type { Metadata } from 'next';
import Link from 'next/link';

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
import TickerBar from '@/components/TickerBar';
import StoryCard from '@/components/StoryCard';
import Sidebar from '@/components/Sidebar';
import NewsletterForm from '@/components/NewsletterForm';
import staticCoins from '../../data/coins.json';
import articles from '../data/articles.json';
import { fetchLiveCoins } from '@/lib/coingecko';

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

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const [liveCoins, fearGreed] = await Promise.all([fetchLiveCoins(), fetchFearGreed()]);
  const coins = liveCoins.length > 0 ? liveCoins : staticCoins;
  const style = sentimentStyle(fearGreed.value);
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-10">
      <TickerBar coins={coins.slice(0, 10)} />

      <section className="grid gap-8 md:grid-cols-[1.7fr_1fr]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">MemeDesk</p>
                <h1 className="text-3xl font-semibold md:text-4xl">The Signal in the Noise</h1>
                <p className="mt-2 text-sm text-white/60">{dateString} · 🟢 Degen Mode: ON</p>
              </div>
              <div className={`rounded-2xl border ${style.border} bg-black/60 px-5 py-4 text-sm ${style.color}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-pulse">{style.emoji}</span>
                  <div>
                    <div className="font-bold text-base tracking-wide">{style.label}</div>
                    <div className="mt-0.5 text-xs opacity-50">Fear &amp; Greed: {fearGreed.value}/100</div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${fearGreed.value <= 25 ? 'bg-red-400' : fearGreed.value <= 45 ? 'bg-orange-400' : fearGreed.value <= 55 ? 'bg-yellow-400' : 'bg-emerald-400'}`} style={{ width: `${fearGreed.value}%` }} />
                </div>
                <div className="mt-2 text-xs italic opacity-40">&ldquo;{style.quip}&rdquo;</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/news', label: '🔴 News', color: 'border-red-400/30 hover:border-red-400/60 text-red-300' },
                { href: '/alpha', label: '🔮 Alpha', color: 'border-violet-400/30 hover:border-violet-400/60 text-violet-300' },
                { href: '/launchpad', label: '🚀 Launch Pad', color: 'border-emerald-400/30 hover:border-emerald-400/60 text-emerald-300' },
                { href: '/autopsy', label: '🪦 Autopsy', color: 'border-gray-400/30 hover:border-gray-400/60 text-gray-300' },
                { href: '/kol-watch', label: '👁️ KOL Watch', color: 'border-amber-400/30 hover:border-amber-400/60 text-amber-300' },
                { href: '/market-pulse', label: '📊 Market Pulse', color: 'border-blue-400/30 hover:border-blue-400/60 text-blue-300' },
                { href: '/academy', label: '🎓 Academy', color: 'border-cyan-400/30 hover:border-cyan-400/60 text-cyan-300' },
              ].map((cat) => (
                <Link key={cat.href} href={cat.href} className={`rounded-full border bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10 ${cat.color}`}>
                  {cat.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest</h2>
              <Link href="/news" className="text-xs text-emerald-400 hover:text-emerald-300 transition">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 8).map((article) => (
                <StoryCard key={article.id} article={article} />
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
              <NewsletterForm />
            </div>
          </div>

        </div>

        <Sidebar coins={coins} hidePro />
      </section>
    </div>
  );
}
