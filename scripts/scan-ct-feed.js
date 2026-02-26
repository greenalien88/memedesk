#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ACCOUNTS = [
  '0xansem',
  'MustStopMurad',
  'KookCapitalLLC',
  'frankdegods',
  'cobie',
  'gainzy222',
  'blknoiz06',
  'loopifyyy',
  'BasedKarbon',
  'notthreadguy',
  '0xSisyphus',
  'GiganticRebirth',
  'CryptoGodJohn',
  'KingShawnn',
  '9gagcrypto'
];

const NITTER_INSTANCES = [
  'nitter.poast.org',
  'nitter.privacydev.net',
  'nitter.1d4.us',
  'lightbrd.com'
];

const KEYWORDS = [
  'meme',
  'sol',
  'solana',
  'alpha',
  'rug',
  'degen',
  'runner',
  'moonshot',
  'gem',
  'pump',
  'narrative',
  'memecoin',
  'bullish',
  'bearish',
  '100x'
];

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'ct-feed.json');

function decodeXml(input) {
  if (!input) return '';
  return input
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .trim();
}

function extractTag(block, tag) {
  const match = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(block);
  return match ? decodeXml(match[1]) : '';
}

function toXUrl(link, author) {
  try {
    const parsed = new URL(link);
    return `https://x.com${parsed.pathname}`;
  } catch {
    return `https://x.com/${author}`;
  }
}

function parseRss(xml, author) {
  const items = [];
  if (!xml) return items;

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml))) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const pubDate = extractTag(block, 'pubDate');

    if (!title || !pubDate) continue;
    const trimmedTitle = title.trim();
    if (trimmedTitle.startsWith('RT @') || trimmedTitle.startsWith('@')) continue;

    const published = new Date(pubDate);
    if (Number.isNaN(published.getTime())) continue;

    const hoursSince = Math.max(0, (Date.now() - published.getTime()) / 3600000);
    let score = -hoursSince;
    const lowered = trimmedTitle.toLowerCase();
    for (const keyword of KEYWORDS) {
      if (lowered.includes(keyword)) score += 2;
    }

    items.push({
      author,
      text: trimmedTitle,
      url: toXUrl(link, author),
      publishedAt: published.toISOString(),
      score
    });
  }

  return items;
}

async function fetchFeed(username) {
  for (const instance of NITTER_INSTANCES) {
    const url = `https://${instance}/${username}/rss`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'MemeDesk-CT-Feed/1.0'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      return { instance, xml };
    } catch (error) {
      console.error(`[ct-feed] ${username} failed on ${instance}:`, error.message || error);
    }
  }
  return null;
}

async function run() {
  const allItems = [];
  let anyInstanceSucceeded = false;

  for (const account of ACCOUNTS) {
    try {
      const result = await fetchFeed(account);
      if (!result) continue;
      anyInstanceSucceeded = true;
      const items = parseRss(result.xml, account);
      allItems.push(...items);
    } catch (error) {
      console.error(`[ct-feed] Unexpected error for ${account}:`, error.message || error);
    }
  }

  if (!anyInstanceSucceeded) {
    console.error('[ct-feed] All Nitter instances failed. Preserving existing ct-feed.json.');
    return;
  }

  const top = allItems
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...item }) => item);

  const fetchedAt = new Date().toISOString();
  const payload = top.map((item) => ({
    ...item,
    fetchedAt
  }));

  try {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));
    console.log(`[ct-feed] Saved ${payload.length} items to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('[ct-feed] Failed to write ct-feed.json:', error.message || error);
  }
}

run().catch((error) => {
  console.error('[ct-feed] Fatal error:', error.message || error);
});
