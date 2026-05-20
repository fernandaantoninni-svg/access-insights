import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Apple,
  Recycle,
  Wine,
  Trash2,
  Newspaper,
  PackageOpen,
  CalendarOff,
  AlertTriangle,
  Bell,
  Check,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: PulitaApp,
  head: () => ({
    meta: [
      { title: "PULITA — Calendário da recolha de lixo" },
      {
        name: "description",
        content:
          "PULITA: saiba todos os dias que tipo de lixo colocar fora. Lembretes, cores por dia e aviso de multa por separação errada.",
      },
    ],
  }),
});

type DayKey = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

type Fraction = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type DayInfo = {
  key: DayKey;
  short: string;
  long: string;
  fractions: Fraction[];
  color: string; // hex
  ink: "light" | "dark";
  note?: string;
};

const ORGANICO: Fraction = { label: "Orgânico", icon: Apple };
const PLASTICO_METAL: Fraction = { label: "Plástico / Metal", icon: Recycle };
const VIDRO: Fraction = { label: "Vidro", icon: Wine };
const INDIFERENCIADO: Fraction = { label: "Indiferenciado", icon: Trash2 };
const PAPEL: Fraction = { label: "Papel / Cartão", icon: Newspaper };
const PLASTICO: Fraction = { label: "Plástico", icon: PackageOpen };

const SCHEDULE: DayInfo[] = [
  { key: "seg", short: "SEG", long: "Segunda-feira", fractions: [ORGANICO], color: "#2F9E5E", ink: "light" },
  { key: "ter", short: "TER", long: "Terça-feira", fractions: [PLASTICO_METAL], color: "#F2C24B", ink: "dark" },
  { key: "qua", short: "QUA", long: "Quarta-feira", fractions: [VIDRO, ORGANICO], color: "#2E7BD6", ink: "light" },
  { key: "qui", short: "QUI", long: "Quinta-feira", fractions: [INDIFERENCIADO], color: "#5C5C5C", ink: "light" },
  { key: "sex", short: "SEX", long: "Sexta-feira", fractions: [PAPEL, ORGANICO], color: "#3FB0C9", ink: "light" },
  { key: "sab", short: "SÁB", long: "Sábado", fractions: [PLASTICO], color: "#E8843C", ink: "light" },
  { key: "dom", short: "DOM", long: "Domingo", fractions: [], color: "#1E1E1E", ink: "light", note: "Não passa o camião" },
];

// JS Date.getDay(): 0=Sunday … 6=Saturday → map to our array order (seg..dom)
function todayIndex(): number {
  const d = new Date().getDay();
  // Sun=0 → 6; Mon=1 → 0; … Sat=6 → 5
  return d === 0 ? 6 : d - 1;
}

function PulitaApp() {
  const [now, setNow] = useState(() => new Date());
  const [reminder, setReminder] = useState<boolean>(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    try {
      setReminder(localStorage.getItem("pulita.reminder") === "1");
    } catch {}
    return () => clearInterval(t);
  }, []);

  const idx = useMemo(() => todayIndex(), [now]);
  const today = SCHEDULE[idx];
  const tomorrow = SCHEDULE[(idx + 1) % 7];

  const toggleReminder = () => {
    const next = !reminder;
    setReminder(next);
    try {
      localStorage.setItem("pulita.reminder", next ? "1" : "0");
    } catch {}
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0F1411" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0F1411]/90 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "#2F9E5E" }}
              aria-hidden
            >
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-none text-white">PULITA</h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                lixo certo, dia certo
              </p>
            </div>
          </div>
          <button
            onClick={toggleReminder}
            aria-label={reminder ? "Desativar lembrete" : "Ativar lembrete"}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
              reminder
                ? "border-[#2F9E5E] bg-[#2F9E5E]/15 text-[#7BD8A4]"
                : "border-white/10 bg-white/5 text-white/70"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            {reminder ? "Ativo" : "Lembrar"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pt-6">
        {/* HOJE */}
        <section aria-labelledby="hoje">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="hoje" className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              Hoje · {today.long}
            </h2>
            <span className="font-mono text-[11px] text-white/40">
              {now.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}
            </span>
          </div>

          <article
            className="relative overflow-hidden rounded-3xl p-6 shadow-2xl"
            style={{
              background: `linear-gradient(160deg, ${today.color} 0%, color-mix(in oklab, ${today.color} 70%, black) 100%)`,
              color: today.ink === "light" ? "white" : "#111",
            }}
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20" style={{ background: "white" }} />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {today.fractions.length > 0 ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Coloque hoje
                  </>
                ) : (
                  <>
                    <CalendarOff className="h-3.5 w-3.5" /> Sem recolha
                  </>
                )}
              </div>

              {today.fractions.length === 0 ? (
                <div>
                  <h3 className="font-display text-3xl font-bold leading-tight">
                    Hoje o camião não passa.
                  </h3>
                  <p className="mt-2 text-sm opacity-90">
                    Guarde o lixo em casa até ao próximo dia de recolha.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="font-display text-3xl font-bold leading-tight">
                    {today.fractions.map((f) => f.label).join(" + ")}
                  </h3>
                  <p className="mt-2 text-sm opacity-90">Saco fora até às 22:00.</p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {today.fractions.map((f) => {
                      const Icon = f.icon;
                      return (
                        <div
                          key={f.label}
                          className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2.5 text-sm font-semibold backdrop-blur"
                        >
                          <Icon className="h-4 w-4" />
                          {f.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Amanhã */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-[11px] font-bold"
              style={{
                background: tomorrow.color,
                color: tomorrow.ink === "light" ? "white" : "#111",
              }}
            >
              {tomorrow.short}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-white/40">Amanhã</p>
              <p className="truncate text-sm font-medium text-white">
                {tomorrow.fractions.length === 0
                  ? "Não passa o camião"
                  : tomorrow.fractions.map((f) => f.label).join(" + ")}
              </p>
            </div>
          </div>
        </section>

        {/* SEMANA */}
        <section className="mt-8" aria-labelledby="semana">
          <h2 id="semana" className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            Calendário semanal
          </h2>
          <ul className="space-y-2">
            {SCHEDULE.map((d, i) => {
              const isToday = i === idx;
              return (
                <li
                  key={d.key}
                  className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                    isToday
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl font-mono text-[10px] font-bold leading-none"
                    style={{
                      background: d.color,
                      color: d.ink === "light" ? "white" : "#111",
                    }}
                  >
                    <span className="text-[10px] opacity-80">{d.short}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      {d.long}
                      {isToday && (
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/80">
                          hoje
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-white/60">
                      {d.fractions.length === 0
                        ? d.note ?? "—"
                        : d.fractions.map((f) => f.label).join(" · ")}
                    </p>
                  </div>
                  {d.fractions.length === 0 ? (
                    <CalendarOff className="h-4 w-4 text-white/30" />
                  ) : (
                    <Check className="h-4 w-4 text-white/30" />
                  )}
                </li>
              );
            })}
          </ul>

          <p className="mt-3 flex items-start gap-2 rounded-xl bg-white/[0.03] p-3 text-[11px] leading-relaxed text-white/50">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Aos domingos e feriados o camião do lixo não faz recolha.
          </p>
        </section>

        {/* MULTA */}
        <section className="mt-8" aria-labelledby="multa">
          <h2 id="multa" className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            Atenção
          </h2>
          <article
            className="overflow-hidden rounded-2xl border p-5"
            style={{
              borderColor: "rgba(232, 132, 60, 0.4)",
              background:
                "linear-gradient(160deg, rgba(232,132,60,0.18), rgba(232,132,60,0.04))",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8843C] text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Lixo errado = multa
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  Colocar o tipo de resíduo errado no dia errado, ou fora do horário, pode
                  resultar numa <strong className="text-white">coima</strong> aplicada
                  pela fiscalização municipal.
                </p>

                <div className="mt-4 space-y-2">
                  <Rule>Verifique a cor do dia antes de descer com o saco.</Rule>
                  <Rule>Separe orgânico, plástico, vidro e papel em sacos diferentes.</Rule>
                  <Rule>Coloque o lixo entre as 20:00 e as 22:00.</Rule>
                </div>
              </div>
            </div>
          </article>
        </section>

        <footer className="mt-10 pb-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            PULITA · cidade limpa começa em casa
          </p>
        </footer>
      </main>
    </div>
  );
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs text-white/80">
      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#E8843C]" />
      <span>{children}</span>
    </div>
  );
}
