import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
export default function LabelDemo() {
  return <div className="max-w-xl space-y-6 rounded-lg border bg-card p-6">
    <div className="space-y-2"><Label htmlFor="label-standard">Source primitive label</Label><Input id="label-standard" placeholder="Click the label to focus this field" /></div>
    <div className="space-y-2"><Label className="rolodex-label" htmlFor="label-product">Known city / product caption</Label><Input id="label-product" className="rolodex-input" placeholder="City, country" /></div>
    <div className="space-y-2"><Input id="label-disabled" className="peer" disabled placeholder="Disabled field" /><Label htmlFor="label-disabled">Disabled peer styling from source</Label></div>
    <p className="text-sm text-muted-foreground">Radix Label behavior and htmlFor association are retained. Uppercase and .18em tracking come from the source field pattern, not a new Label variant prop.</p>
  </div>;
}