# Toggle

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 5800d2099224ef90892e8c1d972d2a0964391c33cd43d7f5c6abf5cd42e023e1.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/toggle.tsx:1–42.
- Public exports: Toggle, toggleVariants.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-toggle, class-variance-authority.
- Runtime imports: react, @radix-ui/react-toggle, @/lib/utils, class-variance-authority.
- Importance: 1 unique import consumer files.
- Chunk: 3; status: pending.

## Consumer evidence
- artifacts/map-rolodex/src/components/ui/toggle-group.tsx:5.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
