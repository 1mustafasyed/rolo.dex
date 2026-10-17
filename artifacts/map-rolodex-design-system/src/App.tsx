import { useEffect, useState } from 'react';
import { DesignSystemBrowser } from './preview/DesignSystemBrowser';
import { Button } from './components/ui/button';

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('rolodex-ds-theme') !== 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('rolodex-ds-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <>
    <div className="border-b bg-card px-4 py-3 text-right">
      <Button variant="outline" size="sm" aria-pressed={dark} onClick={() => setDark(!dark)}>
        {dark ? 'Dark · source theme' : 'Light · derived theme'} / Switch
      </Button>
    </div>
    <DesignSystemBrowser />
  </>;
}

export default App;
