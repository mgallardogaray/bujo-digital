-- Ejecutar UNA vez en Supabase: SQL Editor > New query > pegar todo > Run.
-- Crea una fila por usuario con todos sus datos, y reglas para que cada uno solo vea la suya.

create table if not exists public.user_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  rev        integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

drop policy if exists "leer lo mio" on public.user_state;
drop policy if exists "crear lo mio" on public.user_state;
drop policy if exists "cambiar lo mio" on public.user_state;

create policy "leer lo mio" on public.user_state
  for select using (auth.uid() = user_id);

create policy "crear lo mio" on public.user_state
  for insert with check (auth.uid() = user_id);

create policy "cambiar lo mio" on public.user_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
