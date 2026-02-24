'use client';

import { useMemo, useState } from 'react';
import ChainBadge from '@/components/ChainBadge';
import { formatCompact, formatCurrency, formatPercent } from '@/lib/format';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  price: number;
  change24h: number;
  mcap: number;
  volume24h: number;
}

type SortKey = 'change24h' | 'mcap' | 'price';

export default function CoinTable({ coins }: { coins: Coin[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('change24h');

  const sorted = useMemo(() => {
    return [...coins].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [coins, sortKey]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold">🔥 Trending Now</h3>
          <p className="text-xs text-white/60">Top movers across chains</p>
        </div>
        <div className="flex gap-2 text-xs">
          {(['change24h', 'mcap', 'price'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`rounded-full border px-3 py-1 transition ${
                sortKey === key
                  ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                  : 'border-white/10 text-white/60 hover:border-emerald-400/40'
              }`}
            >
              {key === 'change24h' ? '24h%' : key === 'mcap' ? 'Mcap' : 'Price'}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {sorted.slice(0, 5).map((coin) => (
          <div key={coin.id} className="grid grid-cols-3 items-center gap-3 px-4 py-4 text-sm sm:grid-cols-5 sm:gap-4 sm:px-5">
            <div className="col-span-1 sm:col-span-2">
              <div className="font-semibold">{coin.name}</div>
              <div className="text-xs text-white/60">{coin.symbol}</div>
            </div>
            <div className="hidden sm:block"><ChainBadge chain={coin.chain} /></div>
            <div className="text-right text-white/80">{formatCurrency(coin.price, { maximumFractionDigits: 6 })}</div>
            <div className={`text-right font-semibold ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatPercent(coin.change24h)}
              <div className="text-xs text-white/50">{formatCompact(coin.mcap)} mcap</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
