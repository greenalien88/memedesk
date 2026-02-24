import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold">MemeDesk</div>
          <p className="text-sm text-white/60">The Signal in the Noise.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/60">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/launches" className="hover:text-white">Launches</Link>
          <Link href="/rug-watch" className="hover:text-white">Rug Watch</Link>
          <Link href="/about" className="hover:text-white">About</Link>
        </div>
        <div className="flex gap-4 text-sm text-white/60">
          <a href="https://x.com" className="hover:text-white">X</a>
          <a href="https://t.me" className="hover:text-white">Telegram</a>
          <a href="https://discord.com" className="hover:text-white">Discord</a>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center text-xs text-white/40">© 2026 MemeDesk. All rights reserved.</div>
    </footer>
  );
}
