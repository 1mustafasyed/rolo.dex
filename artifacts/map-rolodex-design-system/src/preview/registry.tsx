import { lazy, type ComponentType } from 'react';
import { OverviewPage, ColorsPage, FontsPage, LayoutPage, BrandPage, MotionPage, ContentPage, CatalogPage } from './foundations';

export type PreviewEntry = { id: string; name: string; description: string; Page: ComponentType };
export type NavGroup = { name: string; entries: PreviewEntry[] };
const page = (load: () => Promise<{default: ComponentType}>) => lazy(load);
export const DESIGN_SYSTEM = {
  title: 'Map Rolodex Design System',
  description: 'Charcoal, rust, and editorial typography. Extracted foundations and the first five source-backed component families; existing app screens are unchanged.',
};
export const OVERVIEW_ENTRY: PreviewEntry = { id:'overview',name:'Overview',description:'Foundations and five-component pilot',Page:OverviewPage };
export const NAV_GROUPS: NavGroup[] = [
  {name:'Brand',entries:[{id:'brand-language',name:'Visual language',description:'Source-derived identity and orbital motifs',Page:BrandPage}]},
  {name:'Colors',entries:[{id:'colors',name:'Palette & roles',description:'All 32 roles; original dark and derived light',Page:ColorsPage}]},
  {name:'Fonts',entries:[{id:'fonts',name:'Families & hierarchy',description:'Inter and Cormorant Garamond',Page:FontsPage}]},
  {name:'Layout',entries:[{id:'layout',name:'Spacing & surfaces',description:'Source spacing, control radii, and panels',Page:LayoutPage}]},
  {name:'Actions',entries:[{id:'button',name:'Buttons',description:'Six variants, four sizes, disabled and slot behavior',Page:page(()=>import('./demos/button'))}]},
  {name:'Forms & inputs',entries:[
    {id:'input',name:'Inputs',description:'Native field behavior and source product field patterns',Page:page(()=>import('./demos/input'))},
    {id:'label',name:'Labels',description:'Radix labeling and source uppercase field captions',Page:page(()=>import('./demos/label'))},
  ]},
  {name:'Structure',entries:[
    {id:'separator',name:'Separators',description:'Horizontal, vertical, decorative and semantic dividers',Page:page(()=>import('./demos/separator'))},
    {id:'card',name:'Cards',description:'Source Card, Header, Title, Description, Content and Footer',Page:page(()=>import('./demos/card'))},
  ]},
  {name:'Content',entries:[{id:'content-voice',name:'Voice & labels',description:'Existing product copy patterns',Page:ContentPage}]},
  {name:'Motion',entries:[{id:'motion',name:'Timing & accessibility',description:'Current animation evidence and reduced motion',Page:MotionPage}]},
  {name:'Catalog',entries:[{id:'catalog',name:'Extraction progress',description:'Pilot and dependency-ordered remaining component chunks',Page:CatalogPage}]},
];
export const ALL_ENTRIES = [OVERVIEW_ENTRY,...NAV_GROUPS.flatMap(g=>g.entries)];
if(new Set(ALL_ENTRIES.map(e=>e.id)).size!==ALL_ENTRIES.length) throw Error('Duplicate design-system page id');