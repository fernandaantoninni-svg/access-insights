import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center bg-primary text-primary-foreground">
            <span className="font-display text-sm font-bold">P</span>
          </div>
          <span className="font-display text-base font-semibold tracking-tight">PORTÃO</span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">v0.1 · discovery</span>
        </Link>
        <nav className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider">
          <Link to="/" activeOptions={{ exact: true }} className="px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }}>Diagnóstico</Link>
          <Link to="/pesquisa" className="px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }}>Pesquisa</Link>
          <Link to="/portaria" className="ml-2 inline-flex items-center gap-2 bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" /> Abrir portaria
          </Link>
        </nav>
      </div>
    </header>
  );
}
