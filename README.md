# Portão — Controle de acesso para prédios comerciais
- Site para visualizar https://visitor-vite.lovable.app

> Caso de discovery UX + protótipo funcional de uma solução para a dor
> **"prédios comerciais com dificuldade de gerenciar o acesso de pessoas
> aos locais físicos"**.

O brief original era vago de propósito. Em vez de saltar direto para
catracas, biometria ou um app genérico de visitantes, este projeto faz o
caminho que um UX faria: investiga o contexto, formula hipóteses,
publica um protótipo testável e coleta feedback de campo.

---

## 🎯 O problema

Alguns prédios comerciais relatam dificuldade em gerenciar o acesso de
pessoas — mas não detalham *o quê*. A investigação inicial aponta para
**a fila e a lentidão na portaria** como sintoma mais visível, com 4
hipóteses por trás:

| Código | Hipótese | Sinal |
|--------|----------|-------|
| H-01 | Cadastro manual lento na chegada | alto |
| H-02 | Morador não pré-avisa a visita | alto |
| H-03 | Visitas, entregas e prestadores competem pelo mesmo balcão | médio |
| H-04 | Falta de histórico auditável | médio |

---

## 🧭 O que tem no app

Três superfícies, cada uma com um propósito:

### `/` — Diagnóstico
Landing de discovery: briefing, métricas de campo, hipóteses
priorizadas e a proposta de solução.

### `/pesquisa`
Formulário de 7 perguntas para síndicos, recepcionistas e moradores
contribuírem com dores reais. Respostas persistidas em `localStorage`
(v0.1, antes do backend).

### `/portaria`
Protótipo funcional do painel de portaria em tempo real:
- **KPIs ao vivo**: fila atual, pré-autorizados, dentro do prédio,
  tempo médio de espera.
- **Busca universal** (QR / nome / CPF / empresa) com foco automático.
- **Fila ativa** com cronômetro por visitante e destaque visual quando
  passa de 2 minutos.
- **Liberação em 1 clique** ou negação de acesso.
- **Fluxo express** (4 campos) para visitante sem pré-cadastro.
- **Lista de quem está dentro** com registro de saída.

---

## 🧱 Stack

- **TanStack Start v1** (React 19 + Vite 7) com roteamento file-based.
- **Tailwind CSS v4** via `src/styles.css` com design tokens em `oklch`.
- **TypeScript estrito**.
- Estado local com React (sem backend ainda — próxima etapa).

Estética industrial/segurança: preto profundo + laranja sinalização,
tipografia `Space Grotesk` (display) + `Inter` (corpo) + `JetBrains Mono`
(metadados), grids sutis e listras de alerta inspiradas em ambiente
operacional.

---

## 🚀 Rodando localmente

```bash
bun install
bun run dev
```

App em `http://localhost:8080`.

### Scripts

| Comando | O que faz |
|---------|-----------|
| `bun run dev` | Servidor de desenvolvimento |
| `bun run build` | Build de produção |
| `bun run preview` | Preview do build |

---

## 📁 Estrutura

```
src/
├── routes/
│   ├── __root.tsx       # Layout raiz (head, fontes, providers)
│   ├── index.tsx        # / — landing de diagnóstico
│   ├── pesquisa.tsx     # /pesquisa — coleta de respostas
│   └── portaria.tsx     # /portaria — painel ao vivo
├── components/
│   ├── SiteNav.tsx      # Navegação global
│   └── ui/              # Componentes shadcn
├── styles.css           # Design system (tokens oklch + utilitários)
└── router.tsx           # Configuração do TanStack Router
```

---

## 🛣️ Próximos passos

A v0.1 é cliente-only. Para virar produto operável:

- [ ] **Backend real** (Lovable Cloud): banco + autenticação + tempo real.
- [ ] **Multi-perfil**: morador autoriza pelo celular, portaria valida.
- [ ] **QR code de verdade** gerado por visita e leitor via câmera.
- [ ] **Notificação de chegada** para o morador (push / WhatsApp).
- [ ] **Histórico auditável** com filtros e exportação.
- [ ] **Múltiplos prédios** com isolamento por organização.

---

## 📜 Licença

Projeto de discovery — uso interno.
