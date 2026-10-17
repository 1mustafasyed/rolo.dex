---
name: Supabase logout failures
description: Supabase Auth can clear local state on failed logout; do not trust a returned error to mean the session survived.
---

Supabase Auth in this project's installed version removes the local session and emits signed-out even when remote logout returns an unexpected error, including HTTP 500.

**Why:** Browser verification exposed demo exit returning to login without an error despite the logout request failing; the installed Auth source confirmed this behavior.

**How to apply:** When a workflow must remain signed in on logout failure, defer auth-event application until the operation settles and restore the existing session through the public API on failure. If restoration also fails, explicitly show the lost-session error instead of retaining a misleading authenticated UI. Preserve the shared demo's local-only logout scope.