import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/portaria")({
  component: Portaria,
  head: () => ({ meta: [{ title: "Portaria ao vivo · Portão" }, { name: "description", content: "Painel de portaria em tempo real: pré-cadastros, fila, check-in e log." }] }),
});

type Status = "preauth" | "waiting" | "inside" | "denied";
type Visitor = {
  id: string;
  name: string;
  doc: string;
  company: string;
  destination: string;
  authorizedBy: string;
  status: Status;
  arrivedAt?: number;
  enteredAt?: number;
  qr: string;
};

const seed: Visitor[] = [
  { id: "v1", name: "Mariana Souza", doc: "382.110.***-22", company: "Visita comercial", destination: "Onyx Capital · 14º", authorizedBy: "Carla Mendes", status: "preauth", qr: "PRT-8821" },
  { id: "v2", name: "Diego Albuquerque", doc: "—", company: "Correios", destination: "Administração", authorizedBy: "Sistema", status: "waiting", arrivedAt: Date.now() - 78_000, qr: "PRT-8822" },
  { id: "v3", name: "Patrícia Lima", doc: "551.882.***-09", company: "JLL", destination: "JLL · 09º", authorizedBy: "Rodrigo Tanaka", status: "waiting", arrivedAt: Date.now() - 175_000, qr: "PRT-8823" },
  { id: "v4", name: "André Castilho", doc: "112.443.***-71", company: "Endeavor", destination: "Onyx Capital · 14º", authorizedBy: "Carla Mendes", status: "inside", arrivedAt: Date.now() - 600_000, enteredAt: Date.now() - 540_000, qr: "PRT-8810" },
  { id: "v5", name: "Lúcia Hernandez", doc: "229.001.***-44", company: "Auditoria PwC", destination: "Hexa Tech · 22º", authorizedBy: "Marina Brito", status: "preauth", qr: "PRT-8824" },
];

function fmtClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function Portaria() {
  const [visitors, setVisitors] = useState<Visitor[]>(seed);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(Date.now());
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const waiting = visitors.filter((v) => v.status === "waiting");
  const preauth = visitors.filter((v) => v.status === "preauth");
  const inside = visitors.filter((v) => v.status === "inside");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visitors;
    return visitors.filter((v) =>
      [v.name, v.company, v.destination, v.qr, v.doc].some((f) => f.toLowerCase().includes(q))
    );
  }, [visitors, query]);

  const release = (id: string) =>
    setVisitors((vs) => vs.map((v) => (v.id === id ? { ...v, status: "inside", enteredAt: Date.now(), arrivedAt: v.arrivedAt ?? Date.now() } : v)));
  const arrive = (id: string) =>
    setVisitors((vs) => vs.map((v) => (v.id === id ? { ...v, status: "waiting", arrivedAt: Date.now() } : v)));
  const deny = (id: string) =>
    setVisitors((vs) => vs.map((v) => (v.id === id ? { ...v, status: "denied" } : v)));
  const exit = (id: string) =>
    setVisitors((vs) => vs.filter((v) => v.id !== id));

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">protótipo · portaria ao vivo</div>
            <h1 className="mt-2 font-display text-4xl font-semibold">Edifício Sereno · Térreo</h1>
            <div className="mt-2 font-mono text-xs text-muted-foreground">
              Op. <span className="text-foreground">Carla M.</span> · turno 06:00–14:00 ·{" "}
              <span className="pulse-dot">sistema ativo</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(true)} className="border border-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">
              + Sem cadastro
            </button>
            <Link to="/" className="border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest hover:border-primary hover:text-primary">
              ← Voltar
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid gap-px bg-border md:grid-cols-4">
          {[
            { l: "Na fila", v: waiting.length, c: waiting.length > 2 ? "text-warning" : "text-foreground" },
            { l: "Pré-autorizados", v: preauth.length, c: "text-primary" },
            { l: "Dentro do prédio", v: inside.length, c: "text-foreground" },
            { l: "Tempo médio espera", v: waiting.length ? fmtClock(waiting.reduce((a, v) => a + (now - (v.arrivedAt ?? now)), 0) / waiting.length) : "—", c: "text-foreground" },
          ].map((k) => (
            <div key={k.l} className="bg-background p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</div>
              <div className={`mt-2 font-display text-3xl font-bold ${k.c}`}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="mt-6 panel flex items-center gap-3 px-4 py-3">
          <span className="font-mono text-xs text-primary">QR ⌁</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bipar QR, digitar nome, CPF ou empresa…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">enter</kbd>
        </div>

        {/* MAIN GRID */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* FILA */}
          <section className="lg:col-span-7">
            <SectionTitle label="Fila ativa" count={waiting.length} accent="warning" />
            <div className="mt-3 space-y-3">
              {waiting.length === 0 && <EmptyState text="Nenhuma pessoa esperando. Fila zerada." />}
              {waiting.map((v) => (
                <VisitorRow key={v.id} v={v} elapsed={now - (v.arrivedAt ?? now)} primary={{ label: "Liberar entrada", onClick: () => release(v.id) }} secondary={{ label: "Negar", onClick: () => deny(v.id) }} />
              ))}
            </div>

            <div className="mt-10" />
            <SectionTitle label="Pré-autorizados (esperando chegada)" count={preauth.length} accent="primary" />
            <div className="mt-3 space-y-3">
              {filtered.filter((v) => v.status === "preauth").map((v) => (
                <VisitorRow key={v.id} v={v} primary={{ label: "Registrar chegada", onClick: () => arrive(v.id) }} ghost />
              ))}
            </div>
          </section>

          {/* DENTRO + LOG */}
          <aside className="lg:col-span-5 space-y-8">
            <div>
              <SectionTitle label="Dentro do prédio" count={inside.length} accent="default" />
              <div className="mt-3 space-y-2">
                {inside.map((v) => (
                  <div key={v.id} className="panel flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {v.destination} · entrou {fmtClock(now - (v.enteredAt ?? now))} atrás
                      </div>
                    </div>
                    <button onClick={() => exit(v.id)} className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary">
                      Saída
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle label="Como funciona o pré-cadastro" />
              <div className="mt-3 panel p-5">
                <ol className="space-y-3 text-sm">
                  {[
                    "Morador autoriza visita no app em ~20s",
                    "Visitante recebe QR por WhatsApp",
                    "Aproxima QR do leitor — libera em 4s",
                    "Sem QR? Fluxo express de 4 campos",
                  ].map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-xs text-primary">0{i + 1}</span>
                      <span className="text-muted-foreground">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showAdd && <QuickAddModal onClose={() => setShowAdd(false)} onAdd={(v) => { setVisitors((vs) => [v, ...vs]); setShowAdd(false); }} />}
    </div>
  );
}

function SectionTitle({ label, count, accent = "default" }: { label: string; count?: number; accent?: "default" | "primary" | "warning" }) {
  const color = accent === "primary" ? "text-primary" : accent === "warning" ? "text-warning" : "text-muted-foreground";
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      {typeof count === "number" && <div className={`font-mono text-sm ${color}`}>{String(count).padStart(2, "0")}</div>}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="panel px-4 py-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">{text}</div>;
}

function VisitorRow({
  v, elapsed, primary, secondary, ghost,
}: {
  v: Visitor; elapsed?: number;
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  ghost?: boolean;
}) {
  const overdue = typeof elapsed === "number" && elapsed > 120_000;
  return (
    <div className={`panel flex flex-wrap items-center gap-4 p-4 ${overdue ? "border-warning/60" : ""}`}>
      <div className="flex h-12 w-12 items-center justify-center bg-background font-display text-lg font-semibold text-primary">
        {v.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate font-medium">{v.name}</div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{v.qr}</span>
        </div>
        <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {v.company} · → {v.destination}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">Autorizado por <span className="text-foreground">{v.authorizedBy}</span> · doc {v.doc}</div>
      </div>
      {typeof elapsed === "number" && (
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">esperando</div>
          <div className={`font-mono text-xl ${overdue ? "text-warning" : "text-foreground"}`}>{fmtClock(elapsed)}</div>
        </div>
      )}
      <div className="flex gap-2">
        {secondary && (
          <button onClick={secondary.onClick} className="border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-destructive hover:text-destructive">
            {secondary.label}
          </button>
        )}
        <button
          onClick={primary.onClick}
          className={`px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest ${ghost ? "border border-primary text-primary hover:bg-primary hover:text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
        >
          {primary.label} →
        </button>
      </div>
    </div>
  );
}

function QuickAddModal({ onClose, onAdd }: { onClose: () => void; onAdd: (v: Visitor) => void }) {
  const [form, setForm] = useState({ name: "", doc: "", destination: "", authorizedBy: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.destination) return;
    onAdd({
      id: crypto.randomUUID(),
      name: form.name,
      doc: form.doc || "—",
      company: "Visita avulsa",
      destination: form.destination,
      authorizedBy: form.authorizedBy || "Portaria",
      status: "waiting",
      arrivedAt: Date.now(),
      qr: `PRT-${Math.floor(Math.random() * 9000 + 1000)}`,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="panel w-full max-w-md p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">fluxo express · 4 campos</div>
        <h2 className="mt-2 font-display text-2xl font-semibold">Visitante sem cadastro</h2>
        <div className="mt-5 space-y-3">
          {[
            { k: "name", l: "Nome completo" },
            { k: "doc", l: "Documento (opcional)" },
            { k: "destination", l: "Destino · empresa/andar" },
            { k: "authorizedBy", l: "Quem autoriza (ramal/nome)" },
          ].map((f) => (
            <div key={f.k}>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{f.l}</label>
              <input
                value={(form as Record<string, string>)[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                className="mt-1 w-full border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-foreground">Cancelar</button>
          <button type="submit" className="bg-primary px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">Adicionar à fila →</button>
        </div>
      </form>
    </div>
  );
}
