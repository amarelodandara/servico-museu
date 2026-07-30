# Decisions needed (things only you can resolve)

Everything below was deliberately left open during the autonomous breadth
pass (Bites 3–6). The site builds and lints clean without them; each item
says exactly where to plug the answer in.

## Aesthetic (explicitly reserved by you)

1. **Palette + fonts.** All colors still live as tokens in
   `src/app/globals.css` (`--background`, `--color-accent`, `--fig-*`) plus
   one literal mirror in `src/lib/figure-palette.ts` (needed by the PNG
   export and OG images, which can't read CSS vars — keep the two in sync).
   Fonts are Neuton/Lato/Inter placeholders in `src/app/[locale]/layout.tsx`.
2. **Figure palette fidelity.** The IBRAM figures' source colors (light
   pink, bright yellow) failed the dataviz validator's contrast/lightness
   checks, so I darkened them (`--fig-pink #e0559d`, `--fig-yellow #c2930f`)
   while keeping hue identity; the black slot intentionally stays a neutral
   (that's what the source uses) and every mark is direct-labeled as relief.
   If you'd rather be source-faithful than validator-clean, swap the tokens
   back and accept the WARN.
3. **Hero shader** (`@paper-design/shaders-react`, the pitch's "selfish
   choice"). Not installed — it's pure aesthetics and depends on your visual
   pass. The frames in the header are the intended mounting spot.
4. **Icons.** `src/app/icon.svg` + `public/icon-192/512.png` implement the
   pitch's "frame with a workflow inside" idea as a placeholder rendering.
   Regenerate when the real palette lands (generation script exists in the
   session scratchpad; trivially redone).

## Content gaps (need external sources or your call)

5. **Minas Gerais museum count** — still not in any consulted source; the
   digest keeps a visible `<TodoNote>`. Needs a CNM data pull or dropping
   the sentence.
6. **National free-admission percentage** — same situation (only BH's 87%
   exists); flagged inline.
7. **PNEM screenshot** — no source asset exists. The DocumentPile is ready
   to take it as a fourth document (or its own pile) the moment you capture
   the resolution PDF.
8. **Real book covers** — the bibliography shelf renders typographic
   placeholders; drop images into `public/covers/` and add a
   `cover: "/covers/…"` prop per book in both `src/content/*/index.mdx`.
9. **English translation** — still the rough placeholder pass (marked at the
   top of `src/content/en/index.mdx`); a real pass is yours to do or
   delegate. New EN strings I added (figures, forms, outreach) are decent
   but should ride along in that review.

## Deploy-time configuration

10. **Production domain** — set `NEXT_PUBLIC_SITE_URL` (used by
    `metadataBase`, sitemap, robots). Until then OG URLs resolve to
    localhost.
11. **Resend** — the form at `/colaborar` posts to `/api/contact`, which
    needs `RESEND_API_KEY` (and ideally a verified domain +
    `CONTACT_FROM_EMAIL`; `CONTACT_TO_EMAIL` defaults to
    nicolysantos51@gmail.com). Without the key the form shows a mailto
    fallback — nothing breaks, nothing sends.
12. **Hosting** — pitch says Vercel; nothing is wired. Also unimplemented
    from the pitch's "tiny bits": analytics/instrumentation choice.

## Judgment calls I made that you may want to revisit

13. **Tufte figure (Figura 3)** — the source is a scanned third-party image
    (Durand 2011), so I rebuilt it as six abstract SVG glyphs with the
    original English principle names, credited as "reinterpretado de
    Durand". If you'd rather show the original scan, it extracts from the
    TCC PDF the same way the Anexos did.
14. **Tufte placement** — the digest had no section for it, so it sits in
    "Quem vem com a gente" with a one-sentence bridge I wrote.
15. **Outreach graphic placement** — it lives on `/colaborar` (with PNG
    download + share); the pitch imagined it primarily as an email
    attachment, so tell me if you want it on its own route instead.
16. **Stats 61,5% / 68,3%** — added to the digest under "Como essa pesquisa
    serve ao museu" with a short connecting sentence I wrote.
17. **Nav links** — glossário/panorama/colaborar are plain text links in the
    top nav; purely structural, restyle at will.

## Verification still owed (needs a browser)

- DocumentPile: cycling, swipe, keyboard arrows, annotation column hiding
  during motion, expand overlay — at desktop and mobile widths.
- Venn + outreach PNG downloads actually producing good files.
- 404 catch-all copy, contact form states, sidenote/glossary behavior
  post-changes.
