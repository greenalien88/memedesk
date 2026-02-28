import React from 'react';

interface RedFlagsBlockProps {
  block: {
    safe?: string[];
    flags?: string[];
  };
}

export default function RedFlagsBlock({ block }: RedFlagsBlockProps) {
  const hasGreenFlags = block.safe && block.safe.length > 0;
  const hasRedFlags = block.flags && block.flags.length > 0;

  return (
    <div className="my-6 space-y-2">
      {hasGreenFlags && (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">✅ Green Flags</div>
          <ul className="space-y-1">
            {block.safe!.map((flag: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                <span className="mt-0.5 text-emerald-400">✓</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasRedFlags && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400">🚩 Red Flags</div>
          <ul className="space-y-2">
            {block.flags!.map((flag: string, i: number) => {
              const isGood = flag.includes('✅');
              return (
                <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                  <span className={`mt-0.5 shrink-0 ${isGood ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {isGood ? '✓' : '⚠️'}
                  </span>
                  {flag}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
