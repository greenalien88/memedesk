import Link from 'next/link';
import TickerBar from '@/components/TickerBar';
import StoryCard from '@/components/StoryCard';
import CoinTable from '@/components/CoinTable';
import RugAlert from '@/components/RugAlert';
import Sidebar from '@/components/Sidebar';
import ChainBadge from '@/components/ChainBadge';
import StatusBadge from '@/components/StatusBadge';
import NewsletterForm from '@/components/NewsletterForm';
import { formatCompact } from '@/lib/format';
import coins from '../../data/coins.json';
import articles from '../data/articles.json';
import launches from '../../data/launches.json';
import rugs from '../../data/rugs.json';


export default function HomePage() {
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
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-emerald-500/5 to-transparent p-8">
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
              <Link href="/articles" className="text-xs text-emerald-400 hover:text-emerald-300 transition">
                View all articles →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {articles.slice(0, 6).map((article) => (
                <StoryCard key={article.id} article={article} />
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
              <NewsletterForm />
            </div>
          </div>

          <CoinTable coins={coins} />

          <div className="rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold">🚀 New Launches</h3>
                <p className="text-xs text-white/60">Latest pump.fun launches</p>
              </div>
              <span className="text-xs text-white/50">Updated hourly</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase text-white/50">
                  <tr>
                    <th className="px-5 py-3">Token</th>
                    <th className="px-5 py-3">Chain</th>
                    <th className="px-5 py-3">Age</th>
                    <th className="px-5 py-3">Mcap</th>
                    <th className="px-5 py-3">Holders</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {launches.slice(0, 5).map((launch) => (
                    <tr key={launch.symbol} className="hover:bg-white/5">
                      <td className="px-5 py-4">
                        <div className="font-semibold">{launch.name}</div>
                        <div className="text-xs text-white/60">{launch.symbol}</div>
                      </td>
                      <td className="px-5 py-4"><ChainBadge chain={launch.chain} /></td>
                      <td className="px-5 py-4 text-white/70">{launch.ageHours}h</td>
                      <td className="px-5 py-4 text-white/70">{formatCompact(launch.mcap)}</td>
                      <td className="px-5 py-4 text-white/70">{launch.holders}</td>
                      <td className="px-5 py-4"><StatusBadge status={launch.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">⚠️ Rug Watch</h3>
              <span className="text-xs text-white/50">High-risk alerts</span>
            </div>
            <div className="grid gap-4">
              {rugs.slice(0, 3).map((rug) => (
                <RugAlert key={rug.name} rug={rug} />
              ))}
            </div>
          </div>
        </div>

        <Sidebar coins={coins} />
      </section>
    </div>
  );
}
