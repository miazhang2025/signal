# Signal — Your Personalized AI Newspaper

A full-stack personalized daily newspaper that aggregates content from Twitter/X, RSS feeds, and NewsAPI, ranked and curated by Claude AI based on your taste profile.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (custom newspaper design system)
- **Supabase** (Postgres database + magic-link auth + Row Level Security)
- **Anthropic Claude** (AI curation + relevance scoring)
- **Twitter API v2**, **RSS feeds**, **NewsAPI**

---

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd signal
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in all values — see notes below for how to get each key.

### 3. Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Copy your **Project URL** and **anon key** from Settings → API → `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copy the **service_role key** → `SUPABASE_SERVICE_KEY` (keep this secret — server-only)
4. In the Supabase dashboard → **SQL Editor** → paste the contents of `supabase/schema.sql` and run it

**Enable magic-link auth:**  
Settings → Authentication → Email → Enable "Enable Email OTP (Magic Link)"  
Set Site URL to `http://localhost:3000` (dev) or your production URL

### 4. Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Create a new API key → `ANTHROPIC_API_KEY`

### 5. Twitter/X API (optional)

Only required if you want to track Twitter/X accounts.

1. Apply at [developer.twitter.com](https://developer.twitter.com/en/portal/dashboard)
2. Create a project + app
3. Copy the **Bearer Token** → `TWITTER_BEARER_TOKEN`
4. Your app needs at minimum **Read** access

### 6. NewsAPI (optional)

1. Register at [newsapi.org](https://newsapi.org/register) (free: 100 req/day)
2. Copy your API key → `NEWS_API_KEY`

### 7. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign in with your email (magic link sent to your inbox).

---

## Seeding Initial Sources

After signing up, grab your user ID from the Supabase dashboard (Authentication → Users), then run this SQL (replace `<your-user-id>`):

```sql
insert into public.sources (user_id, name, url, platform, focus_area) values
  ('<your-user-id>', 'The Gradient', 'https://thegradient.pub/rss/', 'rss', 'AI Trends'),
  ('<your-user-id>', 'AI Artists News', 'https://aiartists.org/feed', 'rss', 'Creative Tech'),
  ('<your-user-id>', 'Distill.pub', 'https://distill.pub/rss.xml', 'rss', 'Research Papers'),
  ('<your-user-id>', 'Yannic Kilcher', 'https://twitter.com/ykilcher', 'twitter', 'AI Trends');
```

Then seed taste preferences:

```sql
insert into public.taste_profile (user_id, category, score) values
  ('<your-user-id>', 'AI Trends', 8),
  ('<your-user-id>', 'Creative Tech', 9),
  ('<your-user-id>', 'Tech Art', 7),
  ('<your-user-id>', 'Generative Design', 8),
  ('<your-user-id>', 'Tools & Pipelines', 6);
```

---

## Fetching Content

To trigger a manual content fetch (requires `CRON_SECRET`):

```bash
curl -X POST http://localhost:3000/api/cron/fetch \
  -H "x-cron-secret: your_cron_secret_value"
```

To run the AI curation pass:

```bash
curl -X POST http://localhost:3000/api/cron/curate \
  -H "x-cron-secret: your_cron_secret_value"
```

---

## Deploying to Vercel

1. Push to GitHub → import project in [vercel.com](https://vercel.com)
2. Set all environment variables in Vercel dashboard → Settings → Environment Variables
3. The `vercel.json` cron config runs fetch at 6:00 AM UTC and curate at 6:30 AM UTC daily

**Important:** Vercel Cron Jobs send requests without the `x-cron-secret` header by default. Add this to each cron in `vercel.json`:
```json
{
  "path": "/api/cron/fetch",
  "schedule": "0 6 * * *"
}
```
Then in each route, also accept the Vercel-provided `Authorization: Bearer <CRON_SECRET>` header, or use the Vercel Cron Job protection by setting `CRON_SECRET` in env and checking `req.headers['authorization']`.

---

## Architecture

```
app/
  page.tsx          — Server Component: fetches feed, renders layout
  login/page.tsx    — Magic-link login page
  auth/callback/    — Supabase OAuth callback
  api/
    feed/           — GET ranked articles for today
    ratings/        — POST save star rating + update taste profile
    sources/        — GET/POST user sources; DELETE/promote by id
    taste/          — GET/POST taste profile
    cron/
      fetch/        — Fetches fresh content from all sources
      curate/       — Runs Claude AI curation pass

components/
  NewspaperLayout   — Main page shell with grid
  Masthead          — Paper header with watermark
  NavBar            — Black nav + MY TASTE / ADD SOURCE buttons
  TickerStrip       — Scrolling pink breaking news ticker
  PreferencesBar    — Toggleable topic pills
  ArticleCard       — 3-variant card (hero / secondary / grid)
  Sidebar           — Sources list + trending
  RatingStars       — 1–5 star rating with immediate save
  SourcesModal      — Add source form
  TasteModal        — Interest bars + topic prefs + stats

lib/
  ranking.ts        — rankingScore() + buildFeed() layout algorithm
  anthropic.ts      — Claude curation call
  fetchers/         — RSS, Twitter, NewsAPI integrations
  supabase/         — client + server + service Supabase helpers
```

---

## Ranking Algorithm

```
score = (user_rating × 0.7) + (relevance_score × 0.3) + recency_boost

recency_boost:
  < 3h  → +1.0
  < 6h  → +0.7
  < 12h → +0.4
  < 24h → +0.1
```

Sorted descending → hero (rank 1) · secondary (2–3) · grid (4–9) · sidebar trending (10+).

---

## AI Curation (20% of feed)

The daily `POST /api/cron/curate` endpoint calls Claude Sonnet with your taste profile and existing sources. Claude:
1. **Scores** each unrated article 0–1 for relevance
2. **Suggests** 2–3 new sources you don't already follow

AI-picked sources appear in the sidebar with a black dot and "+ ADD" button. Promoting them turns the dot pink and marks `is_ai_pick = false, is_promoted = true`.
