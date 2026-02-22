'use client';

import { useState } from 'react';

export default function NewsletterForm({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={onSubmit} className={`flex w-full flex-col gap-3 ${compact ? '' : 'max-w-md'}`}>
      {!compact && (
        <div>
          <h4 className="text-lg font-semibold">Get the daily memecoin briefing. Free.</h4>
          <p className="text-sm text-white/60">No spam, just signal.</p>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@degentrader.xyz"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : 'Subscribe'}
        </button>
      </div>
      {status === 'success' && <p className="text-xs text-emerald-300">Subscribed. Welcome to the desk.</p>}
      {status === 'error' && <p className="text-xs text-red-300">Something went wrong. Try again.</p>}
    </form>
  );
}
