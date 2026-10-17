# Progress

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 74223bcccf7ca2ed026d197476abbe3d48fbc531c40f4252445f56954a270c75.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/progress.tsx:1–27.
- Public exports: Progress.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-progress.
- Runtime imports: react, @radix-ui/react-progress, @/lib/utils.
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
