import { Separator } from '../../components/ui/separator';
export default function SeparatorDemo() {
  return <div className="max-w-xl space-y-6 rounded-lg border bg-card p-6">
    <section><h2 className="font-serif text-2xl">Horizontal / decorative default</h2><Separator className="my-4" /><p className="text-sm text-muted-foreground">A visual one-pixel rule; hidden from the accessibility tree.</p></section>
    <section><h2 className="font-serif text-2xl">Horizontal / semantic</h2><Separator decorative={false} className="my-4" /><p className="text-sm text-muted-foreground">Radix supplies separator semantics when decorative is false.</p></section>
    <section><h2 className="mb-4 font-serif text-2xl">Vertical / bounded height</h2><div className="flex h-6 items-center gap-4 text-sm"><span>People</span><Separator orientation="vertical" /><span>Places</span><Separator orientation="vertical" decorative={false} /><span>Stories</span></div></section>
  </div>;
}