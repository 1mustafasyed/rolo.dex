# Dialog

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: e0d3fa53f4cb7d8011ab09f2d198c24234062d24638fabf5142f5fbce57d2ba5.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/dialog.tsx:1–119.
- Public exports: Dialog, DialogPortal, DialogOverlay, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-dialog, lucide-react.
- Runtime imports: react, @radix-ui/react-dialog, @/lib/utils, lucide-react.
- Importance: 1 unique import consumer files.
- Chunk: 2; status: pending.

## Consumer evidence
- artifacts/map-rolodex/src/components/ui/command.tsx:5.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
