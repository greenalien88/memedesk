# MemeDesk — MVP Spec

## What Is This?
MemeDesk is "CoinDesk for Memecoins" — a dedicated media platform covering memecoins as their own asset class. Editorial quality meets degen energy.

## Tech Stack
- **Next.js 15** (App Router)
- **Tailwind CSS v4** (use `@import "tailwindcss"` NOT v3 `@tailwind` directives)
- **TypeScript**
- **No database for MVP** — use local JSON files for mock data
- **No auth for MVP**
- Deploy-ready for Vercel

## Design Direction
- **Dark theme** — crypto/degen aesthetic
- **Color palette:** Black (#0a0a0a) background, neon green (#00ff88) accents, white text, with yellow/orange for warnings/alerts
- **Font:** Inter or system fonts
- **Vibe:** Bloomberg terminal meets meme culture. Data-dense but fun.
- **Responsive** — mobile-first

## Pages to Build

### 1. Homepage (/)
The daily briefing dashboard. Shows:

**Hero Section:**
- "MemeDesk" logo/wordmark with tagline "The Signal in the Noise"
- Current date + crypto market sentiment indicator (mock: "🟢 Degen Mode: ON")

**Today's Briefing (main content area):**
- 3-5 cards showing today's top memecoin stories (mock data)
- Each card: thumbnail/emoji, headline, 1-line summary, time ago, chain badge (SOL/ETH/BASE)

**Live Ticker Bar:**
- Horizontal scrolling bar at top showing mock memecoin prices: DOGE, PEPE, BONK, WIF, FLOKI, POPCAT, MOG, GIGA, SPX6900, FARTCOIN
- Show price + % change (green/red)

**Sections below the fold:**
- "🔥 Trending Now" — Top 5 movers (table: coin, chain, price, 24h%, mcap)
- "🚀 New Launches" — Recently launched coins from pump.fun (table: name, age, mcap, holders, status badge)
- "⚠️ Rug Watch" — Flagged suspicious coins (red-tinted cards)
- "📡 KOL Radar" — What top influencers are talking about (3 cards showing influencer avatar, handle, what they mentioned, engagement)

**Sidebar (desktop):**
- "Top Coins" mini leaderboard (top 10 by 24h volume)
- Newsletter signup CTA
- "Pro" upgrade CTA

### 2. KOL Tracker (/kol-tracker)
A page tracking the top 50 memecoin influencers.

- Table/grid view of all 50 KOLs
- Columns: Rank, Avatar (placeholder), Handle, Followers, Recent Calls, Hit Rate %, Last Active
- Clicking a KOL opens an expanded card showing:
  - Bio
  - Recent tweets/calls (mock)
  - Performance history (mock: "Called $PEPE at $0.0001 → now $0.001 = 10x ✅")
- Filter by: Chain focus (SOL/ETH/BASE), Tier (1-4), Sort by followers/hit rate

### 3. Launch Radar (/launches)
New memecoin launches tracker.

- Table view: Token Name, Symbol, Chain, Age, Market Cap, Holders, Liquidity, Dev Wallet %, Status
- Status badges: "🟢 Safe", "🟡 Caution", "🔴 Danger", "💀 Rugged"
- Filter by chain (SOL/ETH/BASE/All)
- Sort by age, mcap, holders

### 4. Rug Watch (/rug-watch)
Investigative section.

- List of flagged tokens with risk analysis
- Each entry: Token name, chain, red flags (list), risk score (1-10), status
- Red flag examples: "Dev holds 80%", "Liquidity not locked", "Honeypot detected", "Copy of existing token"

### 5. About (/about)
Simple page:
- What is MemeDesk
- Mission: "Bringing editorial quality to memecoin coverage"
- Newsletter signup
- Social links (X, Telegram, Discord — placeholder URLs)

### 6. Newsletter Signup (component, not page)
- Email capture form
- Appears in sidebar, bottom of articles, and as a standalone modal
- "Get the daily memecoin briefing. Free."
- Store emails in a local JSON file for MVP

## Mock Data
Create a `/data` directory with JSON files:
- `coins.json` — 20 mock memecoins with prices, changes, mcap, chain, etc.
- `stories.json` — 10 mock news stories with headlines, summaries, timestamps
- `kols.json` — 50 KOLs (use the list from our research: handles, bios, tiers)
- `launches.json` — 15 mock new launches
- `rugs.json` — 8 mock rug pull entries

## Components
- `TickerBar` — horizontal scrolling price ticker
- `StoryCard` — news story card
- `CoinTable` — sortable data table for coins
- `KolCard` — influencer profile card
- `LaunchTable` — new launches table
- `RugAlert` — rug watch entry
- `NewsletterForm` — email capture
- `Sidebar` — desktop sidebar with leaderboard + CTAs
- `ChainBadge` — small badge showing SOL/ETH/BASE
- `StatusBadge` — Safe/Caution/Danger/Rugged badge
- `Header` — site header with nav
- `Footer` — site footer

## Layout
- Header: Logo left, nav links center (Home, KOL Tracker, Launches, Rug Watch), "Subscribe" button right
- Main content: 2-column on desktop (main + sidebar), single column mobile
- Footer: Links, copyright, socials

## Important Notes
- Use Tailwind v4 syntax: `@import "tailwindcss"` in CSS
- All data is mock/static — no API calls needed
- Make it look GOOD. This is a media brand. Design matters.
- Add subtle animations: ticker scrolling, hover effects on cards, smooth transitions
- Use emoji liberally — this is memecoin culture
- Include a favicon (use 🐸 frog emoji or generate a simple one)
