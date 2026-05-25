-- Signal — Supabase Schema
-- Run this in your Supabase SQL editor or via `supabase db push`

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────
-- TABLES
-- ──────────────────────────────────────

create table if not exists public.sources (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  url         text not null,
  platform    text not null check (platform in ('twitter','linkedin','blog','rss','reddit','arxiv','news')),
  focus_area  text,
  is_ai_pick  boolean not null default false,
  is_promoted boolean not null default false,
  created_at  timestamptz not null default now(),
  unique(user_id, url)
);

create table if not exists public.articles (
  id              uuid primary key default uuid_generate_v4(),
  source_id       uuid not null references public.sources(id) on delete cascade,
  title           text not null,
  excerpt         text,
  url             text not null unique,
  image_url       text,
  published_at    timestamptz not null default now(),
  relevance_score double precision not null default 0.5,
  platform        text not null,
  author_handle   text,
  created_at      timestamptz not null default now()
);

create table if not exists public.ratings (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  article_id  uuid not null references public.articles(id) on delete cascade,
  stars       smallint not null check (stars between 1 and 5),
  rated_at    timestamptz not null default now(),
  unique(user_id, article_id)
);

create table if not exists public.taste_profile (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category    text not null,
  score       double precision not null default 5.0 check (score between 0 and 10),
  updated_at  timestamptz not null default now(),
  unique(user_id, category)
);

-- ──────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────

create index if not exists idx_sources_user_id        on public.sources(user_id);
create index if not exists idx_articles_source_id     on public.articles(source_id);
create index if not exists idx_articles_published_at  on public.articles(published_at desc);
create index if not exists idx_ratings_user_id        on public.ratings(user_id);
create index if not exists idx_ratings_article_id     on public.ratings(article_id);
create index if not exists idx_taste_profile_user_id  on public.taste_profile(user_id);

-- ──────────────────────────────────────
-- ROW-LEVEL SECURITY (RLS)
-- ──────────────────────────────────────

alter table public.sources       enable row level security;
alter table public.articles      enable row level security;
alter table public.ratings       enable row level security;
alter table public.taste_profile enable row level security;

-- sources: users see/modify only their own
create policy "Users manage own sources"
  on public.sources for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- articles: users see articles from their own sources
create policy "Users see own articles"
  on public.articles for select
  using (
    exists (
      select 1 from public.sources s
      where s.id = articles.source_id
        and s.user_id = auth.uid()
    )
  );

-- Service role can insert/update articles (for cron jobs)
create policy "Service role manages articles"
  on public.articles for all
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ratings: users manage their own
create policy "Users manage own ratings"
  on public.ratings for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- taste_profile: users manage their own
create policy "Users manage own taste profile"
  on public.taste_profile for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role manages taste_profile (for cron jobs)
create policy "Service role manages taste profile"
  on public.taste_profile for all
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ──────────────────────────────────────
-- SEED: default focus areas for taste profile (triggered on first sign-in)
-- ──────────────────────────────────────

-- You can call this function after the first user signs up, or seed manually:
-- insert into public.taste_profile (user_id, category, score) values
--   ('<user-id>', 'AI Trends', 7),
--   ('<user-id>', 'Creative Tech', 8),
--   ...

-- ──────────────────────────────────────
-- SEED: starter sources (add after creating your user)
-- ──────────────────────────────────────

-- Replace '<your-user-id>' with the UUID from auth.users after signing up.
-- insert into public.sources (user_id, name, url, platform, focus_area) values
--   ('<your-user-id>', 'The Gradient', 'https://thegradient.pub/rss/', 'rss', 'AI Trends'),
--   ('<your-user-id>', 'AI Artists', 'https://aiartists.org/ai-art-news-feed', 'rss', 'Creative Tech'),
--   ('<your-user-id>', 'Yannic Kilcher', 'https://twitter.com/ykilcher', 'twitter', 'AI Trends'),
--   ('<your-user-id>', 'distill.pub', 'https://distill.pub/rss.xml', 'rss', 'Research Papers');
