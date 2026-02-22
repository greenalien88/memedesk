import ChainBadge from '@/components/ChainBadge';

interface Kol {
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

export default function KolCard({ kol }: { kol: Kol }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{kol.avatar}</div>
          <div>
            <div className="text-lg font-semibold">{kol.handle}</div>
            <p className="text-sm text-white/60">{kol.bio}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <ChainBadge chain={kol.chainFocus} />
          <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">Tier {kol.tier}</span>
          <span className="rounded-full border border-emerald-400/40 px-3 py-1 text-emerald-200">Hit {kol.hitRate}%</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-white/60">{kol.followers.toLocaleString()} followers</span>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-white/80">Recent Calls</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/60">
            {kol.recentCalls.map((call) => (
              <li key={call}>• {call}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white/80">Performance History</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/60">
            {kol.performance.map((entry) => (
              <li key={entry}>• {entry}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 text-xs text-white/50">Last active {kol.lastActive}</div>
    </div>
  );
}
