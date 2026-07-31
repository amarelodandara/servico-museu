import type { ComponentPropsWithoutRef } from "react";

/**
 * One named component per markdown heading level, so every level has a
 * real place in the codebase to take its own styling — add classNames
 * here as the type system firms up. `rehype-slug` (next.config.ts)
 * already gives every heading an `id`, so headings stay linkable.
 */
export function H1(props: ComponentPropsWithoutRef<"h1">) {
  return <h1 className="text-2xl text-center text-balance my-24" {...props} />;
}

/**
 * The top margin is asymmetric on purpose: a section heading belongs to the
 * text under it, so it needs more air above than below to read as a break
 * rather than as a caption for the paragraph it follows. The digest column
 * sets a 1.5rem rhythm via `space-y-6`, and this adds to it.
 */
export function H2(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 className="mt-16 text-3xl" {...props} />;
}

export function H3(props: ComponentPropsWithoutRef<"h3">) {
  return <h3 className="text-2xl" {...props} />;
}

export function H4(props: ComponentPropsWithoutRef<"h4">) {
  return <h4 {...props} />;
}

export function H5(props: ComponentPropsWithoutRef<"h5">) {
  return <h5 {...props} />;
}

export function H6(props: ComponentPropsWithoutRef<"h6">) {
  return <h6 {...props} />;
}
