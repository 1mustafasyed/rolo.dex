---
name: Shared demo account boundaries
description: User-mandated scope limits for the existing shared Map Rolodex demo account.
---

The shared demo account and its demo-login Edge Function already exist in Supabase. Do not create/reset the account or modify the database, auth settings, or RLS policies. Demo UI work is frontend-only unless the user explicitly authorizes repairing the existing demo-login Edge Function.

**Why:** The user specified that the existing backend already prevents demo writes and must remain untouched, then explicitly authorized investigating and repairing the failing demo-login function. That authorization does not extend to the account, database, auth settings, or RLS.

**How to apply:** Use the existing public-client session flow. Do not request a demo password or introduce credentials. Preserve other visitors' sessions when a visitor exits the shared demo.