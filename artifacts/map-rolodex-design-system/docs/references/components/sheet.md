# Sheet

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: ef2ae35ccab1252c4eee56e67e9f1b2499b5bbfb3ae39037d8d4be39915c272f.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/sheet.tsx:1–139.
- Public exports: Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-dialog, class-variance-authority, lucide-react.
- Runtime imports: react, @radix-ui/react-dialog, @/lib/utils, class-variance-authority, lucide-react.
- Importance: 1 unique import consumer files.
- Chunk: 2; status: pending.

## Consumer evidence
- artifacts/map-rolodex/src/components/ui/sidebar.tsx:14.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
