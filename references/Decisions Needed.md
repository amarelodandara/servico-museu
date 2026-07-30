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
9. **Carousel credits** — the five museum-design references in
   `public/museum_carousel/` are hung with museum cartelas whose credit
   line reads "Autoria, ano e fonte a definir". I deliberately did **not**
   invent photographers, designers or years: attributing real work to a
   named person from a filename would be fabricating a record. Titles use
   only what's legible in each piece (e.g. "1ª Bienal de São Paulo", 1951)
   or your own filename. Fill the real credits in the `MuseumCarousel`
   block of `messages/{pt-BR,en}.json` — `creditPlaceholder` is the shared
   fallback, so add a `credit_<id>` key per piece when you have them and I
   can wire the per-piece lookup.
10. **Stray `uemg.jpg` in `public/museum_carousel/`** — you said five
    images and dropped five (bienal, masp, nordeste, republica, toninhas);
    `uemg.jpg` is also sitting in that folder, byte-identical in date to
    the header photo at `public/header/uemg.jpg`. I left it alone and
    excluded it from the carousel. Tell me whether it should join the
    carousel as a sixth piece or be deleted as a stray copy.
11. **English translation** — still the rough placeholder pass (marked at
    the top of `src/content/en/index.mdx`); a real pass is yours to do or
    delegate. New EN strings I added (figures, forms, outreach, carousel)
    are decent but should ride along in that review.

## Deploy-time configuration

12. **Production domain** — set `NEXT_PUBLIC_SITE_URL` (used by
    `metadataBase`, sitemap, robots). Until then OG URLs resolve to
    localhost.
13. **Resend** — the form at `/colaborar` posts to `/api/contact`, which
    needs `RESEND_API_KEY` (and ideally a verified domain +
    `CONTACT_FROM_EMAIL`; `CONTACT_TO_EMAIL` defaults to
    nicolysantos51@gmail.com). Without the key the form shows a mailto
    fallback — nothing breaks, nothing sends.
14. **Hosting** — pitch says Vercel; nothing is wired. Also unimplemented
    from the pitch's "tiny bits": analytics/instrumentation choice.

## Judgment calls I made that you may want to revisit

15. **Tufte figure (Figura 3)** — the source is a scanned third-party image
    (Durand 2011), so I rebuilt it as six abstract SVG glyphs with the
    original English principle names, credited as "reinterpretado de
    Durand". If you'd rather show the original scan, it extracts from the
    TCC PDF the same way the Anexos did.
16. **Tufte placement** — the digest had no section for it, so it sits in
    "Quem vem com a gente" with a one-sentence bridge I wrote.
17. **Outreach graphic placement** — it lives on `/colaborar` (with PNG
    download + share); the pitch imagined it primarily as an email
    attachment, so tell me if you want it on its own route instead.
18. **Stats 61,5% / 68,3%** — added to the digest under "Como essa pesquisa
    serve ao museu" with a short connecting sentence I wrote.
19. **Nav is now just the language switcher** — you removed the
    glossário/panorama/colaborar links and the logo placeholder. Worth
    knowing what that orphaned: `/colaborar` is still reachable from an
    inline link near the end of the digest, but **`/glossario` and
    `/panorama` currently have no entry point anywhere in the UI** (glossary
    terms open inline panels rather than linking to the page). All three
    stay in the sitemap and remain directly addressable. Not fixed on my
    side, since presumably the nav is mid-redesign — but they need a way in
    before launch.

## Verification still owed (needs a browser)

- DocumentPile: cycling, swipe, keyboard arrows, annotation column hiding
  during motion, expand overlay — at desktop and mobile widths.
- Venn + outreach PNG downloads actually producing good files.
- 404 catch-all copy, contact form states, sidenote/glossary behavior
  post-changes.
- The shadow tokens in light *and* dark mode: the header photographs (now
  mat-less, carrying only the inset hairline + film grain) and the
  bibliography shelf (which keeps its paspateur mat). They're deliberately
  near-invisible, so what to check is whether each edge still holds against
  the page rather than bleeding into it.
- The museum carousel: that the loop has no visible seam or gap at the
  right edge on your widest screen, that the edge fade reads as "a tad"
  rather than heavy, that hover actually pauses it long enough to read a
  cartela, and that the plate height (`h-48 sm:h-56 lg:h-64`) and drift
  speed (`--marquee-duration`, 55s per set) feel right. The MASP elevation
  is nearly white, so it's the one to check the inset hairline against.
