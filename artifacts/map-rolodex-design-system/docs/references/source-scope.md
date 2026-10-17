# Source, styling, and extraction scope

## Provenance

Source: the owner-supplied `artifacts/map-rolodex` workspace app. No network
repository or unrelated brand was used. Exact component source locations,
revision, digests, exports, imports, and usage evidence are in each family
reference. There is no app repository LICENSE file; this is an owner-requested
internal extraction, not a claim of external redistribution permission.

## Two visual layers

- `src/components/ui` supplies reusable Radix/shadcn-style primitives. Many are
  currently dormant; existence and dependency reuse do not mean the product
  displays them. All 55 modules are inventoried as 54 families, grouping Toaster
  into Toast. Source implementations, APIs, refs, and class strings are retained.
- The active auth, atlas, and contact-form UI primarily uses native markup and
  custom classes in `src/index.css`. Its final charcoal overrides win over the
  older teal rules in that same file. Those final rules are the palette and
  visual-pattern evidence.
- App-specific pages, contact management, map selection, authentication, and
  Supabase state are not design-system components. They stay in the app.

## Color-role normalization

Dark is source-derived from active native product rules, rather than pretending
the dormant primitive HSL variables exactly match every visible native control.

| System role | Active source evidence |
|---|---|
| background | `--land: #292929` |
| foreground / cardForeground / popoverForeground | `--paper: #eeeae4` |
| card / popover | `.detail-panel`, `.modal`: `#292827` |
| primary | `--rust: #c77a5f`, `.primary-btn`, selected row inset |
| primaryForeground | `.primary-btn`: `#1f1f1f` |
| secondary | `--surface: #302f2e` |
| secondaryForeground | `.ghost-btn`: `#e1ddd7` |
| muted | `--surface-raised: #363534` |
| mutedForeground | `--quiet: #bbb7b1` |
| accent / ring | `--rust-light: #dfa18a`, hover and focus |
| accentForeground | retained charcoal counterpart for accent surfaces |
| destructive | `.danger-btn` text: `#e2a79a`; normalized to a solid semantic action |
| destructiveForeground | charcoal counterpart; not the source's pale-on-pale primitive pairing |
| border | `--line: #44413e` |
| input | `.field input`: `#57524e` |
| sidebar | `.left-panel`: `#272525` |
| sidebarBorder / sidebarAccent | `#4b4845` / selected-row `#353331` |
| sidebarForeground, Primary, PrimaryForeground, AccentForeground, Ring | matching product text, rust, charcoal, paper and focus values |
| chart1–5 | rust, transit gray, editorial warm gray, POI gray, danger tint; semantic mapping, not a newly designed chart |

Exact palette source: `artifacts/map-rolodex/src/index.css:257–276`,
`300–365`. The original primitive variables are at `6–45`:
background `0 0% 12%`, foreground `40 16% 93%`, primary `14 48% 61%`,
accent `14 35% 45%`, destructive `5 55% 62%`. The role normalization above
is deliberate and documented, not an exact claim for those dormant values.

The source has no genuine light mode: `:root` and `.dark` have identical
declarations. Light is a derived proposal using warm paper surfaces, darker
rust for small-text contrast, and the same typography and geometry.

## Geometry and runtime

- Font evidence: `src/index.css:1,39–42,273–275` loads Inter and Cormorant
  Garamond. The “mono” role is explicitly Inter, not a substituted monospace.
- Primitive utility base uses 4px spacing and `.3rem` radius. Native controls
  have 2px corners; floating panels 3px; phone sheet tops 12px. Optical native
  spacing is retained rather than presented as a rigid 4px grid.
- Product control geometry: `124–129,185–190,300–313,360–365,398–413`.
- Product breakpoints: `226–254,427–441`, at 900px and 680px. The documentation
  shell's own responsive navigation is separate from product geometry.
- Motion and reduced motion: `223–225,255`, plus `.2s` controls and `.55s`
  auth entrance. Runtime reproduces reduced-motion shortening.
- `cn` uses clsx + tailwind-merge. Required public dependencies are declared
  on the self-contained design-system package. No imports resolve into the app.
- The source button references hover-elevation helpers that are not fully
  defined in its CSS; the scaffold theme's existing elevation runtime supplies
  those helpers without changing the copied Button API or classes.

## Identity evidence

The real visible lockup is markup, not a standalone image:
`src/pages/auth.tsx:33` and `src/pages/atlas.tsx:184–189`, with CSS at
`106–109,295–298`. The preview renders that same Compass, circle, dot and serif
wordmark. No logo image was invented. The source's orange-rectangle favicon
is scaffold residue and is not treated as a brand asset.

## Approval boundaries

This deliverable is a foundation and five-family pilot. The rest of the source
catalog remains pending. Obtain pilot approval, finish the remaining chunks,
and present the completed system before asking whether to apply it. Neither
pilot approval nor catalog completion grants permission to change app screens.