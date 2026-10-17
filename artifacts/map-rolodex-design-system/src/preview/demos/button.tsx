import { useState } from 'react';
import { ArrowRight, Loader2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Row } from '../parts';
export default function ButtonDemo() {
  const [clicks,setClicks]=useState(0);
  return <div className="space-y-6 rounded-lg border bg-card p-6">
    <Row label="Source variants">{(['default','secondary','outline','ghost','link','destructive'] as const).map(variant=><Button key={variant} variant={variant} onClick={()=>setClicks(v=>v+1)}>{variant}</Button>)}</Row>
    <Row label="Source sizes"><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button><Button size="icon" aria-label="Add a person"><Plus /></Button></Row>
    <Row label="Native product pattern"><Button className="rolodex-primary no-default-hover-elevate no-default-active-elevate">Add a person <ArrowRight /></Button><Button className="rolodex-ghost no-default-hover-elevate no-default-active-elevate">Keep contact</Button></Row>
    <Row label="Disabled and pending"><Button disabled>Disabled</Button><Button disabled aria-busy="true"><Loader2 className="animate-spin" />One moment…</Button></Row>
    <Row label="Radix asChild / anchor semantics"><Button asChild variant="link"><a href="#page=colors">Open palette</a></Button></Row>
    <p role="status" className="text-sm text-muted-foreground">Source-variant button presses: {clicks}. Native events, disabled behavior, forwarded refs, and Slot composition are preserved.</p>
    <p className="text-xs text-muted-foreground">Loading is a composition of disabled + icon, not an invented loading prop.</p>
  </div>;
}