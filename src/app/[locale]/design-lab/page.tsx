import { notFound } from "next/navigation";
import { JetBrains_Mono } from "next/font/google";
import {
  buttonClass,
  type ButtonSize,
  type ButtonSurface,
  type ButtonVariant,
} from "@/components/ui/button";
import { FIELD_AREA_CLASS, FIELD_CLASS } from "@/components/contact-form";

/*
 * Scratch page for trying out button/input options against aiforui.dev's
 * reference. Not linked from anywhere, not in the sitemap, and 404s outside
 * development — this is a workbench, not a route.
 *
 * Findings from aiforui.dev (pulled from its shipped CSS, not eyeballed):
 *
 * - Inputs get a hairline border (~8% black / ~10% white) plus a 1px inset
 *   top shadow at ~5% alpha (`inset 0 1px 1px rgb(0 0 0 / 0.05)`). That's
 *   the whole trick — the field reads as pressed in by one soft line, not a
 *   heavy bevel. Adopted into `FIELD_CLASS`/`FIELD_AREA_CLASS`.
 * - Buttons and cards use a two-layer shadow: a 1px hairline
 *   (`0 0 0 1px rgb(0 0 0 / 0.08)`, doing the job a border would) plus a
 *   *soft, negative-spread* ambient layer underneath it
 *   (`0 8px 8px -8px rgb(0 0 0 / 0.16)`) for the actual lift. Adopted into
 *   `--shadow-raise`/`--shadow-raise-high` — every `button-raised` variant
 *   uses it now, at the input's radius (`rounded-lg`) instead of the old
 *   pill. "C" below pushes the same recipe further, as an input built the
 *   button/card way — still open.
 * - Type system is three families doing three jobs: an editorial serif
 *   (Heldane Text / Tiempos Text, incl. italics) for reading, Inter for UI
 *   chrome, and Berkeley Mono for anything technical. Newsreader (a free
 *   stand-in for Heldane/Tiempos) is adopted for display titles — see the
 *   hero `h1` and the footer's echo of it. JetBrains Mono (stand-in for
 *   Berkeley Mono) is still just a swatch below, undecided.
 *
 * The site has six button variants (`ui/button.ts`); real calls to
 * `buttonClass()` use four now. A variant name is a role ("this is the
 * important one"), not a look to copy from whatever button gets called
 * that — assigning a button to a tier means it takes on that tier's
 * existing appearance, not the other way round. Landed so far: `primary`
 * for the site's real calls-to-action (hero read, contact submit,
 * collaborate's accept, share), `secondary` for lower-stakes-but-still-an-
 * action (hero + footer's download, which is one action shown twice, 404
 * back-home, PNG export), `tertiary` (its own raised-plate-then-flush
 * look, not `quiet`'s) for anything low-stakes (collaborate's dismiss, the
 * locale switch, book carousel's copy action). `outline` (document pile's
 * prev/next arrows) is the one still open, and `quiet`/`solid` are unused
 * by any real component now. Every size override is gone too, so padding
 * is uniform across all of them.
 */

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "solid",
  "outline",
  "quiet",
];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];
const SURFACES: ButtonSurface[] = ["page", "light"];

/*
 * Every `buttonClass(...)` call on the site today, one row per call site,
 * copy included — so the choice is "which of these real buttons stay" and
 * not "which abstract variant sounds nice". `label` is the pt-BR copy
 * verbatim; this page isn't localized, it's a workbench.
 */
const BUTTONS_IN_USE: {
  source: string;
  label: string;
  variant?: ButtonVariant;
  surface?: ButtonSurface;
}[] = [
  {
    source: "page.tsx — hero, read digest",
    label: "Ler resumo",
    variant: "primary",
  },
  {
    source: "page.tsx — hero, download PDF",
    label: "Baixar a versão acadêmica",
    variant: "secondary",
  },
  {
    source: "footer.tsx — download PDF (same action as above)",
    label: "Baixar a versão acadêmica",
    variant: "secondary",
  },
  {
    source: "[...rest]/page.tsx — 404 back home",
    label: "Voltar para a pesquisa",
    variant: "secondary",
  },
  {
    source: "contact-form.tsx — submit",
    label: "Enviar",
    variant: "primary",
  },
  {
    source: "collaborate-nudge.tsx — accept",
    label: "Quero participar",
    variant: "primary",
  },
  {
    source: "collaborate-nudge.tsx — dismiss",
    label: "Agora não",
    variant: "tertiary",
  },
  {
    source: "collaborate-nudge.tsx — back to top",
    label: "Voltar ao topo",
    variant: "secondary",
  },
  {
    source: "share-link.tsx — default",
    label: "Compartilhar pesquisa",
    variant: "primary",
  },
  {
    source: "share-link.tsx — footer (surface: light, same action as above)",
    label: "Compartilhar pesquisa",
    variant: "primary",
    surface: "light",
  },
  {
    source: "outreach-graphic.tsx / panorama-venn.tsx — download PNG",
    label: "Baixar como PNG",
    variant: "secondary",
  },
  {
    source: "book-carousel.tsx — copy reading list",
    label: "Copiar lista de leitura",
    variant: "tertiary",
  },
  {
    source: "locale-switcher.tsx",
    label: "Read in English",
    variant: "tertiary",
  },
  {
    source: "document-pile.tsx — prev/next",
    label: "← / →",
    variant: "outline",
  },
];

/*
 * Input candidates, named A/B/C so they're easy to point at in
 * conversation. `A` is `FIELD_CLASS` verbatim — the aiforui hairline +
 * top-highlight recipe, now the real baseline after the lab call. `C`
 * stays as the deeper, button/card-flavoured alternative, still open.
 */
const INPUT_VARIANTS: { name: string; note: string; className: string }[] = [
  {
    name: "A — current (adopted)",
    note: "hairline border + inset 0 1px 1px at 5% — the aiforui recipe, now in FIELD_CLASS",
    className: FIELD_CLASS,
  },
  {
    name: "C — hairline + ambient lift",
    note: "border-as-shadow + soft negative-spread layer, from the button/card recipe — still open",
    className:
      "font-lato w-full rounded-lg bg-white px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 " +
      "shadow-[inset_0_1px_1px_rgb(0_0_0_/_0.05),0_0_0_1px_rgb(0_0_0_/_0.08),0_2px_2px_-1px_rgb(0_0_0_/_0.1)] " +
      "transition-[box-shadow,background-color] duration-150 ease-out " +
      "focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)] " +
      "dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-[inset_0_1px_1px_rgb(255_255_255_/_0.04),0_0_0_1px_rgb(255_255_255_/_0.1),0_2px_2px_-1px_rgb(0_0_0_/_0.3)]",
  },
];

export default function DesignLabPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 px-6 py-16 text-[var(--foreground)]">
      <header className="flex flex-col gap-2">
        <h1 className="font-lato text-2xl">Design lab</h1>
        <p className="max-w-prose text-sm text-neutral-600 dark:text-neutral-400">
          Buttons, inputs and type, side by side, for testing options against
          the shadow and type choices on{" "}
          <a
            href="https://aiforui.dev"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-neutral-400 underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            aiforui.dev
          </a>
          . Toggle the theme in the nav to check both. Dev-only — 404s in
          production.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-lato text-xs tracking-wide text-neutral-500 uppercase">
          Buttons in use
        </h2>
        <p className="max-w-prose text-sm text-neutral-600 dark:text-neutral-400">
          Every real button on the site today, with its real copy — the question
          is which of these survive as primary/secondary, not which abstract
          variant looks nice in isolation.
        </p>
        <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {BUTTONS_IN_USE.map((row) => (
            <div
              key={row.source}
              className="flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <span className="font-lato max-w-[22ch] text-xs text-neutral-500">
                {row.source}
              </span>
              <button
                type="button"
                className={buttonClass({
                  variant: row.variant,
                  surface: row.surface,
                  className: "w-fit",
                })}
              >
                {row.label}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-lato text-xs tracking-wide text-neutral-500 uppercase">
          All variants, sizes, surfaces
        </h2>
        {SURFACES.map((surface) => (
          <div
            key={surface}
            className={
              surface === "light"
                ? "flex flex-col gap-4 rounded-lg bg-white p-6"
                : "flex flex-col gap-4 rounded-lg border border-dashed border-neutral-300 p-6 dark:border-neutral-700"
            }
          >
            <p className="font-lato text-xs text-neutral-500 uppercase">
              surface: {surface}
            </p>
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-3">
                <span className="font-lato w-20 shrink-0 text-xs text-neutral-500">
                  {variant}
                </span>
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={buttonClass({ variant, size, surface })}
                  >
                    {size}
                  </button>
                ))}
                <button
                  type="button"
                  disabled
                  className={buttonClass({
                    variant,
                    size: "sm",
                    surface,
                    className: "disabled:opacity-50",
                  })}
                >
                  disabled
                </button>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-lato text-xs tracking-wide text-neutral-500 uppercase">
          Inputs
        </h2>
        <div className="flex flex-col gap-6">
          {INPUT_VARIANTS.map((option) => (
            <div key={option.name} className="flex flex-col gap-2">
              <p className="font-lato text-xs text-neutral-500">
                {option.name} — {option.note}
              </p>
              <input
                placeholder="Type something…"
                className={option.className}
              />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <p className="font-lato text-xs text-neutral-500">
              Textarea, current (FIELD_AREA_CLASS)
            </p>
            <textarea
              rows={3}
              placeholder="Longer message…"
              className={FIELD_AREA_CLASS}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-lato text-xs tracking-wide text-neutral-500 uppercase">
          Type
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="font-lato text-xs text-neutral-500">
              Body — Neuton, unchanged
            </p>
            <p className="text-3xl">In service of the museum</p>
            <p className="text-sm leading-relaxed">
              The quick brown fox jumps over the lazy dog. 0123456789.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-lato text-xs text-neutral-500">
              Labels — Lato, unchanged
            </p>
            <p className="font-lato text-3xl">In service of the museum</p>
            <p className="font-lato text-sm leading-relaxed">
              The quick brown fox jumps over the lazy dog. 0123456789.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-lato text-xs text-neutral-500">
              Figures — Inter, unchanged
            </p>
            <p className="font-inter text-3xl">In service of the museum</p>
            <p className="font-inter text-sm leading-relaxed">
              The quick brown fox jumps over the lazy dog. 0123456789.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-lato text-xs text-neutral-500">
              Titles — Newsreader italic (adopted: hero h1, footer echo)
            </p>
            <p className="font-newsreader text-3xl italic">
              In service of the museum
            </p>
            <p className="font-newsreader text-sm leading-relaxed italic">
              The quick brown fox jumps over the lazy dog. 0123456789.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <p className="font-lato text-xs text-neutral-500">
              Candidate — JetBrains Mono (stand-in for Berkeley Mono, still
              undecided)
            </p>
            <p className={`${jetbrainsMono.className} text-lg`}>
              In service of the museum
            </p>
            <p className={`${jetbrainsMono.className} text-sm leading-relaxed`}>
              The quick brown fox jumps over the lazy dog. 0123456789.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
