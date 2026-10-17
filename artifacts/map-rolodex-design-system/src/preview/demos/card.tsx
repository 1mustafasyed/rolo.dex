import { Card,CardHeader,CardTitle,CardDescription,CardContent,CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
export default function CardDemo() {
  return <div className="grid gap-6 lg:grid-cols-2">
    <Card><CardHeader><CardTitle role="heading" aria-level={2}>Source Card family</CardTitle><CardDescription>All six source exports, without app-specific data or behavior.</CardDescription></CardHeader><CardContent><p className="text-sm">Card content inherits the theme’s card and foreground roles.</p></CardContent><CardFooter><Button size="sm">Primary action</Button></CardFooter></Card>
    <Card className="rolodex-panel"><CardHeader><CardTitle className="font-serif text-3xl font-normal" role="heading" aria-level={2}>Editorial panel treatment</CardTitle><CardDescription>Source-native 3px panel corners and shadow, composed through className.</CardDescription></CardHeader><CardContent><p className="text-sm leading-relaxed">A quiet place to remember the story behind the connection.</p></CardContent><CardFooter><Button variant="outline">Secondary action</Button></CardFooter></Card>
    <Card><CardContent className="pt-6"><p className="text-sm">Content-only composition; headers and footers are optional.</p></CardContent></Card>
    <p className="text-xs leading-relaxed text-muted-foreground">CardTitle is a div in the source API. These stories explicitly add heading semantics rather than silently changing the component’s DOM.</p>
  </div>;
}