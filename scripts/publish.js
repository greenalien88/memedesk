#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);

function parseArgs(args) {
  const opts = {};
  const positional = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg && arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        opts[key] = '';
      } else {
        opts[key] = value;
        i += 1;
      }
    } else {
      positional.push(arg);
    }
  }
  return { opts, positional };
}

function kebab(str) {
  return String(str)
    .toLowerCase()
    .replace(/@/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-');
}

function formatUsd(value, decimals) {
  if (value == null || Number.isNaN(value)) return 'N/A';
  const fixed = Number(value).toFixed(decimals);
  return `$${fixed.replace(/\.0+$/, '').replace(/(\.\d*?[1-9])0+$/, '$1')}`;
}

function formatCompactUsd(value) {
  if (value == null || Number.isNaN(value)) return 'N/A';
  const num = Number(value);
  if (num >= 1e9) {
    const v = (num / 1e9).toFixed(1).replace(/\.0$/, '');
    return `$${v}B`;
  }
  if (num >= 1e6) {
    const v = (num / 1e6).toFixed(num >= 1e8 ? 0 : 1).replace(/\.0$/, '');
    return `$${v}M`;
  }
  return formatUsd(num, 2);
}

function toISOWithOffset(date, offsetMinutes) {
  const shifted = new Date(date.getTime() + offsetMinutes * 60000);
  const yyyy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(shifted.getUTCDate()).padStart(2, '0');
  const hh = String(shifted.getUTCHours()).padStart(2, '0');
  const min = String(shifted.getUTCMinutes()).padStart(2, '0');
  const ss = String(shifted.getUTCSeconds()).padStart(2, '0');
  const offset = `${offsetMinutes >= 0 ? '+' : '-'}${String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0')}:${String(Math.abs(offsetMinutes) % 60).padStart(2, '0')}`;
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${offset}`;
}

function dateSlug(date, offsetMinutes) {
  const shifted = new Date(date.getTime() + offsetMinutes * 60000);
  const yyyy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(shifted.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function extractTweetInfo(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const handle = parts[0] || '';
    const statusIndex = parts.indexOf('status');
    const statusId = statusIndex >= 0 ? parts[statusIndex + 1] : '';
    return { handle: handle ? `@${handle}` : '', statusId };
  } catch {
    return { handle: '', statusId: '' };
  }
}

async function fetchDexScreener(symbol) {
  if (!symbol) return { ok: false, error: 'Missing token symbol.' };
  const url = `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(symbol)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { ok: false, error: `DexScreener error: ${res.status}` };
    }
    const data = await res.json();
    const pairs = Array.isArray(data?.pairs) ? data.pairs : [];
    if (!pairs.length) {
      return { ok: false, error: 'No pairs found.' };
    }
    const best = pairs
      .filter((p) => p?.liquidity?.usd != null)
      .sort((a, b) => (b.liquidity.usd || 0) - (a.liquidity.usd || 0))[0] || pairs[0];

    const chainMap = {
      solana: 'SOL',
      ethereum: 'ETH',
      base: 'BASE',
    };

    return {
      ok: true,
      pair: best,
      chain: chainMap[best?.chainId] || 'SOL',
    };
  } catch (err) {
    return { ok: false, error: err.message || 'DexScreener fetch failed.' };
  }
}

function ensureHandle(handle) {
  if (!handle) return '@unknown';
  return handle.startsWith('@') ? handle : `@${handle}`;
}

async function main() {
  const { opts, positional } = parseArgs(argv);
  const tweetUrl = positional[0] || '';
  if (!tweetUrl) {
    console.error('Usage: node scripts/publish.js <tweet_url> [--tweet-text "..."] [--kol-handle @handle] [--kol-name "Name"] [--kol-followers "735K"] [--token SYMBOL]');
    process.exit(1);
  }

  const parsed = extractTweetInfo(tweetUrl);
  const kolHandle = ensureHandle(opts['kol-handle'] || parsed.handle);
  const kolName = opts['kol-name'] || (parsed.handle ? parsed.handle.replace('@', '') : 'Unknown');
  const kolFollowers = opts['kol-followers'] || 'N/A';
  const tweetText = opts['tweet-text'] || '[PLACEHOLDER - tweet text]';
  const tokenSymbol = (opts['token'] || '').toUpperCase();

  const dex = await fetchDexScreener(tokenSymbol);
  const pair = dex.ok ? dex.pair : null;

  const chain = dex.ok ? dex.chain : 'SOL';
  const tokenName = dex.ok ? (pair?.baseToken?.name || 'N/A') : 'N/A';
  const price = dex.ok ? formatUsd(Number(pair?.priceUsd), Number(pair?.priceUsd) < 1 ? 4 : 2) : 'N/A';
  const marketCapRaw = dex.ok ? (pair?.marketCap ?? pair?.fdv) : null;
  const marketCap = dex.ok ? formatCompactUsd(marketCapRaw) : 'N/A';
  const volume24h = dex.ok ? pair?.volume?.h24 ?? null : null;
  const change24h = dex.ok ? pair?.priceChange?.h24 ?? null : null;
  const liquidity = dex.ok ? pair?.liquidity?.usd ?? null : null;
  const pairAddress = dex.ok ? pair?.pairAddress || 'N/A' : 'N/A';

  const now = new Date();
  const publishedAt = toISOWithOffset(now, 480);
  const sourceTimestamp = publishedAt;
  const datePart = dateSlug(now, 480);

  const id = kebab(`${kolHandle}-${tokenSymbol || 'token'}-${datePart}`);
  const slug = kebab(`${kolHandle}-${tokenSymbol || 'token'}-${datePart}`);

  const heroImage = opts['image'] || null;

  const article = {
    id,
    slug,
    ...(heroImage ? { heroImage } : {}),
    headline: '[PLACEHOLDER - write FOMO headline]',
    subheadline: '[PLACEHOLDER - binary outcome framing]',
    signalRating: 'speculative',
    signalEmoji: '🟡',
    signalLabel: '[PLACEHOLDER]',
    publishedAt,
    author: 'MemeDesk Editorial',
    tags: [tokenSymbol || 'TOKEN', kolName || 'KOL', 'KOL Signal'],
    chain,
    kol: {
      handle: kolHandle,
      name: kolName,
      followers: kolFollowers,
      bio: '[PLACEHOLDER - KOL bio]',
      primaryBag: tokenSymbol ? `$${tokenSymbol}` : 'N/A',
    },
    sourcePost: {
      url: tweetUrl,
      text: tweetText,
      timestamp: sourceTimestamp,
      engagement: { replies: 0, reposts: 0, likes: 0, views: 0 },
    },
    tokenData: {
      symbol: tokenSymbol || 'TOKEN',
      name: tokenName,
      price,
      marketCap,
      ath: 'N/A',
      athDrop: 'N/A',
      recentAction: '[PLACEHOLDER]',
    },
    body: [
      { type: 'paragraph', text: '[OPENING: Timestamp + KOL identity + what they did + impact]' },
      { type: 'heading', text: "What They're Seeing That You're Not" },
      { type: 'paragraph', text: '[PLACEHOLDER: Unpack the thesis]' },
      { type: 'heading', text: 'The Number That Should Scare You' },
      { type: 'paragraph', text: '[PLACEHOLDER: Scariest data point + bull/bear framing]' },
      { type: 'heading', text: 'Why This Matters Right Now' },
      { type: 'paragraph', text: '[PLACEHOLDER: Temporal urgency]' },
      { type: 'heading', text: 'MemeDesk Verdict' },
      { type: 'paragraph', text: '[PLACEHOLDER: Signal rating + disclosure + CTA]' },
    ],
  };

  const outputDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(outputDir, `article-${id}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));

  const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
  const existing = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  if (!Array.isArray(existing)) {
    throw new Error('articles.json is not an array.');
  }
  existing.push(article);
  fs.writeFileSync(articlesPath, JSON.stringify(existing, null, 2));

  console.log('MemeDesk Publish Summary');
  console.log('------------------------');
  console.log(`Article ID: ${id}`);
  console.log(`Slug: ${slug}`);
  console.log(`Preview: http://localhost:3000/news/${slug}`);
  console.log('');
  if (dex.ok) {
    console.log('Token Data');
    console.log(`Symbol: ${tokenSymbol}`);
    console.log(`Name: ${tokenName}`);
    console.log(`Price: ${price}`);
    console.log(`Market Cap: ${marketCap}`);
    console.log(`24h Volume: ${formatCompactUsd(volume24h)}`);
    console.log(`24h Change: ${change24h != null ? `${change24h}%` : 'N/A'}`);
    console.log(`Liquidity: ${formatCompactUsd(liquidity)}`);
    console.log(`Chain: ${chain}`);
    console.log(`Pair: ${pairAddress}`);
  } else {
    console.log('Token Data');
    console.log(`Symbol: ${tokenSymbol || 'N/A'}`);
    console.log(`Status: ${dex.error}`);
  }
  console.log('');
  console.log(`Article JSON: ${outputPath}`);
}

main().catch((err) => {
  console.error('Publish failed:', err.message || err);
  process.exit(1);
});
