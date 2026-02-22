'use client';

import { useMemo, useState } from 'react';
import ChainBadge from '@/components/ChainBadge';
import KolCard from '@/components/KolCard';

interface Kol {
  rank: number;
  handle: string;
  avatar: string;
  followers: number;
  tier: number;
  chainFocus: string;
  hitRate: number;
  lastActive: string;
  bio: string;
  recentCalls: string[];
  performance: string[];
}

type SortKey = 'followers' | 'hitRate';

export default function KolTable({ kols }: { kols: Kol[] }) {
  const [chainFilter, setChainFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('followers');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let filteredKols = kols;
    if (chainFilter !== 'ALL') {
      filteredKols = filteredKols.filter((kol) => kol.chainFocus === chainFilter);
    }
    if (tierFilter !== 'ALL') {
      filteredKols = filteredKols.filter((kol) => kol.tier === tierFilter);
    }
    return [...filteredKols].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [kols, chainFilter, tierFilter, sortKey]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">📡 KOL Tracker</h1>
            <p className="text-sm text-white/60">Top 50 memecoin influencers across chains.</p>
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
            {(['ALL', 1, 2, 3, 4] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`rounded-full border px-3 py-1 ${
                  tierFilter === tier
                    ? 'border-sky-400/60 bg-sky-500/10 text-sky-200'
                    : 'border-white/10 text-white/60 hover:border-sky-400/40'
                }`}
              >
                {tier === 'ALL' ? 'All Tiers' : `Tier ${tier}`}
              </button>
            ))}
            {(['followers', 'hitRate'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`rounded-full border px-3 py-1 ${
                  sortKey === key
                    ? 'border-amber-400/60 bg-amber-500/10 text-amber-200'
                    : 'border-white/10 text-white/60 hover:border-amber-400/40'
                }`}
              >
                Sort {key === 'followers' ? 'Followers' : 'Hit Rate'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase text-white/50">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">KOL</th>
                <th className="px-5 py-3">Chain</th>
                <th className="px-5 py-3">Followers</th>
                <th className="px-5 py-3">Recent Calls</th>
                <th className="px-5 py-3">Hit Rate</th>
                <th className="px-5 py-3">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((kol) => (
                <tr
                  key={kol.handle}
                  className="cursor-pointer hover:bg-white/5"
                  onClick={() => setExpanded(expanded === kol.handle ? null : kol.handle)}
                >
                  <td className="px-5 py-4 text-white/60">#{kol.rank}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{kol.avatar}</span>
                      <div>
                        <div className="font-semibold">{kol.handle}</div>
                        <div className="text-xs text-white/60">Tier {kol.tier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><ChainBadge chain={kol.chainFocus} /></td>
                  <td className="px-5 py-4 text-white/80">{kol.followers.toLocaleString()}</td>
                  <td className="px-5 py-4 text-white/70">{kol.recentCalls[0]}</td>
                  <td className="px-5 py-4 text-emerald-300">{kol.hitRate}%</td>
                  <td className="px-5 py-4 text-white/60">{kol.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {expanded && (
        <KolCard kol={filtered.find((kol) => kol.handle === expanded)!} />
      )}
    </div>
  );
}
