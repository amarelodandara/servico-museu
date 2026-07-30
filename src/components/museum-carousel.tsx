import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import bienal from "../../public/museum_carousel/bienal.jpg";
import masp from "../../public/museum_carousel/masp.jpg";
import nordeste from "../../public/museum_carousel/nordeste.jpg";
import republica from "../../public/museum_carousel/republica.jpg";
import toninhas from "../../public/museum_carousel/toninhas.png";

/**
 * Visual references from the world of museum design, shown as a full-bleed
 * gallery wall that drifts sideways forever.
 *
 * Ids key into the `MuseumCarousel` message namespace for title, alt text
 * and credit, so nothing user-visible is hardcoded here.
 */
const ARTWORKS: { id: string; src: StaticImageData }[] = [
  { id: "bienal", src: bienal },
  { id: "masp", src: masp },
  { id: "nordeste", src: nordeste },
  { id: "republica", src: republica },
  { id: "toninhas", src: toninhas },
];

/**
 * How many identical sets ride the track. The animation shifts by exactly
 * one set (100/COPIES percent), so any count wraps seamlessly — but the
 * screen only stays filled while `viewport <= (COPIES - 1) * setWidth`. One
 * set is roughly 1700px at desktop height, so four sets cover displays up
 * to ~5000px wide; two would leave a gap at the right edge on anything
 * wider than a laptop. The duplicates are decorative and cost no extra
 * downloads — same five sources, cached.
 */
const MARQUEE_COPIES = 4;

/**
 * One hung piece: the image in a recessed well, with a museum cartela
 * below it. Every plate keeps its own aspect ratio at a shared height, the
 * way a real wall hangs mixed formats off a common baseline.
 *
 * `decorative` marks the repeated sets of the marquee — same pixels, no
 * accessible name, so screen readers and the tab order see each piece once.
 */
function Plate({
  id,
  src,
  decorative,
}: {
  id: string;
  src: StaticImageData;
  decorative: boolean;
}) {
  const t = useTranslations("MuseumCarousel");

  return (
    <figure
      // Trailing margin rather than a gap on the track: every set must
      // measure exactly the same, including the space after its last
      // plate, or the wrap lands a fraction of a gap off.
      className="mr-6 shrink-0 lg:mr-10"
      aria-hidden={decorative || undefined}
    >
      <div
        className="relative h-48 overflow-hidden rounded-sm sm:h-56 lg:h-64"
        // A definite height plus the image's own ratio resolves the width,
        // so `fill` has a box to fill without any circular sizing.
        style={{ aspectRatio: `${src.width} / ${src.height}` }}
      >
        <Image
          src={src}
          alt={decorative ? "" : t(`alt_${id}`)}
          fill
          sizes="(max-width: 640px) 50vw, 400px"
          placeholder="blur"
          className="object-cover"
        />
        {/* Recessed edge, as its own layer: an inset shadow on the parent
            would paint underneath the image. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-sm"
          style={{ boxShadow: "var(--shadow-inset-frame)" }}
          aria-hidden="true"
        />
      </div>

      <figcaption className="mt-3 flex min-h-12 flex-col gap-0.5">
        <span className="text-sm italic">{t(`title_${id}`)}</span>
        <span className="font-lato text-[0.7rem] tracking-wide text-neutral-500 uppercase dark:text-neutral-500">
          {t("creditPlaceholder")}
        </span>
      </figcaption>
    </figure>
  );
}

export function MuseumCarousel() {
  const t = useTranslations("MuseumCarousel");

  return (
    <section
      aria-label={t("label")}
      aria-roledescription="carousel"
      // Full bleed out of the centered reading column. `main` carries
      // `overflow-x-clip` so the scrollbar's share of 100vw is swallowed
      // instead of producing a horizontal scrollbar.
      className="relative left-1/2 w-screen -translate-x-1/2 py-4 my-24"
    >
      <div className="museum-marquee-viewport overflow-hidden">
        <div
          className="museum-marquee flex w-max"
          // The wrap distance is one set, derived from the copy count so
          // the two can't drift apart.
          style={
            {
              "--marquee-shift": `-${100 / MARQUEE_COPIES}%`,
            } as React.CSSProperties
          }
        >
          {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
            <div key={copy} className="flex w-max">
              {ARTWORKS.map((artwork) => (
                <Plate
                  key={artwork.id}
                  id={artwork.id}
                  src={artwork.src}
                  // Only the first set is announced; the rest repeat it.
                  decorative={copy > 0}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
