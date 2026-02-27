#!/usr/bin/env node
/**
 * scan-list.js — Scrape CT Feed from X/Twitter list (single page load)
 * Much faster than visiting 22 individual profiles
 * List: https://x.com/i/lists/2027425733572997533
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LIST_URL = 'https://x.com/i/lists/2027425733572997533';
const OUTPUT_PATH = path.join(__dirname, '../src/data/ct-feed.json');
const KOL_ACCOUNTS_PATH = path.join(__dirname, '../src/data/kol-accounts.json');

const KEYWORDS = [
  'meme', 'sol', 'solana', 'alpha', 'rug', 'degen', 'runner',
  'moonshot', 'gem', 'pump', 'dump', 'narrative', 'memecoin',
  'bullish', 'bearish', '100x', 'conviction', 'accumulate'
];

function extractCashtags(text) {
  const matches = text.match(/\$([A-Z]{2,10})\b/g) || [];
  return matches.map(t => t.slice(1));
}

function scoretweet(text, tier, publishedAt) {
  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
  let score = Math.max(0, 10 - ageHours);
  const lower = text.toLowerCase();
  for (const kw of KEYWORDS) {
    if (lower.includes(kw)) score += 2;
  }
  const cashtags = extractCashtags(text);
  score += cashtags.length * 3;
  if (tier === 1) score += 2;
  return score;
}

function parseRelativeTime(timeStr) {
  // timeStr like "13s", "3m", "2h", "Feb 26"
  const now = Date.now();
  if (!timeStr) return new Date(now).toISOString();
  const s = timeStr.trim();
  if (s.endsWith('s')) return new Date(now - parseInt(s) * 1000).toISOString();
  if (s.endsWith('m')) return new Date(now - parseInt(s) * 60 * 1000).toISOString();
  if (s.endsWith('h')) return new Date(now - parseInt(s) * 60 * 60 * 1000).toISOString();
  // Date like "Feb 26" — approximate
  try {
    return new Date(s + ' 2026').toISOString();
  } catch {
    return new Date(now).toISOString();
  }
}

async function main() {
  // Load KOL accounts for tier lookup
  const kolAccounts = JSON.parse(fs.readFileSync(KOL_ACCOUNTS_PATH, 'utf8'));
  const tierMap = {};
  for (const a of kolAccounts) {
    tierMap[a.handle.toLowerCase()] = a.tier;
  }

  console.log('[scan-list] Navigating to list...');

  // Navigate to list via OpenClaw browser CLI
  // We use exec to call the browser via OpenClaw API
  // Actually we need to use the MCP tool — this script is called by the agent
  // So we just output instructions and the agent handles browser calls
  // This script is a helper — print the list URL for the agent
  console.log(`[scan-list] List URL: ${LIST_URL}`);
  console.log('[scan-list] Use browser tool to navigate and extract tweets.');
  console.log('[scan-list] Output path:', OUTPUT_PATH);
}

main().catch(console.error);
