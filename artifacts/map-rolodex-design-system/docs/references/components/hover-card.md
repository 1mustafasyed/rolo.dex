# Hover Card

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: e0b4e3f0126757a8eb5c6e436c8c041c049430abe9a2eb84b10154144b31c29c.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/hover-card.tsx:1–26.
- Public exports: HoverCard, HoverCardTrigger, HoverCardContent.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-hover-card.
- Runtime imports: react, @radix-ui/react-hover-card, @/lib/utils.
- Importance: 0 unique import consumer files.
- Chunk: 7; status: pending.

## Consumer evidence
- No current import consumers; shipped reusable source primitive.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
