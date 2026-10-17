/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#f3efe9",
      "foreground": "#292827",
      "card": "#faf7f2",
      "cardForeground": "#292827",
      "popover": "#faf7f2",
      "popoverForeground": "#292827",
      "primary": "#98523c",
      "primaryForeground": "#ffffff",
      "secondary": "#e4ded6",
      "secondaryForeground": "#292827",
      "muted": "#eae4dc",
      "mutedForeground": "#68615a",
      "accent": "#e5baaa",
      "accentForeground": "#292827",
      "destructive": "#a34739",
      "destructiveForeground": "#ffffff",
      "border": "#cdc3b8",
      "input": "#9a8e83",
      "ring": "#98523c",
      "chart1": "#98523c",
      "chart2": "#716a63",
      "chart3": "#a78e7c",
      "chart4": "#55514d",
      "chart5": "#a65545",
      "sidebar": "#eae4dc",
      "sidebarForeground": "#292827",
      "sidebarBorder": "#cdc3b8",
      "sidebarPrimary": "#98523c",
      "sidebarPrimaryForeground": "#ffffff",
      "sidebarAccent": "#e4ded6",
      "sidebarAccentForeground": "#292827",
      "sidebarRing": "#98523c"
    },
    "dark": {
      "background": "#292929",
      "foreground": "#eeeae4",
      "card": "#292827",
      "cardForeground": "#eeeae4",
      "popover": "#292827",
      "popoverForeground": "#eeeae4",
      "primary": "#c77a5f",
      "primaryForeground": "#1f1f1f",
      "secondary": "#302f2e",
      "secondaryForeground": "#e1ddd7",
      "muted": "#363534",
      "mutedForeground": "#bbb7b1",
      "accent": "#dfa18a",
      "accentForeground": "#1f1f1f",
      "destructive": "#e2a79a",
      "destructiveForeground": "#1f1f1f",
      "border": "#44413e",
      "input": "#57524e",
      "ring": "#dfa18a",
      "chart1": "#c77a5f",
      "chart2": "#a8a8a8",
      "chart3": "#d0c8bd",
      "chart4": "#878787",
      "chart5": "#e2a79a",
      "sidebar": "#272525",
      "sidebarForeground": "#eeeae4",
      "sidebarBorder": "#4b4845",
      "sidebarPrimary": "#c77a5f",
      "sidebarPrimaryForeground": "#1f1f1f",
      "sidebarAccent": "#353331",
      "sidebarAccentForeground": "#eeeae4",
      "sidebarRing": "#dfa18a"
    }
  },
  "fontFamily": {
    "sans": [
      "Inter",
      "sans-serif"
    ],
    "serif": [
      "Cormorant Garamond",
      "Georgia",
      "serif"
    ],
    "mono": [
      "Inter",
      "sans-serif"
    ]
  },
  "radius": "0.3rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
