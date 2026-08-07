import Image from "next/image";
import { useTranslations } from "next-intl";
import uemgPhoto from "../../public/contributors/uemg.jpg";
import nicolyPhoto from "../../public/contributors/nicoly-dandara.jpg";

/*
 * Only Nicoly's portrait exists so far, so it stands in for all three
 * frames — swap each `portrait` as the real photographs come in. The
 * portraits carry an empty `alt` on purpose: while one photograph doubles
 * for three people, naming the sitter would be wrong on two of them, and
 * the name is right there in text underneath either way.
 */
export const CONTRIBUTORS = [
  {
    name: "Letícia França",
    roleKey: "researcher" as const,
    portrait: nicolyPhoto,
  },
  {
    name: "Nicoly Dandara",
    roleKey: "researcher" as const,
    portrait: nicolyPhoto,
  },
  { name: "Simone Souza", roleKey: "advisor" as const, portrait: nicolyPhoto },
];

/**
 * A portrait held in a grained, recessed frame — the same treatment the
 * header photographs get: film grain over the image, and an inset hairline
 * riding in its own overlay rather than on the container, since an inset
 * shadow paints above the background but below the element's content and
 * the photograph would otherwise cover it.
 *
 * `className` and `style` replace the frame's own sizing, for artwork that
 * isn't a portrait — `style` because a ratio taken from the artwork itself
 * is a computed value, not one of Tailwind's steps. `grain` turns the film
 * layer off for artwork that carries its own: the hero shader generates
 * grain as part of the image, and laying the tile over it just muddies
 * both.
 */
export function FramedArtwork({
  children,
  className = "aspect-[3/4] h-40",
  style,
  grain = true,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  grain?: boolean;
}) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-sm ${className}`}
      style={style}
    >
      {children}
      {grain && (
        <div
          className="photo-grain pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 rounded-sm"
        style={{ boxShadow: "var(--shadow-inset-frame)" }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * The people behind the research plus the institution, as a row of framed
 * portraits with name and role beneath. Shared verbatim between the page
 * header and the footer — same frames, same `h-40` sizing — so the footer
 * closes on the same faces the page opened with; only the flex container
 * differs, via `className`.
 */
export function Contributors({
  className = "",
  showInstitution = true,
  textClassName = "",
}: {
  className?: string;
  showInstitution?: boolean;
  textClassName?: string;
}) {
  const t = useTranslations("Digest");

  return (
    <div className={className}>
      {CONTRIBUTORS.map((person) => (
        <div
          key={person.name}
          className="flex flex-col items-center space-y-2 text-center"
        >
          <FramedArtwork>
            <Image
              src={person.portrait}
              alt=""
              fill
              sizes="120px"
              className="object-cover grayscale"
            />
          </FramedArtwork>

          <div
            className={`flex flex-col items-center -space-y-0.5 ${textClassName}`}
          >
            <span>{person.name}</span>
            <span className="text-neutral-500">{t(person.roleKey)}</span>
          </div>
        </div>
      ))}

      {showInstitution && (
        /* Extra left margin beyond the row's own `gap`, on top of it rather
           than instead of it — the institution is a different kind of
           entry than a person, and a wider gap is a small, legible way to
           say so without a rule or a label. */
        <div className="ml-4 flex flex-col items-center space-y-2 text-center">
          <FramedArtwork>
            <Image
              src={uemgPhoto}
              alt={t("institutionAlt")}
              fill
              sizes="120px"
              className="object-cover grayscale"
            />
          </FramedArtwork>

          <div
            className={`flex flex-col items-center -space-y-0.5 ${textClassName}`}
          >
            <span>{t("institution")}</span>
            <span className="text-neutral-500">{t("institutionLabel")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
