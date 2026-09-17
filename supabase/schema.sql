-- Business Plan & Targets Toolkit — free lite tool
-- Run this once in a NEW, separate Supabase project (SQL Editor -> New query).
-- Do not run this against the main coaching app's Supabase project — this
-- tool has its own users and its own copies of these table names.

create extension if not exists "pgcrypto";

-- One row per signed-up user, created at sign-up time by the app itself.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users manage their own profile"
  on profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

-- A single business plan per user (5 free-text sections).
create table if not exists business_plan (
  user_id uuid primary key references profiles (id) on delete cascade,
  current_state text,
  vision text,
  focus_areas text,
  action_steps text,
  obstacles text,
  updated_at timestamptz not null default now()
);

alter table business_plan enable row level security;

create policy "Users manage their own business plan"
  on business_plan for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Simple monthly targets.
create table if not exists targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  period_month date not null,
  title text not null,
  target_value numeric,
  target_unit text,
  actual_value numeric,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'achieved', 'missed')),
  created_at timestamptz not null default now()
);

alter table targets enable row level security;

create policy "Users manage their own targets"
  on targets for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index if not exists targets_user_id_period_month_idx
  on targets (user_id, period_month);
