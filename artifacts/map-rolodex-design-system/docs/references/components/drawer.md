# Drawer

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 152bc340ad982e84f851e3bc1a6b8e7ffd0151a7445c6ecf1b1e3e13cbc19210.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/drawer.tsx:1–115.
- Public exports: Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription.
- Family dependencies: None.
- Public dependencies: react, vaul.
- Runtime imports: react, @/lib/utils, vaul.
- Importance: 0 unique import consumer files.
- Chunk: 6; status: pending.

## Consumer evidence
- No current import consumers; shipped reusable source primitive.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
