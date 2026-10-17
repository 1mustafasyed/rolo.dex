# Resizable

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 8e73dfb8b582944364d73b64ed03378016f20f7251f15f880dcf0fb140e1ad41.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/resizable.tsx:1–44.
- Public exports: ResizablePanelGroup, ResizablePanel, ResizableHandle.
- Family dependencies: None.
- Public dependencies: react-resizable-panels, lucide-react.
- Runtime imports: react-resizable-panels, @/lib/utils, lucide-react.
- Importance: 0 unique import consumer files.
- Chunk: 9; status: pending.

## Consumer evidence
- No current import consumers; shipped reusable source primitive.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
