# Ora Pro Novis

Aplicación web de calendario colaborativo para programar y unirse a eventos de oración.

## Stack

- Next.js
- Supabase (PostgreSQL, autenticación, almacenamiento)
- Hosting gratuito con Vercel

## Instalación local

1. Clona o copia este proyecto.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un proyecto en Supabase y anota:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Crea un bucket público en Supabase llamado `event-images`.
5. Crea estas tablas en la base de datos de Supabase:

```sql
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  starts_at timestamptz not null,
  location text,
  owner_id uuid references auth.users(id),
  image_path text,
  created_at timestamptz default now()
);

create table attendees (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) not null,
  user_id uuid references auth.users(id) not null,
  joined_at timestamptz default now(),
  unique(event_id, user_id)
);
```

6. Crea un archivo `.env.local` en la raíz con estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

7. Ejecuta la aplicación:
   ```bash
   npm run dev
   ```

## Deploy recomendado

- Conecta tu repo a Vercel.
- Agrega las mismas variables de entorno en Vercel.
- Despliega y usa el dominio gratuito `*.vercel.app`.

## Configuración adicional de Supabase

1. En el panel de Supabase, ve a `Authentication > Settings`.
2. Activa "Email" como proveedor de inicio de sesión.
4. Activa los proveedores `Google` y `Facebook` en `Authentication > Providers`.
5. Si Supabase te pide Client ID / Client Secret, consíguelos desde Google Cloud Console y Facebook for Developers, y pégalos en el formulario de cada proveedor.
6. Configura las URLs de redirección en Supabase:
   - `http://localhost:3000`
   - `https://<tu-proyecto>.vercel.app`

> Si usas la app local, el login con Google o Facebook redirigirá a `localhost:3000`.

## Login con redes sociales

La aplicación ya está preparada para iniciar sesión con Google y Facebook desde la pantalla de acceso. Verás dos botones nuevos junto al formulario de correo.

- `Iniciar con Google`
- `Iniciar con Facebook`

El login por correo electrónico sigue funcionando con el enlace mágico, de modo que mantienes las tres opciones.

## Archivo SQL

Puedes usar `supabase.sql` para crear las tablas necesarias con este comando en la consola SQL de Supabase o en el editor SQL del proyecto:

```sql
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
```
