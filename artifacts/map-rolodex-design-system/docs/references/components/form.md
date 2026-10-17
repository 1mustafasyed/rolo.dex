# Form

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 1960463b09152760fdd99ca3eb16187408d064c7599ed66384b42d1613d3a3a3.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/form.tsx:1–178.
- Public exports: useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField.
- Family dependencies: label.
- Public dependencies: react, @radix-ui/react-label, @radix-ui/react-slot, react-hook-form.
- Runtime imports: react, @radix-ui/react-label, @radix-ui/react-slot, react-hook-form, @/components/ui/label, @/lib/utils.
- Importance: 0 unique import consumer files.
- Chunk: 7; status: pending.

## Consumer evidence
- No current import consumers; shipped reusable source primitive.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
