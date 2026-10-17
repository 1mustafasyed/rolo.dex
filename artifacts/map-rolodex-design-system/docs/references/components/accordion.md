# Accordion

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 8e4230a3e6d38bfab7b02f00f9e948c8c4038432c5b1bf2d0ea44dc8b5ce09cc.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/accordion.tsx:1–54.
- Public exports: Accordion, AccordionItem, AccordionTrigger, AccordionContent.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-accordion, lucide-react.
- Runtime imports: react, @radix-ui/react-accordion, @/lib/utils, lucide-react.
- Importance: 0 unique import consumer files.
- Chunk: 3; status: pending.

## Consumer evidence
- No current import consumers; shipped reusable source primitive.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
