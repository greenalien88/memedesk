#!/usr/bin/env node
/**
 * validate-articles.js
 * Validates all article JSON files in src/data/articles/
 * Run manually: node scripts/validate-articles.js
 * Run in CI: npm run validate
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../src/data/articles');

const REQUIRED_FIELDS = ['slug', 'headline', 'category', 'publishedAt', 'author', 'body'];
const VALID_CATEGORIES = ['news', 'launchpad', 'autopsy', 'kol-watch', 'academy', 'alpha', 'market-pulse'];

let errors = 0;
let warnings = 0;
let checked = 0;

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(ARTICLES_DIR, file);
  let article;

  try {
    article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`❌ ${file}: Invalid JSON — ${e.message}`);
    errors++;
    continue;
  }

  const articleErrors = [];
  const articleWarnings = [];

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!article[field]) {
      articleErrors.push(`missing required field: "${field}"`);
    }
  }

  // Slug matches filename
  const expectedSlug = file.replace('.json', '');
  if (article.slug && article.slug !== expectedSlug) {
    articleErrors.push(`slug mismatch: file="${expectedSlug}" but slug="${article.slug}"`);
  }

  // Category is valid
  if (article.category && !VALID_CATEGORIES.includes(article.category)) {
    articleWarnings.push(`unknown category: "${article.category}"`);
  }

  // sourcePost validation
  if (article.sourcePost) {
    if (!article.sourcePost.url) {
      articleErrors.push('sourcePost missing required "url"');
    }
    if (!article.sourcePost.text) {
      articleErrors.push('sourcePost missing required "text"');
    }
    // engagement is optional — but if present, must be complete
    if (article.sourcePost.engagement) {
      const eng = article.sourcePost.engagement;
      const engFields = ['replies', 'reposts', 'likes', 'views'];
      for (const f of engFields) {
        if (typeof eng[f] !== 'number') {
          articleErrors.push(`sourcePost.engagement.${f} must be a number (got ${typeof eng[f]})`);
        }
      }
    }
  } else {
    // sourcePost is strongly recommended
    articleWarnings.push('no sourcePost — consider adding one');
  }

  // body must be a non-empty array
  if (article.body && (!Array.isArray(article.body) || article.body.length === 0)) {
    articleErrors.push('body must be a non-empty array');
  }

  if (articleErrors.length > 0) {
    console.error(`❌ ${file}:`);
    articleErrors.forEach(e => console.error(`   • ${e}`));
    errors += articleErrors.length;
  }
  if (articleWarnings.length > 0) {
    console.warn(`⚠️  ${file}:`);
    articleWarnings.forEach(w => console.warn(`   • ${w}`));
    warnings += articleWarnings.length;
  }
  if (articleErrors.length === 0 && articleWarnings.length === 0) {
    // silent pass
  }

  checked++;
}

console.log(`\n✅ Checked ${checked} articles — ${errors} error(s), ${warnings} warning(s)`);

if (errors > 0) {
  process.exit(1);
}
