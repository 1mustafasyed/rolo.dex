# Toast

- Source kind: owner-supplied readable workspace implementation.
- Source revision: 370628bb2857ed3ffbfa77f155d8afc17bb09e1d; source file digest: 04d4ef720079342e2f4380c22683f1544bd8e93a581fb55e447458f04a6127d5.
- License/provenance: internal extraction requested by the workspace owner; no app repository LICENSE file. Public dependencies retain their own licenses. External redistribution requires license review.
- Exact implementation: artifacts/map-rolodex/src/components/ui/toast.tsx:1–126. Support: artifacts/map-rolodex/src/components/ui/toaster.tsx:1–33.
- Public exports: type, ToastProps, ToastActionElement, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction, Toaster.
- Family dependencies: None.
- Public dependencies: react, @radix-ui/react-toast, class-variance-authority, lucide-react.
- Runtime imports: react, @radix-ui/react-toast, @/lib/utils, class-variance-authority, lucide-react, @/components/ui/toast, @/hooks/use-toast.
- Importance: 1 unique import consumer files.
- Chunk: 2; status: pending.

## Consumer evidence
- artifacts/map-rolodex/src/hooks/use-toast.ts:2.

## Styling and runtime evidence
- artifacts/map-rolodex/src/index.css:6–69: semantic tokens and Tailwind bindings.
- artifacts/map-rolodex/src/index.css:257–276: active charcoal/rust variables.
- artifacts/map-rolodex/src/lib/utils.ts:1–7: clsx and tailwind-merge.

## Build contract
Before building, read the full implementation, source CSS, support hooks, and consumer examples above. Reuse the actual source API and behavior libraries; do not restore a deleted scaffold implementation. Rewrite internal imports to relative package paths, then add a source-backed story. Do not modify app screens.
