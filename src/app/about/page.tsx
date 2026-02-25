import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About MemeDesk — editorial-quality memecoin coverage.',
  alternates: { canonical: 'https://memedesk.co/about' },
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold">About MemeDesk</h1>
        <p className="mt-3 text-sm text-white/70">
          MemeDesk is CoinDesk for memecoins — editorial-quality coverage of degen markets, data, and culture.
        </p>
        <p className="mt-3 text-sm text-white/70">
          Mission: Bringing editorial quality to memecoin coverage while keeping the pulse of the trenches.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-xl font-semibold">Follow the Desk</h2>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
          <a href="https://x.com" className="rounded-full border border-white/10 px-4 py-2 hover:border-emerald-400/50">X</a>
          <a href="https://t.me" className="rounded-full border border-white/10 px-4 py-2 hover:border-emerald-400/50">Telegram</a>
          <a href="https://discord.com" className="rounded-full border border-white/10 px-4 py-2 hover:border-emerald-400/50">Discord</a>
        </div>
      </div>
    </div>
  );
}
