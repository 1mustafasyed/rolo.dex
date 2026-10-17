# Extraction chunks

The source ships 55 UI modules, normalized to 54 families (Toast includes Toaster). Only the first pilot is built.

The pilot selects highly reused Button, Separator, Input and Label APIs plus Card, which has an actual app consumer. Remaining families follow unique import-consumer counts and dependency order. Import counts are not evidence that the active auth/atlas screens use the library; those screens primarily use native markup.

- Chunk 1: card, button, separator, input, label. Implemented; awaiting pilot approval.
- Chunk 2: dialog, sheet, skeleton, textarea, toast. Pending; await continuation approval.
- Chunk 3: toggle, tooltip, accordion, alert, alert-dialog. Pending; await continuation approval.
- Chunk 4: aspect-ratio, avatar, badge, breadcrumb, button-group. Pending; await continuation approval.
- Chunk 5: calendar, carousel, chart, checkbox, collapsible. Pending; await continuation approval.
- Chunk 6: command, context-menu, drawer, dropdown-menu, empty. Pending; await continuation approval.
- Chunk 7: field, form, hover-card, input-group, input-otp. Pending; await continuation approval.
- Chunk 8: item, kbd, menubar, navigation-menu, pagination. Pending; await continuation approval.
- Chunk 9: popover, progress, radio-group, resizable, scroll-area. Pending; await continuation approval.
- Chunk 10: select, sidebar, slider, sonner, spinner. Pending; await continuation approval.
- Chunk 11: switch, table, tabs, toggle-group. Pending; await continuation approval.

AtlasMap, ContactForm, auth/atlas screens, Supabase hooks, and sample-location behavior are app-specific and remain in the app.
