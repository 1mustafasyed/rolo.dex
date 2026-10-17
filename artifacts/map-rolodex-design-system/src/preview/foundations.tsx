import { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { tokens } from '../generated/tokens';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { extractionChunks, familyCount } from './catalog-data';
import { Row } from './parts';

function BrandMark() {
  return <div className="rolodex-brand">
    <span className="rolodex-brand-mark"><Compass size={21} strokeWidth={1.4} aria-hidden="true" /></span>
    <span className="rolodex-brand-name">Rolodex</span>
  </div>;
}
function Caption({ children }: {children: React.ReactNode}) {
  return <h2 className="rolodex-label mb-4">{children}</h2>;
}
function Panel({ children }: {children: React.ReactNode}) {
  return <section className="rounded-lg border bg-card p-5 sm:p-6">{children}</section>;
}
function CurrentSwatch({ role, label }: {role:string;label:string}) {
  return <div><div className="mb-2 h-14 rounded-md border" style={{background:`hsl(var(--${role}))`}} />
    <p className="text-xs">{label}</p></div>;
}
export function OverviewPage() {
  return <div className="space-y-6">
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-4"><BrandMark /><span className="text-xs text-muted-foreground">Foundations + component pilot</span></div>
      <p className="my-6 font-serif text-4xl leading-none sm:text-5xl">People make a place <em className="text-primary">matter.</em></p>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">The current product’s charcoal/rust palette and editorial hierarchy, documented separately from the app. Dark is source-derived; light is a proposed counterpart.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <CurrentSwatch role="background" label="Charcoal / background" />
        <CurrentSwatch role="foreground" label="Paper / text" />
        <CurrentSwatch role="primary" label="Rust / primary" />
        <CurrentSwatch role="accent" label="Rust light / emphasis" />
      </div>
    </Panel>
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel>
        <Caption>01 / Buttons</Caption>
        <Row><Button>Primary</Button><Button variant="outline">Outline</Button><Button disabled>Disabled</Button></Row>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Source primitive API preserved. Below: the native product’s primary-button styling, available as a namespaced pattern.</p>
        <Button className="rolodex-primary mt-4 no-default-hover-elevate no-default-active-elevate">Add a person <ArrowRight /></Button>
      </Panel>
      <Panel>
        <Caption>02 / Inputs & 03 / Labels</Caption>
        <div className="space-y-5">
          <div className="space-y-2"><Label htmlFor="pilot-email" className="rolodex-label">Email address</Label><Input id="pilot-email" className="rolodex-input-line" type="email" placeholder="you@example.com" /></div>
          <div className="space-y-2"><Label htmlFor="pilot-name" className="rolodex-label">Name / boxed field</Label><Input id="pilot-name" className="rolodex-input" placeholder="A connection worth keeping" /></div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Underline fields from auth; boxed fields from the contact form.</p>
      </Panel>
      <Panel>
        <Caption>04 / Separators</Caption>
        <p className="font-serif text-2xl">Your world, connected.</p>
        <Separator decorative={false} className="my-4" />
        <div className="flex h-5 items-center gap-4 text-sm"><span>People</span><Separator orientation="vertical" /><span>Places</span><Separator orientation="vertical" /><span>Stories</span></div>
        <p className="mt-4 text-xs text-muted-foreground">One-pixel dividers; semantic and decorative modes retained.</p>
      </Panel>
      <section>
        <Caption>05 / Cards</Caption>
        <Card>
          <CardHeader><CardTitle className="font-serif text-3xl font-normal" role="heading" aria-level={2}>A connection worth keeping</CardTitle><CardDescription>Header, description, content, and footer from the source Card family.</CardDescription></CardHeader>
          <CardContent><p className="text-sm leading-relaxed">A quiet place to remember who you know, where they are, and the story behind the connection.</p></CardContent>
          <CardFooter className="flex-wrap gap-2"><Button size="sm">Primary action</Button><Button size="sm" variant="ghost">Secondary action</Button></CardFooter>
        </Card>
      </section>
    </div>
    <p className="border-t pt-5 text-sm text-muted-foreground">Pilot: 5 of {familyCount} reusable families. The catalog is not yet complete, and no app screens or canvas mockups have been migrated.</p>
  </div>;
}
export function ColorsPage() {
  return <div className="space-y-8">
    <Panel><p className="text-sm leading-relaxed text-muted-foreground">Dark roles map the active charcoal/rust CSS. Some semantic roles are normalized from native product patterns rather than copied from the dormant primitive variables. The full mapping and source values are recorded in the references. Light is derived, not a mode currently shipped by the app.</p></Panel>
    {(['dark','light'] as const).map(mode=><Panel key={mode}>
      <Caption>{mode==='dark'?'Dark / source-derived':'Light / derived proposal'}</Caption>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(tokens.color[mode]).map(([role,hex])=><div key={role}>
          <div className="mb-2 h-14 rounded-md border" style={{background:hex}} />
          <p className="break-words text-xs">{role}</p><code className="text-xs text-muted-foreground">{hex}</code>
        </div>)}
      </div>
    </Panel>)}
  </div>;
}
export function FontsPage() {
  return <div className="space-y-6">
    <Panel><Caption>Cormorant Garamond / display & editorial headings</Caption>
      <p className="font-serif text-5xl leading-none sm:text-6xl">Your world,<br/><em className="text-primary">connected.</em></p>
      <p className="mt-5 text-sm text-muted-foreground">400–500, including italic. Source headings use normal serif weight, tight tracking, and compact line height.</p>
    </Panel>
    <Panel><Caption>Inter / body, controls & captions</Caption>
      <p className="text-base">A quiet place to remember who you know.</p>
      <p className="mt-3 text-sm font-semibold">Add a person</p><p className="rolodex-label mt-5">Known city / Connection type</p>
      <p className="mt-5 text-sm text-muted-foreground">400, 500, 600, 700. The source “mono” role also points to Inter; it is not a monospace font.</p>
    </Panel>
    <Panel><Caption>Observed product hierarchy</Caption><dl className="grid gap-4 text-sm sm:grid-cols-2">
      <div><dt>Hero</dt><dd className="text-muted-foreground">58–102px / .92, −.04em tracking</dd></div>
      <div><dt>Auth title</dt><dd className="text-muted-foreground">54px desktop, 47px phone</dd></div>
      <div><dt>Panel title</dt><dd className="text-muted-foreground">39px / 1.04; 29px phone</dd></div>
      <div><dt>Field caption</dt><dd className="text-muted-foreground">10px, 500, uppercase, .18em tracking</dd></div>
      <div><dt>Body and details</dt><dd className="text-muted-foreground">12–14px, approximately 1.55–1.7 line height</dd></div>
      <div><dt>Control labels</dt><dd className="text-muted-foreground">12–13px, 400–700 depending on emphasis</dd></div>
    </dl></Panel>
  </div>;
}
export function LayoutPage() {
  return <div className="grid gap-6 lg:grid-cols-2">
    <Panel><Caption>Spacing / utility base 4px</Caption>
      <div className="space-y-4">{[4,8,12,16,24,32].map(px=><div key={px} className="flex items-center gap-4"><span className="w-10 text-xs">{px}px</span><span className="h-3 bg-primary" style={{width:px*3}} /></div>)}</div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Source native layouts also use optical values such as 9px button gaps, 17px field spacing, and 26px panel padding. These are not falsely presented as a uniform grid.</p>
    </Panel>
    <Panel><Caption>Radii / source geometry</Caption>
      <div className="space-y-4"><Button className="rolodex-primary">Control / 2px</Button><div className="rolodex-panel border bg-card p-5">Floating panel / 3px</div><div className="rounded-full border p-4 text-center">Avatar / circle</div></div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Primitive base radius: {tokens.radius}. Source phone bottom sheets use 12px top corners. Card primitives and app-native panels are separate compositions.</p>
    </Panel>
    <Panel><Caption>Field dimensions</Caption><p className="text-sm text-muted-foreground">Contact fields: minimum 42px, 10px × 12px padding. Auth underlines: minimum 45px, 7px 0 11px padding. Both have rust-light focus.</p></Panel>
    <Panel><Caption>Product breakpoints & overlays</Caption><p className="text-sm text-muted-foreground">Source adaptations at 900px and 680px. Phone panels become bottom sheets; fields stack into one column. Overlays use a dark scrim, 7px backdrop blur, and restrained shadows.</p></Panel>
  </div>;
}
export function BrandPage() {
  return <div className="space-y-6">
    <Panel><BrandMark /><p className="mt-6 text-sm text-muted-foreground">The existing brand lockup: Lucide Compass at 21px, 1.4 stroke, a 35px circular outline, a 5px orbit dot, and the Cormorant “Rolodex” wordmark. Rendered from the source markup, not a newly generated logo.</p></Panel>
    <Panel><Caption>Orbital motif / source auth artwork</Caption><div className="rolodex-orbit"><span className="rolodex-orbit-pin" /></div><p className="mt-5 text-sm text-muted-foreground">Concentric outlines and rust pins are observed in the sign-in artwork. Warm charcoal surfaces, thin rules, and serif display text establish the product’s visual language.</p></Panel>
    <Panel><Caption>Source distinction</Caption><p className="text-sm text-muted-foreground">The orange rectangle favicon is a scaffold asset, not evidence for a new brand palette or logo. It is not used as the system’s brand mark.</p></Panel>
  </div>;
}
export function ContentPage() {
  return <Panel><Caption>Observed product copy</Caption><div className="space-y-5 text-sm">
    <blockquote className="font-serif text-3xl">“People make a place matter.”</blockquote>
    <p>“Add a person” · “Known city” · “How we met” · “No story added yet.”</p>
    <p>“Private by design. Your map shows known cities, never live locations.”</p>
    <p className="text-muted-foreground">These are existing strings, not a newly invented voice guide. The product uses relationship-focused language in editorial text and direct labels for actions. Privacy wording remains the product’s own statement.</p>
  </div></Panel>;
}
export function MotionPage() {
  const [replay,setReplay]=useState(0);
  return <Panel><Caption>Observed timing</Caption>
    <ul className="space-y-3 text-sm text-muted-foreground"><li>Control hover: .2s; primary action rises 2px.</li><li>Detail entrance: .28s, 15px horizontal displacement.</li><li>Modal entrance: .25s; auth entrance: .55s, 12px vertical displacement.</li><li>Skeleton: 1.5s linear repeating shimmer.</li><li>Source reduced-motion preference shortens transitions and animations to .01ms.</li></ul>
    <div key={replay} className="rolodex-rise my-6 border-l-2 border-primary p-4 font-serif text-3xl">A quiet place for your connections.</div>
    <Button variant="outline" onClick={()=>setReplay(v=>v+1)}>Replay source rise</Button>
  </Panel>;
}
export function CatalogPage() {
  return <Panel><Caption>5 of {familyCount} families implemented</Caption>
    <p className="mb-6 text-sm text-muted-foreground">55 source UI modules, normalized to {familyCount} families. Toast includes its Toaster support module. The first pilot prioritizes dependency reuse plus Card’s actual app use; later chunks are dependency-ordered. A source file existing does not mean the active app currently displays that primitive.</p>
    <ol className="space-y-5">{extractionChunks.map((chunk,i)=><li key={i}><p className="text-sm font-medium">Chunk {i+1} · {i===0?'Implemented · awaiting review':'Pending'}</p><p className="mt-1 text-sm text-muted-foreground">{chunk.join(' · ')}</p></li>)}</ol>
    <p className="mt-6 border-t pt-5 text-sm text-muted-foreground">Completing the catalog is separate from applying it. The app and canvas remain unchanged until explicit approval.</p>
  </Panel>;
}