-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('host', 'seeker')),
  bio text,
  preferences jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings Table
create table if not exists public.listings (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.users(id) not null,
  title text,
  description text,
  price integer,
  location text,
  features jsonb,
  rules jsonb,
  available_from date,
  min_stay_months integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Matches Table
create table if not exists public.matches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  target_id uuid references public.users(id) not null,
  status text check (status in ('liked', 'disliked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, target_id)
);

-- Messages Table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) not null,
  receiver_id uuid references public.users(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- Policies
-- Users
drop policy if exists "Public profiles are viewable by everyone" on public.users;
create policy "Public profiles are viewable by everyone" on public.users for select using (true);

drop policy if exists "Users can insert their own profile" on public.users;
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Listings
drop policy if exists "Listings are viewable by everyone" on public.listings;
create policy "Listings are viewable by everyone" on public.listings for select using (true);

drop policy if exists "Hosts can insert listings" on public.listings;
create policy "Hosts can insert listings" on public.listings for insert with check (auth.uid() = host_id);

drop policy if exists "Hosts can update own listings" on public.listings;
create policy "Hosts can update own listings" on public.listings for update using (auth.uid() = host_id);

-- Matches
drop policy if exists "Users can see their own matches" on public.matches;
create policy "Users can see their own matches" on public.matches for select using (auth.uid() = user_id);

drop policy if exists "Users can insert matches" on public.matches;
create policy "Users can insert matches" on public.matches for insert with check (auth.uid() = user_id);

-- Messages
drop policy if exists "Users can see their messages" on public.messages;
create policy "Users can see their messages" on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can send messages" on public.messages;
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);
