import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/pesquisa")({
  component: Pesquisa,
  head: () => ({ meta: [{ title: "Pesquisa · Portão" }, { name: "description", content: "Ajude a mapear o que dificulta o controle de acesso no seu prédio comercial." }] }),
});

const questions = [
  { id: "role", label: "Seu papel no prédio", type: "choice", options: ["Síndico / administração", "Recepcionista / portaria", "Morador / locatário", "Segurança", "Outro"] },
  { id: "size", label: "Quantas empresas/andares o prédio atende?", type: "choice", options: ["até 10", "11 a 30", "31 a 60", "60+"] },
  { id: "peak", label: "Quantos visitantes por dia em pico?", type: "choice", options: ["até 20", "21 a 80", "81 a 200", "200+"] },
  { id: "pain", label: "Qual é a maior dor hoje?", type: "choice", options: ["Fila demorada", "Não saber quem está no prédio", "Visitas não avisadas", "Confusão entre visitas, entregas e prestadores", "Falta de histórico para auditar"] },
  { id: "tool", label: "Como gerenciam acesso atualmente?", type: "choice", options: ["Caderno em papel", "Planilha", "Sistema próprio antigo", "Software de portaria", "Nenhum"] },
  { id: "story", label: "Conte um incidente recente que escancarou o problema", type: "text" },
  { id: "contact", label: "E-mail para retornarmos (opcional)", type: "text", placeholder: "voce@predio.com" },
];

function Pesquisa() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const all = JSON.parse(localStorage.getItem("portao:research") ?? "[]");
      all.push({ ...answers, ts: new Date().toISOString() });
      localStorage.setItem("portao:research", JSON.stringify(all));
    } catch {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">resposta registrada</div>
          <h1 className="mt-4 font-display text-4xl font-semibold">Obrigado.</h1>
          <p className="mt-4 text-muted-foreground">
            Sua resposta entra no caderno de campo e ajuda a calibrar as próximas entrevistas.
            Se deixou e-mail, voltamos antes da próxima rodada de testes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">caderno de campo</div>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">Pesquisa de portaria</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          7 perguntas. ~2 minutos. As respostas alimentam o próximo ciclo do protótipo e nunca
          são compartilhadas com terceiros.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-10">
          {questions.map((q, idx) => (
            <div key={q.id} className="panel p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-primary">{String(idx + 1).padStart(2, "0")}</span>
                <label className="font-display text-lg font-semibold">{q.label}</label>
              </div>

              {q.type === "choice" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {q.options!.map((opt) => {
                    const active = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        className={`border px-3 py-2 text-sm transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/60"}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  rows={q.id === "story" ? 4 : 1}
                  placeholder={q.placeholder}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  className="mt-4 w-full resize-none border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-primary px-6 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            Enviar resposta →
          </button>
        </form>
      </div>
    </div>
  );
}
