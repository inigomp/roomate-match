-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('host', 'seeker')),
  bio text,
  preferences jsonb, -- Stores things like { "smoker": false, "pets": true }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings Table (Apartments)
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.users(id) not null,
  title text not null,
  description text,
  price numeric,
  location text,
  features jsonb, -- { "wifi": true, "ac": true }
  rules jsonb, -- { "no_smoking": true, "no_pets": false }
  images text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Matches Table
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null, -- The person who swiped
  target_id uuid references public.users(id) not null, -- The person/listing swiped on
  status text check (status in ('liked', 'disliked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, target_id)
);

-- Messages Table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) not null,
  receiver_id uuid references public.users(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Basic)
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

create policy "Public profiles are viewable by everyone" on public.users for select using (true);
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Listings are viewable by everyone" on public.listings for select using (true);
create policy "Hosts can insert listings" on public.listings for insert with check (auth.uid() = host_id);

create policy "Users can see their own matches" on public.matches for select using (auth.uid() = user_id);
create policy "Users can insert matches" on public.matches for insert with check (auth.uid() = user_id);

create policy "Users can see their messages" on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);
