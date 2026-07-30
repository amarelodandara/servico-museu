import type { ReactNode } from "react";

/**
 * Attributed pull-quote, sitting on its own between paragraphs (unlike
 * `Blockquote`, which styles a plain markdown `>` with no attribution).
 * `id` makes it anchor-linkable, same as `rehype-slug` does for headings.
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
      className="my-6 border-l-2 border-[var(--color-accent)] pl-4 text-2xl text-neutral-700 italic [&>p]:text-2xl dark:text-neutral-300"
    >
      {children}
      {author && (
        <footer className="mt-2 text-base font-medium text-neutral-500 not-italic dark:text-neutral-500">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}
