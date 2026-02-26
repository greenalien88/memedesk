import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BASE_URL = 'https://memedesk.co';
const OG_IMAGE = `${BASE_URL}/images/og/memedesk-og.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MemeDesk — The Signal in the Noise',
    template: '%s | MemeDesk',
  },
  description: 'CoinDesk for memecoins. Editorial-quality coverage of degen markets — KOL calls, alpha plays, rug autopsies, and market signals.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'MemeDesk — The Signal in the Noise',
    description: 'Editorial-quality memecoin intelligence: KOL calls, alpha plays, rug autopsies, and market signals. No shills, no cope — just the data.',
    url: BASE_URL,
    siteName: 'MemeDesk',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'MemeDesk — The Signal in the Noise' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@memedesk',
    title: 'MemeDesk — The Signal in the Noise',
    description: 'Editorial-quality memecoin intelligence: KOL calls, alpha plays, rug autopsies, and market signals.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MemeDesk',
  url: BASE_URL,
  description: 'Editorial-quality memecoin intelligence — KOL calls, alpha plays, rug autopsies, and market signals.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/news?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MemeDesk',
  url: BASE_URL,
  logo: `${BASE_URL}/images/memedesk-logo.webp`,
  sameAs: ['https://x.com/memecoinwarlord'],
  description: 'The leading editorial source for memecoin intelligence, signals, and market analysis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" type="application/rss+xml" title="MemeDesk RSS Feed" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
