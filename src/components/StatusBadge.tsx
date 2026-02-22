type Status = 'Safe' | 'Caution' | 'Danger' | 'Rugged';

const statusStyles: Record<Status, string> = {
  Safe: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Caution: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Danger: 'bg-red-500/20 text-red-300 border-red-500/40',
  Rugged: 'bg-neutral-800 text-neutral-200 border-neutral-700'
};

const statusEmoji: Record<Status, string> = {
  Safe: '🟢',
  Caution: '🟡',
  Danger: '🔴',
  Rugged: '💀'
};

export default function StatusBadge({ status }: { status: Status }) {
  const style = statusStyles[status] ?? statusStyles.Caution;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style}`}>
      <span>{statusEmoji[status]}</span>
      {status}
    </span>
  );
}
