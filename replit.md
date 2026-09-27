# Map Rolodex

A private, city-level map of professional contacts for reconnecting while traveling.

## Run & Operate

- `pnpm --filter @workspace/map-rolodex run dev` — run the web app via its managed workflow
- `pnpm run typecheck` — full typecheck across all packages
- Required secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — the public client configuration for the existing Supabase project

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- App: React + Vite with Supabase Auth and the Supabase JavaScript client
- Map: MapLibre GL with dark CARTO tiles and client-side clustering
- Contacts: existing Supabase Postgres schema, not the workspace's local database

## Where things live

- `artifacts/map-rolodex/` — web app.
- The existing Supabase project **Rola.Dex primary** is the source of truth for database schema.

## Architecture decisions

- Do not create, alter, migrate, or seed database tables/views/policies/functions outside the existing `seed_sample_contacts` RPC explicitly invoked by the signed-in user.
- Supabase Auth supplies identity. `owner_id` on new contacts is populated by the database, not client input. RLS enforces user data silos.
- `contacts_on_map` is read-only map data. Mutations go to `contacts`. A contact stores `place_id` pointing to `places`, never raw coordinates.
- The `VITE_` public URL and anon key are supplied as secrets at build time and intentionally included in the browser bundle; they are not privileged credentials. Never use a service-role key.

## Product

Users sign in, see contacts located by city on a clustered world map, inspect details, and manage their own contacts by picking an existing place. Users with no contacts can request sample contacts through `seed_sample_contacts`.

## User preferences

- The existing Supabase schema must remain untouched; do not use the local Replit database for contacts.
- Defer trips, imports, geolocation, city fly-to search, and connection-type filters.

## Gotchas

- `places` is readable but not writable by users. Contacts without `place_id` must not appear on the map.
- `connection_type` accepts only `Work`, `Event`, `Peer`, `Family`, or `Professor`.

## Pointers

- The workspace includes a template API server and Drizzle library, but Map Rolodex must not use those for contact storage.
