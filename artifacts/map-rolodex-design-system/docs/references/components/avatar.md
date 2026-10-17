# Avatar

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 429f5e82fc3dcf265625650176f16ff9b35e55826183e1f1b2d4dc2a338f9b15.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/avatar.tsx:1–49.
- Public exports: Avatar, AvatarImage, AvatarFallback.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-avatar.
- Runtime imports: react, @radix-ui/react-avatar, @/lib/utils.
- Importance: 0 unique import consumer files.
- Chunk: 4; status: pending.

## Consumer evidence
- No current import consumers; shipped reusable source primitive.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
