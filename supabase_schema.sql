-- ============================================================
-- Wallot — Supabase Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users (extends Supabase auth.users) ──────────────────────
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  currency text default 'BRL',
  language text default 'pt',
  created_at timestamptz default now()
);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Entries ───────────────────────────────────────────────────
create table public.entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text check (type in ('expense', 'income')) not null,
  amount numeric(12, 2) not null,
  category text check (category in (
    'food', 'housing', 'transport', 'health',
    'shopping', 'entertainment', 'education', 'other'
  )) not null,
  description text not null,
  date timestamptz default now(),
  source text check (source in ('manual', 'voice', 'photo', 'text')) default 'manual',
  created_at timestamptz default now()
);

create index entries_user_id_idx on public.entries(user_id);
create index entries_date_idx on public.entries(date desc);

-- ── Budget Limits ─────────────────────────────────────────────
create table public.budget_limits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  category text not null,
  limit_amount numeric(12, 2) not null,
  period text check (period in ('monthly', 'weekly')) default 'monthly',
  created_at timestamptz default now(),
  unique(user_id, category)
);

-- ── Alerts ────────────────────────────────────────────────────
create table public.alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text check (type in (
    'daily_limit', 'category_limit', 'weekly_summary', 'monthly_report'
  )) not null,
  enabled boolean default true,
  threshold numeric(12, 2),
  created_at timestamptz default now(),
  unique(user_id, type)
);

-- Auto-create default alerts on user creation
create or replace function public.handle_new_user_alerts()
returns trigger as $$
begin
  insert into public.alerts (user_id, type, enabled) values
    (new.id, 'daily_limit', true),
    (new.id, 'category_limit', true),
    (new.id, 'weekly_summary', true),
    (new.id, 'monthly_report', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_user_created_alerts
  after insert on public.users
  for each row execute procedure public.handle_new_user_alerts();

-- ── Row Level Security ────────────────────────────────────────
alter table public.users enable row level security;
alter table public.entries enable row level security;
alter table public.budget_limits enable row level security;
alter table public.alerts enable row level security;

-- Users can only see and edit their own data
create policy "users: own data" on public.users
  for all using (auth.uid() = id);

create policy "entries: own data" on public.entries
  for all using (auth.uid() = user_id);

create policy "limits: own data" on public.budget_limits
  for all using (auth.uid() = user_id);

create policy "alerts: own data" on public.alerts
  for all using (auth.uid() = user_id);
