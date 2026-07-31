import type { ReactNode } from "react";

/**
 * Attributed pull-quote, sitting on its own between paragraphs (unlike
 * `Blockquote`, which styles a plain markdown `>` with no attribution).
 * `id` makes it anchor-linkable, same as `rehype-slug` does for headings.
 *
 * Marked out by colour and indent — no rule, no italic. The indent does the
 * work the border used to: stepping the whole block in from the measure is
 * what makes it read as set apart, and it does that without drawing a mark
 * of its own.
 */
export function Quote({
  id,
  author,
  children,
}: {
  id?: string;
  author?: string;
  children: ReactNode;
}) {
  return (
    <blockquote
      id={id}
      className="my-6 pl-8 text-2xl text-[var(--quote-ink)] [&>p]:text-2xl"
    >
      {children}
      {/* No em dash. The attribution sits on its own line in a smaller,
          quieter face, which already reads as attribution — the dash was
          doing the same job a second time. */}
      {author && (
        <footer className="mt-2 text-base font-medium text-neutral-500 dark:text-neutral-500">
          {author}
        </footer>
      )}
    </blockquote>
  );
}
