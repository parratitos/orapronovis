-- Crear tabla de eventos
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  starts_at timestamptz not null,
  location text,
  owner_id uuid references auth.users(id),
  image_path text,
  created_at timestamptz default now()
);

-- Crear tabla de asistencia a eventos
create table if not exists attendees (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) not null,
  user_id uuid references auth.users(id) not null,
  joined_at timestamptz default now(),
  unique(event_id, user_id)
);

-- Índice útil para consultas por usuario
create index if not exists idx_attendees_user_id on attendees(user_id);
create index if not exists idx_events_starts_at on events(starts_at);
