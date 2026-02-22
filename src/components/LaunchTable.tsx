'use client';

import { useMemo, useState } from 'react';
import ChainBadge from '@/components/ChainBadge';
import StatusBadge from '@/components/StatusBadge';
import { formatCompact, formatPercent } from '@/lib/format';

interface Launch {
  name: string;
  symbol: string;
  chain: string;
  ageHours: number;
  mcap: number;
  holders: number;
  liquidity: number;
  devWalletPct: number;
  status: string;
}

type SortKey = 'ageHours' | 'mcap' | 'holders';

export default function LaunchTable({ launches }: { launches: Launch[] }) {
  const [chainFilter, setChainFilter] = useState<'ALL' | string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('ageHours');

  const filtered = useMemo(() => {
    const filteredLaunches = chainFilter === 'ALL'
      ? launches
      : launches.filter((launch) => launch.chain === chainFilter);
    return [...filteredLaunches].sort((a, b) => a[sortKey] - b[sortKey]);
  }, [launches, chainFilter, sortKey]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">🚀 Launch Radar</h1>
          <p className="text-sm text-white/60">Fresh launches from across the meme trenches.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {(['ALL', 'SOL', 'ETH', 'BASE'] as const).map((chain) => (
            <button
              key={chain}
              onClick={() => setChainFilter(chain)}
              className={`rounded-full border px-3 py-1 ${
                chainFilter === chain
                  ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                  : 'border-white/10 text-white/60 hover:border-emerald-400/40'
              }`}
            >
              {chain}
            </button>
          ))}
          {(['ageHours', 'mcap', 'holders'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`rounded-full border px-3 py-1 ${
                sortKey === key
                  ? 'border-sky-400/60 bg-sky-500/10 text-sky-200'
                  : 'border-white/10 text-white/60 hover:border-sky-400/40'
              }`}
            >
              Sort {key === 'ageHours' ? 'Age' : key === 'mcap' ? 'Mcap' : 'Holders'}
            </button>
          ))}
        </div>
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
              <th className="px-5 py-3">Liquidity</th>
              <th className="px-5 py-3">Dev %</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map((launch) => (
              <tr key={launch.symbol} className="hover:bg-white/5">
                <td className="px-5 py-4">
                  <div className="font-semibold">{launch.name}</div>
                  <div className="text-xs text-white/60">{launch.symbol}</div>
                </td>
                <td className="px-5 py-4"><ChainBadge chain={launch.chain} /></td>
                <td className="px-5 py-4 text-white/80">{launch.ageHours}h</td>
                <td className="px-5 py-4 text-white/80">{formatCompact(launch.mcap)}</td>
                <td className="px-5 py-4 text-white/80">{launch.holders}</td>
                <td className="px-5 py-4 text-white/80">{formatCompact(launch.liquidity)}</td>
                <td className="px-5 py-4 text-white/80">{formatPercent(launch.devWalletPct)}</td>
                <td className="px-5 py-4"><StatusBadge status={launch.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
