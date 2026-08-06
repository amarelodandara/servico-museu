# Work board — A serviço do museu

Everything below is a discrete task. Blocked items say who unblocks them.
Decisions already taken: **pt-BR is the source of truth, EN gets rewritten to
match it**; **both reference docs get rewritten to current reality**.

**Current working scope: everything except the digest.** The main content
(`src/content/*/index.mdx`) and its sidenotes are parked — a first repair pass
on pt-BR was written and reverted. P0 below stays open and untouched until
that changes.

---

## ✅ Shipped

| # | Task | Where |
|---|---|---|
| S1 | Next 16 + TS + Tailwind + MDX pipeline, `next-intl` pt-BR/en, `localePrefix: "as-needed"`, middleware as `src/proxy.ts` | `src/i18n/*`, `src/proxy.ts` |
| S2 | `Sidenote` — one authored path, margin float desktop / portal panel mobile, registration-order numbering | `sidenote.tsx` |
| S3 | `GlossaryTerm` + 8-term glossary (both locales, IDs matched) + `/glossario` page | `glossary-term.tsx`, `content/glossary.*.json` |
| S4 | `DocumentPile` — depth stack, flick-velocity swipe, arrow keys, expand overlay, annotation column hides in motion | `document-pile.tsx` |
| S5 | Anexos A/B/C extracted losslessly from the TCC | `public/documents/` |
| S6 | Fig. 2 planning levels, Fig. 3 Tufte glyphs, Fig. 4 cronograma (real month-grid gantt) as coded components | `planning-levels.tsx`, `tufte-principles.tsx`, `cronograma.tsx` |
| S7 | `/panorama` Venn + PNG export + own OG image | `panorama-venn.tsx`, `panorama/opengraph-image.tsx` |
| S8 | Outreach stat graphic (223 / 61,5% / 87% / 68,3%) + PNG export, on `/colaborar` | `outreach-graphic.tsx` |
| S9 | `ShareLink` — native share sheet → clipboard fallback | `share-link.tsx` |
| S10 | Contact form + `/api/contact` → Resend REST, mailto fallback when unkeyed | `contact-form.tsx`, `api/contact/route.ts` |
| S11 | manifest / robots / sitemap / icon set, localized 404 echoing the attempted path | `app/manifest.ts`, `robots.ts`, `sitemap.ts`, `[...rest]/page.tsx` |
| S12 | Root OG image, bilingual | `[locale]/opengraph-image.tsx` |
| S13 | Digest content ported with real TCC figures + `TodoNote` gaps, PDF download top and bottom | `content/*/index.mdx`, `public/academic.pdf` |

**Shipped but the reference docs still call it open:** hero shader is installed
and running (`hero-shader.tsx`, `GrainGradient`, spring settle, reduced-motion
guard); five real book jackets live in `public/books/` with four wired;
`/panorama` has a nav entry point.

---

## ✅ Shipped beyond the plan

| # | Task | Where |
|---|---|---|
| B1 | Elevation + motion system: 6-step shadow scale on the hairline + negative-spread recipe, 3 easings, `@property`-animated theme swap, `@starting-style` overlay family | `globals.css` (967 L), `lib/ease.ts` |
| B2 | Dark mode: lamp toggle (`wood`/`bare`), pre-paint anti-flash script, 19-slot `--dark-*` mirror on both `[data-theme]` and `prefers-color-scheme` | `theme-toggle.tsx`, `[locale]/layout.tsx` |
| B3 | Button consolidation: `buttonClass()` at 6 variants, 4 in real use, all size overrides removed | `ui/button.ts` |
| B4 | Closing CTA: fuzzy institution combobox → pre-filled contact form, + research timeline | `institution-cta.tsx`, `lib/fuzzy.ts`, `research-timeline.tsx` |
| B5 | Footer band + colophon dialog + `Contributors` (also exports the `FramedArtwork` primitive) | `footer.tsx`, `about-site-dialog.tsx`, `contributors.tsx` |
| B6 | Surface work: `--background` → `--background-light` wash on a wrapper div, paspateur mats, photo/footer grain, UEMG header photo | `globals.css`, `public/grain.png`, `public/header/` |
| B7 | Typography: Neuton body / Newsreader display / Lato apparatus / Inter chrome | `[locale]/layout.tsx` |
| B8 | Collaborate nudge (60 s, sessionStorage-gated), digest unfold on scroll, rAF smooth-scroll links, label-swap buttons | `collaborate-nudge.tsx`, `digest-unfold.tsx`, `scroll-link.tsx`, `ui/label-swap.tsx` |
| B9 | Live digest word count | `word-count-bars.tsx`, `lib/word-count.ts` |
| B10 | Dev-only design workbench, `notFound()` in prod, carries the design-decision log | `[locale]/design-lab/page.tsx` |
| B11 | Removed on purpose: Outline/TOC widget deleted, museum carousel pulled off the digest (component kept) | `aa0886c` |

---

## 🔴 P0 — Content reconciliation

The pt-BR rewrite in `aa0886c` (−163/+57) never reached EN. **Parked — nothing
here is done.** T1 was written once and reverted at your request; the notes
below are the recipe for when it resumes. Do T1 before T2.

**T1. Repair `src/content/pt-BR/index.mdx` — parked.** Every restorable block
can be recovered from `c9da321` (the pre-rewrite pt-BR) rather than translated
back from EN, so the wording stays the original Portuguese, and your own prose
stays verbatim apart from the six typos. The pass covered:
- Dropping the four leading blank lines. *(Correction to the audit: the
  `Aside`/`Figure` blue-treatment legend never existed in pt-BR — those blanks
  predate the rewrite, and only EN carries the legend. Left out here, since
  pt-BR has no blue-tinted block for it to explain. Decide in T2 whether EN
  keeps it.)*
- `DocumentPile` reordered: it now follows the IBRAM sentence that introduces
  it, and the PNEM sentence + its `TodoNote` follow the pile. Both mid-sentence
  gaps are closed.
- Oi Futuro passage restored to a `>` blockquote. *(Correction: the Don Norman
  passage was never a quote — it's a paraphrase, plain prose in both locales.
  Left alone.)*
- Re-added: `Stat` 4.105/223 + the Minas Gerais `TodoNote` (under "Por que Belo
  Horizonte?"), `Stat` 61,5%/68,3% (after the objective paragraph),
  `PlanningLevels` (after the closed-door-meetings line, with its original
  bridge sentence), `Cronograma`, and the seven-entry ABNT reference list.
- `Cronograma` sits in a new `### O que vem depois` under "O que acontece no
  primeiro capítulo" — parallel to the two existing "Por que…" subsections.
  The old file's "Como essa pesquisa serve ao museu" heading was *not* restored;
  your objective paragraph already does that job, so only its stats came back.
- `TuftePrinciples` moved out of "Por que Belo Horizonte?" (where information
  design had nothing to do with the surrounding text) into "Quem vem com a
  gente", its original home.
- Glossary links now cover 7 of 8 terms: `ibram`, `plano-museologico`, `pnem`,
  `museologia`, `design-de-servicos`, `estatuto-dos-museus` added to
  `cadastro-nacional-de-museus`. Only `educacao-museal` is still unlinked.
- Typos fixed: `normalazições`, `necesária`, `Nacinoal`, `Óbviamente`,
  `amaparada`, `empara`, `pessoas tem`.
- `ShareLink` deliberately **not** restored — the footer already carries one and
  the closing CTA sits directly below the digest; a third share inside one
  scroll is noise. Reverse this if you disagree.
- The covers `TodoNote` was not restored either: all four pt-BR books have real
  cover images now.
- It built and linted clean before being reverted, so the recipe is known-good.

**T2. Rewrite `src/content/en/index.mdx` as a real translation of the repaired pt-BR**
- Same section order, same components; EN's surplus prose discarded.
- Delete the "rough placeholder translation" banner (L1–3) once it's false.
- Delete the stale covers `TodoNote` (L215) — four covers exist now.
- Decide the fate of EN's `Aside`/`Figure` blue-treatment legend (L5–13) — it
  has no pt-BR counterpart and nothing on either page uses the treatment.
- EN's bibliography carries two extra entries (Lei 11.904, PNEM) with no cover;
  either give them covers or match pt-BR's four.

**T3. Bibliography "contradiction" — ✅ not a bug.** pt-BR cites the Portuguese
translation (*Isto é design de serviço na prática*, Bookman, 2019), EN cites the
original (*This is Service Design Doing*, O'Reilly, 2018). Both correct. Left as
is; keep them locale-specific in T2.

**T4. De-hardcode the hero title — ✅ done.** `[locale]/page.tsx` now reads
`t("title")` / `t("titleSubtitle")` / a new `Digest.byline` key added to both
locales, so `/en` stops showing Portuguese in the digest header. The subtitle
is lowercased in place the same way the hero `h1` does it — stored capitalised
so it can stand alone, lowercased where it runs on from the title. No wording
changed in either locale.

**T5. Fix `Digest.introParagraph1`/`2`** — near-duplicates of each other in pt-BR ("Menos academiquês…" in both). Also, only EN names the authors, advisor and university.

---

## 🟠 P1 — Loose ends

**T6. `/glossario` — ✅ deleted, not linked.** The orphan was the symptom; the
page was the problem. Eight terms don't earn a route nobody navigates to, and
the inline affordance already answers the question at the moment it's asked —
popover at the term's own offset on desktop, bottom sheet on mobile. So the
page went instead of gaining a link:
- Removed `src/app/[locale]/glossario/page.tsx`, its `/glossario` sitemap
  entry, the `Glossary` message block and the unused `Digest.glossaryLink` in
  both locales. `content/glossary.{locale}.json` stays — it's what the panel
  reads.
- That makes the panel the only glossary surface, so it was hardened to carry
  the weight. Desktop popover: closes on Escape, returns focus to the term it
  came from (focus was simply dropped before), and `aria-modal` no longer
  claims true while closed.
- **Mobile is now Vaul** (`vaul@1.1.2`, Emil Kowalski's drawer, Radix Dialog
  underneath) instead of the hand-rolled `.overlay-sheet`. It brings drag-to-
  dismiss with velocity, scroll lock, focus trap, focus return and Escape.
  Its curve is `cubic-bezier(0.32, 0.72, 0, 1)` — already this project's
  `--ease-drawer`, so the motion matches what's here without tuning.
  `Drawer.Handle` replaces the hand-drawn grab bar; `Drawer.Title`/
  `Drawer.Description` carry the accessible naming.
- `.overlay-sheet` stays in `globals.css` — the sidenote's mobile panel still
  uses it. That one is the obvious next candidate for Vaul, but it's inside
  the parked digest/sidenote scope.

**T7. Museum carousel — ✅ deleted.** Dead since `aa0886c`. Removed
`museum-carousel.tsx`, both `MuseumCarousel` message blocks, the
`museum-marquee` keyframes and their reduced-motion fallback in `globals.css`,
and all of `public/museum_carousel/` — 8 MB of images including the duplicate
`uemg.jpg` that Decisions Needed #10 was asking about. All recoverable from
git if it should come back.

**T8. Decide `word-count-bars.tsx`** — MDX-registered, used in neither locale.

**T9. Fill three dead hrefs** — `about-site-dialog.tsx:20-22`: project write-up, GitHub repo, Paper Shaders.

**T10. Contributor portraits** — all three point at `nicoly-dandara.jpg`; no photo exists for Letícia França.

**T11. Delete the dead button variants** — `solid` and `quiet` have no call sites. Separately, `outline` (document-pile arrows) is the one tier the design-lab log still lists as unresolved.

**T12. Housekeeping** — `public/books/design_of_everyday_things.jpg` is unreferenced since Norman left both carousels; `public/.DS_Store` is committed.

**T13. Replace `src/content/institutions.ts`** — self-labelled placeholder list of 12 BH museums feeding the CTA combobox.

---

## ⛔ Blocked on you

**T14. Palette + fonts.** `globals.css:23` still declares the tokens neutral stand-ins; `--color-accent: #2563eb` is annotated placeholder. `src/lib/figure-palette.ts` mirrors them for the canvas/OG surfaces and must move in lockstep. Icons regenerate after.

**T15. Figure-palette fidelity.** Accept the darkened `--fig-pink #e0559d` / `--fig-yellow #c2930f`, or revert to source-faithful IBRAM pink/yellow and take the validator WARN.

**T16. Minas Gerais museum count.** In no consulted source, and a literal `xx` is live in shipped prose at `pt-BR/index.mdx:89`. Needs a CNM pull or the sentence goes.

**T17. National free-admission %.** Same — only BH's 87% exists. Flagged inline.

**T18. PNEM screenshot.** No asset anywhere; `DocumentPile` is ready to take it as a fourth document.

**T19. Two remaining book covers** — Lei 11.904/2009 and the PNEM fall through to the typographic placeholder.

---

## 🚀 Deploy

**T20. Create `.env.local`** — none exists on disk. `NEXT_PUBLIC_SITE_URL` (robots, sitemap and `metadataBase` all resolve to `localhost:3000` today), `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (+ verified sender domain); `CONTACT_TO_EMAIL` already defaults to your address. Commit a `.env.example` documenting the four.

**T21. Wire hosting** — Vercel per the pitch, nothing connected.

**T22. Pick analytics** — never decided, never implemented.

---

## 📄 Reference docs

**T23. Rewrite `references/Implementation Plan.md`** — mark the resolved walls, delete the Outline and `public/covers/` claims, add the unplanned design-engineering work so the roadmap matches the site.

**T24. Rewrite `references/Decisions Needed.md`** — drop #3 (shader), #8 (covers), the `/panorama` half of #19, and #10 if the carousel goes; add the locale divergence, the `/glossario` orphan, and the missing `.env`.

---

## 🧪 Verification owed

Never done — has been outstanding since 30 Jul. You run the dev server; I check against it.

| # | Check |
|---|---|
| V1 | `/` and `/en` resolve, switcher round-trips, no Portuguese left in the EN hero after T4 |
| V2 | Sidenotes: margin float desktop, tap-panel mobile, numbering still sequential after the content rewrite |
| V3 | Glossary: panel at the term's offset on desktop, bottom sheet on mobile |
| V4 | `DocumentPile`: cycling, swipe, arrow keys, annotation column hidden in motion, expand overlay — both widths |
| V5 | PNG downloads from `/panorama` and `/colaborar` produce usable files; `ShareLink` clipboard fallback |
| V6 | Contact form all four states, including `not_configured` → mailto |
| V7 | 404 copy interpolating a junk path, both locales |
| V8 | Light *and* dark: header photo hairline, bibliography mat, theme-swap animation, no flash on first paint |
| V9 | Each figure against the TCC's own Figuras 2/3/4 once pt-BR carries them again |
| V10 | `npm run build` + `npm run lint` clean |
