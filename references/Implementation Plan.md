# A serviço do museu — website implementation plan

## Context

This repo will hold the public-facing digest site for Nicoly and Letícia's TCC
("A serviço do museu: diretrizes de experiência para a instituição
museo-educativa", UEMG, orientação de Simone Souza). The site has two jobs,
stated directly in the pitch doc: (1) make a 30-page/7000-word academic
pre-project readable by a layperson, and (2) function as a credibility
artifact to recruit Belo Horizonte museum workers as research participants
and contacts. Everything about the reading experience — sidenotes, glossary,
document viewer, data visualizations, the museum/exhibition visual metaphor —
serves those two goals.

Three source documents drive this:
- `references/(Pitch) Museum Design, explained.pdf` — the mechanics spec:
  how footnotes/sidenotes behave, glossary behavior, image treatment rules,
  document-viewer carousel, Venn diagram, outreach graphic, tech stack.
- `references/Conteúdo do Museu Explicado.pdf` — the actual PT-BR digest copy
  to ship, already drafted section-by-section, but with unresolved
  placeholders (see Gaps below).
- `references/TCC Museus.pdf` — the source academic pre-project. This is
  where the real numbers, the four figures (Duplo Diamante+espiral, 3 níveis
  de planejamento, princípios de Tufte, cronograma), and the IBRAM course
  screenshots (Anexos A/B/C) that the digest's placeholders point at all
  live.

The user explicitly does not want aesthetic (font/color) decisions made for
them yet — this plan builds structure, content, and interaction correctly
with a neutral/placeholder visual system, swappable later. Work proceeds in
bites; this plan sequences those bites, it doesn't build all of them now.

Per the user's answer, the bilingual (PT/EN) scaffold goes in from bite one,
with `next-intl` routing and a language switcher live even though English
copy will be rough/placeholder until translation happens later.

## Content gaps found (need resolving to fill the digest's placeholders)

From the digest draft, cross-referenced against the TCC:

| Placeholder in digest | Resolution |
|---|---|
| `4.105 museus` no Brasil | Confirmed in TCC intro — use as-is. |
| `XXX são em Minas Gerais` | **Not in TCC.** Only Brazil (4.105) and BH (223) totals exist. Flag as an open TODO in content, don't fabricate. |
| `XXX são em Belo Horizonte` | TCC gives 223 — fill in. |
| `XX dos museus no território brasileiro tem... entrada gratuita` | TCC only gives the **BH** figure (87%), not national. Rewrite the sentence to cite BH specifically instead of inventing a national number, and flag national as TODO. |
| Educational-activity stat | TCC has both: 48,6% Brasil / 61,5% BH — usable as-is. |
| Guided visits | TCC: 68,3% em BH — usable. |
| `3000k palavras \| 7000 palavras` | Typo in source; TCC's actual abstract says the source is ~30 pages / doesn't give an exact word count beyond the pitch doc's "7000 words" claim. Use "7000 palavras" as the academic-doc figure and drop the garbled first number, or replace with an honest word count of the *digest* once it's written. |
| `= captura do pdf de plano museológico =` | Real source images exist: TCC Anexo A/B/C are screenshots of the actual SaberMuseu course material (blue IBRAM branding). Extract these as image assets instead of leaving a placeholder. |
| `= captura do pdf da política nacional de educação =` | No PNEM screenshot exists in the source PDFs — this one has no ready asset. Flag as a content TODO (needs a real screenshot/citation from the PNEM resolution, which the user has external access to). |
| `= DO ORIGINAL: esquematização dos três níveis de planejamento =` | This is TCC's **Figure 2** — rebuild as a real coded component (not a captured image), matching its estratégico/tático/operacional structure and pink/yellow/black color coding. |
| `= timeline horizontal com... trimestres =` | This is TCC's **Figure 4** (cronograma) — rebuild as a coded timeline component from the described phases (Descoberta/Ideação/Prototipação/Entrega, Jul–Dez 2026). |
| `=== Carrosel com a capa dos livros ===` | Needs actual book cover images for the 8 works in the bibliography table (Quadro 1) — asset-gathering task, flag as TODO, stub with placeholders initially. |

A visible `<TodoNote>` MDX component will mark these inline in the content so
gaps are easy to find and swap later, rather than silently inventing numbers.

## Architecture (structure/behavior, not final visual design)

- **Next.js (App Router) + TypeScript**, per the pitch's stated stack.
- **Tailwind CSS** for styling, with all colors/spacing/type as CSS variables
  in one tokens file — placeholder neutral values now, so the user's later
  font/color pass is a token swap, not a rewrite.
- **Content as MDX** under `content/{locale}/...`, compiled via
  `next-mdx-remote` (or `@next/mdx`), with a fixed set of custom MDX
  components: `Sidenote`, `GlossaryTerm`, `Figure` (with an `added` prop
  toggling the blue-tint treatment described in the pitch), `Stat`,
  `TodoNote`, `DocumentPile`.
- **next-intl** for PT-BR (primary) / EN routing and the language switcher,
  scaffolded from bite one per your answer above.
- **Sidenote/footnote simplification**: the pitch worries this needs two
  authored renderings (margin-note vs. jump-footnote). It doesn't — author
  the content once; a single `Sidenote` component renders both an inline
  marker and the note body, and CSS/JS decide presentation: floated into the
  margin column on desktop, collapsed to a tap-to-jump + fixed back-button
  footnote on mobile (via `matchMedia`, not a duplicate content path). This
  avoids the MDX authoring overhead the pitch flagged as a risk.
- **Glossary**: a single JSON/YAML data file (`content/glossary.{locale}.json`)
  of term → definition. `GlossaryTerm` opens a panel positioned at the term's
  vertical offset on desktop; a bottom sheet on mobile. A `/glossario` route
  lists everything, linked from the nav, per the pitch.
- **Outline/TOC**: a corner-anchored component driven by `IntersectionObserver`
  over section headings, replacing the removed academic "Sumário."
- **Document viewer**: a `DocumentPile` component taking an image+caption
  array, rendering a depth-stacked, cyclical carousel; the annotation column
  appears only when motion is idle, per the pitch's spec.
- **Data visualizations**: coded components (not static images) for Fig.
  2 (planning levels), Fig. 3 (Tufte principles), Fig. 4 (cronograma), built
  using the `dataviz` skill's method with its placeholder palette (swappable
  later). The Venn diagram gets its own route (`/panorama`) with its own OG
  image and a PNG-export/download action, as specced.
- **Outreach graphic**: the single static shareable stat image (223 museus,
  61,5%, 87%, 68,3%) is explicitly a *later* bite — it depends on the palette
  decision the user is reserving for themselves, and reuses whatever
  component system Bite 4 builds.
- **PDF handling**: no rendering or preview of any kind — the actual TCC PDF
  is copied into `public/` and the "baixar a versão acadêmica" button is a
  plain `<a href download>` link at top and bottom of the digest page. The
  user downloads it and reads it in their own PDF viewer, full stop.
- **Contact**: a Next.js Route Handler + Resend for the contact form,
  a later bite once core content is solid.

## Roadmap in bites

- [x] **Bite 0 — Foundation**
  Initialize Next.js + TS + Tailwind + MDX pipeline in the repo root.
  Scaffold `next-intl` with `pt-BR` (default) and `en` locales and a visible
  language switcher. Base layout, neutral design tokens file, empty digest
  route at `/`.

  Shipped on Next.js 16 (App Router, Turbopack). Note the ecosystem shift:
  `middleware.ts` is deprecated in favor of `src/proxy.ts` — next-intl's
  `createMiddleware` is exported from there under the name `proxy`. Locale
  routing uses `localePrefix: "as-needed"`, so `/` serves `pt-BR` unprefixed
  and `/en` serves English; `/pt-BR` also resolves explicitly. MDX pipeline
  verified end-to-end via `src/content/pipeline-check.mdx` imported into the
  digest page. The real TCC PDF lives at `public/academic.pdf`, linked as a
  plain download. `npm run build` and `npm run lint` both pass clean.

- [x] **Bite 1 — Reading-experience components**
  Build `Sidenote`, `GlossaryTerm` (+ glossary data + `/glossario` page), the
  scroll-synced outline widget, and `Figure` (with the blue-tint "added"
  treatment as a CSS class, color TBD). Register all in the MDX component
  map.

  `Sidenote` uses a single component with matchMedia: floats into a margin
  column via CSS (`.with-sidenotes` / `.sidenote-desktop` in `globals.css`)
  on desktop, collapses to a tap-to-jump fixed panel with a back button on
  mobile. `GlossaryTerm` reads `content/glossary.{locale}.json` and opens a
  panel positioned at the term's own offset on desktop, a bottom sheet on
  mobile. `Outline` scans `h2`/`h3` elements (ids from `rehype-slug`, wired
  into `next.config.ts` as a string plugin name — Turbopack can't accept
  plugin functions directly) inside `#digest-content` and highlights the
  active section via `IntersectionObserver`, rendered as a corner popover.
  Content lives at `src/content/{locale}/index.mdx`, not the top-level
  `content/` path floated earlier in this doc.

- [x] **Bite 2 — Content migration**
  Port the "Conteúdo do Museu Explicado" draft into
  `src/content/{locale}/index.mdx`, replacing placeholders with real TCC
  figures per the Gaps table above, and marking genuinely missing numbers
  with `<TodoNote>`. Copy the actual TCC PDF into `public/` and wire the two
  download links (plain `<a download>`, no viewer/preview).

  Done together with Bite 1 in one combined pass, since the content needed
  `TodoNote` (and benefited from `Sidenote`/`GlossaryTerm`) to land at all.
  A rough English translation went into `src/content/en/index.mdx` at the
  same time, reusing the same components. `npm run build` and
  `npm run lint` both pass clean; interactive testing of Sidenote/Glossary/
  Outline at different viewport widths is still outstanding (browser
  automation wasn't available this session) — worth a manual check before
  Bite 3.

- [ ] **Bite 3 — Document viewer**
  Build `DocumentPile`. Extract the Anexo A/B/C screenshots from the TCC PDF
  as image assets and use them as the first real content for the Plano
  Museológico section (replacing that placeholder for real, since the asset
  already exists). PNEM screenshot stays a flagged TODO — no source asset
  exists yet.

- [ ] **Bite 4 — Data visualization components**
  Build Fig. 2 (three planning levels), Fig. 3 (Tufte principles), Fig. 4
  (cronograma) as coded components with the `dataviz` skill's placeholder
  palette. Build the Venn diagram + its `/panorama` route, OG image, and PNG
  download.

- [ ] **Bite 5 — Outreach & sharing**
  Build the standalone shareable stat graphic for cold-email outreach, wire
  per-route OG images, add share/download actions to the data viz pieces.

- [ ] **Bite 6 — i18n content, contact, packaging**
  Real English translation pass, contact form (Route Handler + Resend),
  `manifest.json`/`robots.txt`/`sitemap.ts`, the 404 copy ("oops, {x} is not
  the theme of our research"), bibliography carousel with real book covers,
  hero shader effect (`@paper-design/shaders-react`). This bite is explicitly
  last since it's the most aesthetic/polish-heavy and depends on decisions
  the user reserved for themselves.

## Verification

- After Bite 0: `npm run dev`, confirm `/` and `/en` both resolve with the
  language switcher working.
- After Bite 1: manually test sidenote behavior at desktop and mobile widths
  (resize/devtools), confirm glossary panel positioning and the `/glossario`
  route, confirm outline highlights the active section while scrolling.
- After Bite 2: read the full digest page end-to-end against the source PDF
  to confirm no content was lost and every `<TodoNote>` corresponds to a real
  gap in the Gaps table above.
- After Bite 3: confirm the document pile cycles correctly, is keyboard/swipe
  operable, and the annotation column only shows at rest.
- After Bite 4: confirm each figure matches the data/structure in the TCC,
  and the `/panorama` route's PNG download actually produces a usable file.
- Each bite: `npm run build` must pass before moving to the next.
