import type { ComponentPropsWithoutRef } from "react";

/**
 * Native markdown blockquote (`>` syntax), given its own component so it
 * has a real place to be styled instead of falling through as unstyled
 * browser default — matches the `P`/`H1`-`H6` pattern in this directory.
 *
 * The `[&>p]:text-2xl` targets the paragraph MDX wraps the quoted text in
 * (rendered through the `P` component, which sets `text-xl` on every
 * paragraph): a bare `text-2xl` on the blockquote itself would lose to
 * that more specific rule and never show up.
 */
export function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="my-6 border-l-2 border-[var(--accent)] pl-4 text-neutral-700 italic [&>p]:text-2xl dark:text-neutral-300"
      {...props}
    />
  );
}
