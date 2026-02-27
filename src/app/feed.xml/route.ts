import { getAllArticles } from '@/lib/articles';

export async function GET() {
  const baseUrl = 'https://memedesk.co';
  const sorted = getAllArticles().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const escXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const items = sorted
    .map(
      (a) => `    <item>
      <title>${escXml(a.headline)}</title>
      <description>${escXml(a.subheadline)}</description>
      <link>${baseUrl}/highlights/${a.slug}</link>
      <guid isPermaLink="true">${baseUrl}/highlights/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MemeDesk</title>
    <description>Maxxing Profitable Alpha from the Meme Trenches — editorial meme coin intelligence</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
