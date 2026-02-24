import articles from '@/data/articles.json';

export async function GET() {
  const baseUrl = 'https://memedesk.vercel.app';
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const escXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const items = sorted
    .map(
      (a) => `    <item>
      <title>${escXml(a.headline)}</title>
      <description>${escXml(a.subheadline)}</description>
      <link>${baseUrl}/articles/${a.slug}</link>
      <guid isPermaLink="true">${baseUrl}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MemeDesk</title>
    <description>The Signal in the Noise — editorial-quality memecoin coverage</description>
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
