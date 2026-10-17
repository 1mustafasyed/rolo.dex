# Separator

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 2b129347f918742bf006099f7f56a9be373250de2ecc3ad201297563e3d1f807.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/separator.tsx:1–28.
- Public exports: Separator.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-separator.
- Runtime imports: react, @radix-ui/react-separator, @/lib/utils.
- Importance: 4 unique import consumer files.
- Chunk: 1; status: implemented.

## Consumer evidence
- artifacts/map-rolodex/src/components/ui/button-group.tsx:2.
- artifacts/map-rolodex/src/components/ui/field.tsx:5.
- artifacts/map-rolodex/src/components/ui/item.tsx:3.
- artifacts/map-rolodex/src/components/ui/sidebar.tsx:7.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.
- artifacts/map-rolodex/src/index.css:124–129, 185–190, 300–313, 360–365, 398–413: native product controls and captions, distinct from the source primitive APIs.

## Build contract
Copied the complete source implementation; only @/lib/utils → ../../lib/utils changed. Public props, forwarded refs, DOM composition, classes, and behavior libraries are preserved. The role mapping to active product colors is documented in source-scope.md.
