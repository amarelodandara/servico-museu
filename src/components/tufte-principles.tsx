import { useTranslations } from "next-intl";

/**
 * Coded rebuild of TCC Figura 3 — Tufte's information-design principles
 * (source figure: Durand 2011, adapted from Tufte 1990). The original is a
 * scanned third-party image; here each principle gets an abstract SVG glyph
 * in the figure palette instead. Principle names stay in English, as they
 * do in the source figure.
 */
const GLYPH_STROKE = { fill: "none", strokeWidth: 2 } as const;

function GlyphFlatland() {
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" className="h-10 w-16">
      <rect x="4" y="12" width="28" height="20" stroke="var(--fig-ink)" {...GLYPH_STROKE} />
      <rect x="16" y="6" width="28" height="20" stroke="var(--fig-yellow)" {...GLYPH_STROKE} />
      <rect x="28" y="2" width="28" height="20" stroke="var(--fig-magenta)" {...GLYPH_STROKE} />
    </svg>
  );
}

function GlyphMicroMacro() {
  const dots = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 10; col++) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={6 + col * 5.6}
          cy={8 + row * 8}
          r={(row + col) % 3 === 0 ? 1.8 : 1}
          fill={(row + col) % 4 === 0 ? "var(--fig-magenta)" : "var(--fig-ink)"}
        />,
      );
    }
  }
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" className="h-10 w-16">
      {dots}
    </svg>
  );
}

function GlyphLayering() {
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" className="h-10 w-16">
      <rect x="8" y="8" width="34" height="24" fill="var(--fig-yellow)" opacity="0.45" />
      <rect x="22" y="14" width="34" height="24" fill="var(--fig-magenta)" opacity="0.45" />
    </svg>
  );
}

function GlyphSmallMultiples() {
  const cell = (x: number, y: number, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width="24" height="14" stroke="var(--fig-ink)" {...GLYPH_STROKE} strokeWidth={1.5} />
      <polyline
        points={`${x + 3},${y + 10} ${x + 9},${y + 5} ${x + 15},${y + 8} ${x + 21},${y + 3}`}
        stroke="var(--fig-magenta)"
        {...GLYPH_STROKE}
        strokeWidth={1.5}
      />
    </g>
  );
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" className="h-10 w-16">
      {cell(4, 4, "a")}
      {cell(34, 4, "b")}
      {cell(4, 22, "c")}
      {cell(34, 22, "d")}
    </svg>
  );
}

function GlyphColor() {
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" className="h-10 w-16">
      <path d="M20 34 A16 16 0 0 1 36 18 L36 34 Z" fill="var(--fig-ink)" />
      <path d="M36 18 A16 16 0 0 1 52 34 L36 34 Z" fill="var(--fig-yellow)" />
      <circle cx="14" cy="12" r="5" fill="var(--fig-magenta)" />
    </svg>
  );
}

function GlyphNarratives() {
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" className="h-10 w-16">
      <path
        d="M2 20 Q10 4 18 20 T34 20 T50 20 T62 20"
        stroke="var(--fig-magenta)"
        {...GLYPH_STROKE}
      />
      <path
        d="M2 24 Q10 40 18 24 T34 24 T50 24 T62 24"
        stroke="var(--fig-ink)"
        {...GLYPH_STROKE}
      />
    </svg>
  );
}

const PRINCIPLES = [
  { name: "Escaping Flatland", Glyph: GlyphFlatland },
  { name: "Micro / Macro Readings", Glyph: GlyphMicroMacro },
  { name: "Layering and Separation", Glyph: GlyphLayering },
  { name: "Small Multiples", Glyph: GlyphSmallMultiples },
  { name: "Color and Information", Glyph: GlyphColor },
  { name: "Narratives of Space and Time", Glyph: GlyphNarratives },
];

export function TuftePrinciples() {
  const t = useTranslations("TuftePrinciples");

  return (
    <figure className="my-8">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {PRINCIPLES.map(({ name, Glyph }) => (
          <li key={name} className="flex flex-col items-center gap-2 text-center">
            <Glyph />
            <span className="font-lato text-xs tracking-wide uppercase text-neutral-600 dark:text-neutral-400">
              {name}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        {t("caption")} <span className="text-neutral-400">{t("source")}</span>
      </figcaption>
    </figure>
  );
}
