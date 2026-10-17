# Item

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 4a84cda22d692ee176f5128517a4003a63d11f907df445e7586ef034c88e8772.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/item.tsx:1–192.
- Public exports: Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter.
- Family dependencies: separator.
- Public dependencies: react, @radix-ui/react-slot, class-variance-authority.
- Runtime imports: react, @radix-ui/react-slot, @/components/ui/separator, @/lib/utils, class-variance-authority.
- Importance: 0 unique import consumer files.
- Chunk: 8; status: pending.

## Consumer evidence
- No current import consumers; shipped reusable source primitive.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
