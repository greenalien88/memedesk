import NewsletterForm from '@/components/NewsletterForm';
import { formatCompact } from '@/lib/format';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  volume24h: number;
}

export default function Sidebar({ coins }: { coins: Coin[] }) {
  const topCoins = [...coins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 10);

  return (
    <aside className="sticky top-24 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold">Top Coins</h3>
        <p className="text-xs text-white/60">24h volume leaderboard</p>
        <div className="mt-4 space-y-3">
          {topCoins.map((coin, index) => (
            <div key={coin.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/50">#{index + 1}</span>
                <span className="font-semibold">{coin.symbol}</span>
              </div>
              <span className="text-white/60">{formatCompact(coin.volume24h)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold">Newsletter</h3>
        <p className="text-sm text-white/60">Get the daily memecoin briefing.</p>
        <div className="mt-4">
          <NewsletterForm compact />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-400/30 bg-black/60 p-5">
        <h3 className="text-lg font-semibold">Go Pro ⚡</h3>
        <p className="text-sm text-white/60">Unlock whale alerts, real-time signals, and portfolio intel.</p>
        <button className="mt-4 w-full rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300">
          Upgrade
        </button>
      </div>
    </aside>
  );
}
