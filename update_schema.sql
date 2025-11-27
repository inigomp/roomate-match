-- Run this script in the Supabase SQL Editor to update your database

-- 1. Add new columns to 'listings' table (if they don't exist)
alter table public.listings add column if not exists available_from date;
alter table public.listings add column if not exists min_stay_months integer;
alter table public.listings add column if not exists features jsonb;
alter table public.listings add column if not exists rules jsonb;

-- 2. Add 'preferences' to 'users' table (if it doesn't exist)
alter table public.users add column if not exists preferences jsonb;

-- 3. Create 'matches' table if it doesn't exist
create table if not exists public.matches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  target_id uuid references public.users(id) not null,
  status text check (status in ('liked', 'disliked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, target_id)
);

-- 4. Enable RLS on matches
alter table public.matches enable row level security;

-- 5. Add policies for matches
drop policy if exists "Users can see their own matches" on public.matches;
create policy "Users can see their own matches" on public.matches for select using (auth.uid() = user_id);

drop policy if exists "Users can insert matches" on public.matches;
create policy "Users can insert matches" on public.matches for insert with check (auth.uid() = user_id);
