import ChainBadge from '@/components/ChainBadge';
import StatusBadge from '@/components/StatusBadge';

interface Rug {
  name: string;
  chain: 'SOL' | 'ETH' | 'BASE';
  redFlags: string[];
  riskScore: number;
  status: 'Safe' | 'Caution' | 'Danger' | 'Rugged';
  summary: string;
}

export default function RugAlert({ rug }: { rug: Rug }) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-red-200">⚠️ {rug.name}</h3>
          <p className="mt-2 text-sm text-white/70">{rug.summary}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ChainBadge chain={rug.chain} />
          <StatusBadge status={rug.status} />
          <span className="text-sm font-semibold text-red-300">Risk {rug.riskScore}/10</span>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2 text-xs text-red-100/80">
        {rug.redFlags.map((flag) => (
          <li key={flag} className="rounded-full border border-red-500/30 px-3 py-1">
            {flag}
          </li>
        ))}
      </ul>
    </div>
  );
}
