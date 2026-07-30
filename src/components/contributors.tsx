import Image from "next/image";
import { useTranslations } from "next-intl";
import uemgPhoto from "../../public/header/uemg.jpg";

export const CONTRIBUTORS = [
  { name: "Letícia França", roleKey: "researcher" as const },
  { name: "Nicoly Dandara", roleKey: "researcher" as const },
  { name: "Simone Souza", roleKey: "advisor" as const },
];

/**
 * A portrait held in a grained, recessed frame — the same treatment the
 * header photographs get: film grain over the image, and an inset hairline
 * riding in its own overlay rather than on the container, since an inset
 * shadow paints above the background but below the element's content and
 * the photograph would otherwise cover it.
 */
export function FramedArtwork({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate aspect-[3/4] h-40 overflow-hidden rounded-sm">
      {children}
      <div
        className="photo-grain pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
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
export function Contributors({ className = "" }: { className?: string }) {
  const t = useTranslations("Digest");

  return (
    <div className={className}>
      {CONTRIBUTORS.map((person) => (
        <div
          key={person.name}
          className="flex flex-col items-center space-y-2 text-center"
        >
          <FramedArtwork>
            {/* Portrait placeholder until the real photographs land. */}
            <div
              className="h-full w-full bg-[var(--color-accent)]"
              aria-hidden="true"
            />
          </FramedArtwork>

          <div className="flex flex-col items-center -space-y-0.5">
            <span>{person.name}</span>
            <span className="text-neutral-500">{t(person.roleKey)}</span>
          </div>
        </div>
      ))}

      <div className="flex flex-col items-center space-y-2 text-center">
        <FramedArtwork>
          <Image
            src={uemgPhoto}
            alt={t("institutionAlt")}
            fill
            sizes="120px"
            className="object-cover"
          />
        </FramedArtwork>

        <div className="flex flex-col items-center -space-y-0.5">
          <span>{t("institution")}</span>
          <span className="text-neutral-500">{t("institutionLabel")}</span>
        </div>
      </div>
    </div>
  );
}
