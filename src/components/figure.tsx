import type { ReactNode } from "react";

/**
 * `added` toggles the blue-tint treatment from the pitch doc, marking
 * content that exists only on this site and not in the academic text sent
 * to the banca. Color is a token swap later, not a rewrite of this file.
 */
export function Figure({
  src,
  alt,
  caption,
  added = false,
  children,
}: {
  src?: string;
  alt?: string;
  caption?: ReactNode;
  added?: boolean;
  children?: ReactNode;
}) {
  return (
    <figure
      className={
        "my-4 rounded-md border p-4 " +
        (added
          ? "border-[var(--color-accent)] bg-[var(--color-added-tint)] text-neutral-900"
          : "border-neutral-200 dark:border-neutral-800")
      }
    >
      {children}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="w-full rounded" />
      )}
      {caption && (
        <figcaption className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
