# Tooltip

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: e3c6ea9d4ecd62881af33564e25be013d35a8a7fa78475a6dcc98a06c7f894eb.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/tooltip.tsx:1–31.
- Public exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-tooltip.
- Runtime imports: react, @radix-ui/react-tooltip, @/lib/utils.
- Importance: 1 unique import consumer files.
- Chunk: 3; status: pending.

## Consumer evidence
- artifacts/map-rolodex/src/components/ui/sidebar.tsx:21.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
