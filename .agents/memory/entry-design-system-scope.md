---
name: Entry-surface design-system scope
description: Scope of approved design-system adoption for the Map Rolodex entrance.
---

Shared design-system adoption is approved for the rust and welcome panes, not for the existing login or map screens. Do not import the package's global theme into the active app as part of entrance work.

**Why:** The user explicitly excluded app-wide migration and login/map redesign from the welcome restoration. The existing app theme differs from the shared primary token, so a global theme import would change unrelated screens.

**How to apply:** Consume exported tokens within the entrance surface and use package primitives there. Obtain separate approval before migrating login/map styling or changing design-system tokens.

When revising how the panes enter, preserve the splash's existing internal text/artwork composition. Its animation should start as the splash becomes visible during entry, not after entry finishes.

**Why:** The user requested overlapping bottom-to-top pane entry while preserving the branded splash animation, then explicitly corrected the delayed animation start.

**How to apply:** Keep whole-pane motion and internal animation coordinated but distinct: start the internal reveal during entry, keep it continuous when entry completes, and retain a readable hold afterward.