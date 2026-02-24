'use client';

import Link from 'next/link';
import { useState } from 'react';
import NewsletterModal from '@/components/NewsletterModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/news', label: 'News' },
  { href: '/launches', label: 'Launches' },
  { href: '/rug-watch', label: 'Rug Watch' }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
            <span className="text-2xl">🐸</span>
            MemeDesk
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-emerald-300">
                {link.label}
              </Link>
            ))}
            <Link href="/about" className="transition hover:text-emerald-300">About</Link>
          </nav>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-emerald-400/60 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/20"
          >
            Subscribe
          </button>
        </div>
        <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 pb-3 text-xs text-white/60 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1">
              {link.label}
            </Link>
          ))}
          <Link href="/about" className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1">
            About
          </Link>
        </div>
      </header>
      <NewsletterModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
