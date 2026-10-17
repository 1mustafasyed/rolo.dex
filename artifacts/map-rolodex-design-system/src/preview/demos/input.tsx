import { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
export default function InputDemo() {
  const [value,setValue]=useState('');
  return <div className="max-w-xl space-y-6 rounded-lg border bg-card p-6">
    <div className="space-y-2"><Label htmlFor="demo-input">Controlled native text input</Label><Input id="demo-input" value={value} onChange={e=>setValue(e.target.value)} placeholder="Type a name" /><p role="status" className="text-xs text-muted-foreground">Current value: {value||'Empty'}</p></div>
    <div className="space-y-2"><Label className="rolodex-label" htmlFor="demo-input-email">Auth underline / email</Label><Input id="demo-input-email" className="rolodex-input-line" type="email" placeholder="you@example.com" autoComplete="email" /></div>
    <div className="space-y-2"><Label className="rolodex-label" htmlFor="demo-input-box">Contact form / boxed</Label><Input id="demo-input-box" className="rolodex-input" placeholder="A connection worth keeping" /></div>
    <div className="space-y-2"><Label htmlFor="demo-input-password">Password</Label><Input id="demo-input-password" type="password" placeholder="At least 6 characters" minLength={6} autoComplete="new-password" /></div>
    <div className="space-y-2"><Label htmlFor="demo-input-file">Native file input</Label><Input id="demo-input-file" type="file" /></div>
    <div className="space-y-2"><Label htmlFor="demo-input-readonly">Read-only</Label><Input id="demo-input-readonly" defaultValue="Known city" readOnly /></div>
    <div className="space-y-2"><Label htmlFor="demo-input-disabled">Disabled</Label><Input id="demo-input-disabled" placeholder="Disabled" disabled /></div>
    <div className="space-y-2"><Label htmlFor="demo-input-invalid">Invalid / native accessibility props</Label><Input id="demo-input-invalid" aria-invalid="true" aria-describedby="demo-input-error" defaultValue="not-an-email" type="email" /><p id="demo-input-error" className="text-xs text-destructive">Enter a valid email address.</p></div>
  </div>;
}