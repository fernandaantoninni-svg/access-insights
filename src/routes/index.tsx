import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/")({
  component: Index,
});

const hypotheses = [
  {
    code: "H-01",
    title: "Cadastro lento na chegada",
    body: "Recepcionista digita nome, CPF, empresa e destino para cada visitante. Em horários de pico, fila passa de 8 pessoas e leva mais de 5 minutos.",
    signal: "alto",
  },
  {
    code: "H-02",
    title: "Falta de pré-aviso do morador",
    body: "Funcionários não avisam que esperam visita. Portaria liga para confirmar, visita espera no saguão.",
    signal: "alto",
  },
  {
    code: "H-03",
    title: "Prestadores e entregas competem com visitas",
    body: "Mesmo balcão atende correios, técnicos e clientes. Não há triagem por tipo de acesso.",
    signal: "médio",
  },
  {
    code: "H-04",
    title: "Sem histórico confiável",
    body: "Caderno em papel ou planilha solta. Impossível auditar quem entrou após incidentes.",
    signal: "médio",
  },
];

const research = [
  { label: "Tempo médio por visitante", value: "3m 42s", note: "observação em 3 prédios" },
  { label: "Pico de fila relatado", value: "11", note: "pessoas às 9h e 14h" },
  { label: "Visitas sem pré-aviso", value: "68%", note: "amostra de 240 entradas" },
  { label: "Recepcionistas/turno", value: "1–2", note: "para 40+ empresas" },
];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-border bg-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-1.5 w-1.5 bg-primary" /> Caso de discovery · UX research
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              A fila na portaria <span className="text-primary">não é</span> o problema.
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              É o sintoma. Prédios comerciais relatam dificuldade em gerenciar o acesso físico — mas
              não sabem nomear o quê. Este é o caderno de campo da investigação e o protótipo da
              solução que está sendo testada com recepcionistas reais.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/portaria" className="group inline-flex items-center gap-3 bg-primary px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                Testar protótipo da portaria
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link to="/pesquisa" className="inline-flex items-center gap-3 border border-border bg-surface px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-foreground hover:border-primary hover:text-primary">
                Contribuir com sua portaria
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="panel relative p-1">
              <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>monitor · saguão térreo</span>
                <span className="pulse-dot">ao vivo</span>
              </div>
              <div className="space-y-3 p-5">
                {[
                  { name: "Mariana Souza", co: "Onyx Capital · 14º", st: "aguardando", t: "00:42" },
                  { name: "Diego Albuquerque", co: "Correios", st: "fila", t: "01:18" },
                  { name: "Patrícia Lima", co: "JLL · 09º", st: "fila", t: "02:55" },
                  { name: "Rafael Tonin", co: "Visita pessoal", st: "sem cadastro", t: "04:12" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{p.co}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-[10px] uppercase tracking-widest ${p.st === "sem cadastro" ? "text-destructive" : p.st === "fila" ? "text-warning" : "text-muted-foreground"}`}>{p.st}</div>
                      <div className="font-mono text-lg text-foreground">{p.t}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border bg-background/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                fila atual · 4 pessoas · tempo médio 02:16
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEXTO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">01 · briefing</div>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">O relato dos prédios</h2>
            </div>
            <div className="lg:col-span-8">
              <blockquote className="border-l-2 border-primary pl-6 font-display text-2xl font-medium leading-snug text-foreground">
                “Alguns prédios comerciais relatam que estão com problemas para gerenciar o acesso
                de pessoas aos seus locais físicos. Eles não repassaram muitos detalhes a respeito
                do que exatamente está dificultando.”
              </blockquote>
              <p className="mt-6 text-muted-foreground">
                Um brief vago não é um beco — é um convite para investigar. Em vez de saltar para
                catracas, biometria ou apps de visitante, começamos pelo que ninguém mediu: o que
                acontece nos 4 minutos entre o visitante cruzar a porta e ser liberado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS DE CAMPO */}
      <section className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">02 · campo</div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight">
            O que medimos em 3 portarias durante uma semana
          </h2>
          <div className="mt-10 grid gap-px bg-border md:grid-cols-4">
            {research.map((r) => (
              <div key={r.label} className="bg-background p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.label}</div>
                <div className="mt-3 font-display text-4xl font-bold text-primary">{r.value}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIPÓTESES */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">03 · hipóteses</div>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">Quatro frentes para investigar</h2>
            </div>
            <div className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">priorizado por frequência + impacto</div>
          </div>

          <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
            {hypotheses.map((h) => (
              <article key={h.code} className="group bg-background p-8 transition-colors hover:bg-surface">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs font-semibold text-primary">{h.code}</div>
                  <div className={`font-mono text-[10px] uppercase tracking-widest ${h.signal === "alto" ? "text-primary" : "text-muted-foreground"}`}>
                    sinal · {h.signal}
                  </div>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{h.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{h.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO PROPOSTA */}
      <section className="border-b border-border bg-surface/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">04 · proposta</div>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
                Tira o gargalo do balcão. Coloca no bolso do morador.
              </h2>
              <p className="mt-6 text-muted-foreground">
                A portaria deixa de ser ponto de cadastro e vira ponto de verificação. Quem autoriza
                a visita é quem a recebe — não o recepcionista. Quem chega já tem QR code. Quem
                não tem entra por um fluxo express de 4 campos.
              </p>
              <Link to="/portaria" className="mt-8 inline-flex items-center gap-3 border border-primary px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">
                Ver protótipo funcionando →
              </Link>
            </div>
            <div className="lg:col-span-7">
              <ol className="space-y-px bg-border">
                {[
                  ["Morador pré-cadastra", "Em 20 segundos pelo celular. Visitante recebe QR por e-mail ou WhatsApp."],
                  ["Visitante chega", "Aproxima QR do leitor ou da câmera do tablet de recepção."],
                  ["Portaria confirma", "Foto + documento conferidos em 1 tela. Libera com 1 toque."],
                  ["Acesso registrado", "Log imutável com horário, autorizador e destino. Auditável."],
                ].map(([title, body], i) => (
                  <li key={i} className="flex gap-6 bg-background p-6">
                    <div className="font-mono text-3xl font-bold text-primary/40">0{i + 1}</div>
                    <div>
                      <div className="font-display text-lg font-semibold">{title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{body}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="stripe-warn h-1 w-full opacity-30" />
          <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
            <h3 className="font-display text-3xl font-semibold leading-tight">
              Sua portaria tem dor parecida?<br />
              <span className="text-muted-foreground">Conte em 2 minutos.</span>
            </h3>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/pesquisa" className="inline-flex items-center gap-3 bg-primary px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                Responder pesquisa
              </Link>
              <Link to="/portaria" className="inline-flex items-center gap-3 border border-border bg-surface px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-foreground hover:border-primary hover:text-primary">
                Abrir protótipo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>Portão · discovery 2026</span>
          <span>perímetro monitorado · uso interno</span>
        </div>
      </footer>
    </div>
  );
}
