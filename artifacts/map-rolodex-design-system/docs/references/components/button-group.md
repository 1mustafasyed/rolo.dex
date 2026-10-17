# Button Group

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: b89025c11d08652597cb46b097d3e04658ad2c383bf81ed445c8182c0ed1b260.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/button-group.tsx:1–82.
- Public exports: ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants.
- Family dependencies: separator.
- Public dependencies: @radix-ui/react-slot, class-variance-authority.
- Runtime imports: @radix-ui/react-slot, @/components/ui/separator, @/lib/utils, class-variance-authority.
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
