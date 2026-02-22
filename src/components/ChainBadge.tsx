type Chain = string;

const chainStyles: Record<Chain, string> = {
  SOL: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  ETH: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  BASE: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  MULTI: 'bg-white/10 text-white/70 border-white/10'
};

export default function ChainBadge({ chain }: { chain: Chain }) {
  const style = chainStyles[chain] ?? chainStyles.MULTI;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style}`}>
      {chain}
    </span>
  );
}
