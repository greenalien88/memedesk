'use client';

import Link from 'next/link';
import { useState } from 'react';
import NewsletterModal from '@/components/NewsletterModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/news', label: 'News' },
  { href: '/alpha', label: 'Alpha' },
  { href: '/launchpad', label: 'Launch Pad' },
  { href: '/autopsy', label: 'Autopsy' },
  { href: '/kol-watch', label: 'KOL Watch' },
  { href: '/market-pulse', label: 'Market Pulse' },
  { href: '/academy', label: 'Academy' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl border border-emerald-400/60 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/20"
            >
              Subscribe
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-black/90 backdrop-blur md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/5 py-3 text-sm text-white/70 transition hover:text-emerald-300 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm text-white/70 transition hover:text-emerald-300"
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </header>
      <NewsletterModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
