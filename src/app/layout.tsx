import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'MemeDesk — The Signal in the Noise',
    template: '%s | MemeDesk',
  },
  description: 'CoinDesk for memecoins. Editorial-quality coverage of degen markets.',
  alternates: { canonical: 'https://memedesk.vercel.app' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="application/rss+xml" title="MemeDesk RSS Feed" href="/feed.xml" />
      </head>
      <body>
        <Header />
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
