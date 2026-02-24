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

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const liveCoins = await fetchLiveCoins();
  const coins = liveCoins.length > 0 ? liveCoins : staticCoins;
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
              <div className="rounded-2xl border border-emerald-400/30 bg-black/60 px-4 py-3 text-sm text-emerald-200">
                Market Sentiment: <span className="font-semibold">Bullish</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Today&apos;s Briefing</h2>
              <Link href="/news" className="text-xs text-emerald-400 hover:text-emerald-300 transition">
                View all news →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {articles.filter((a: any) => a.category !== 'autopsy').slice(0, 6).map((article) => (
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
