import type { ComponentPropsWithoutRef } from "react";

/**
 * One named component per markdown heading level, so every level has a
 * real place in the codebase to take its own styling — add classNames
 * here as the type system firms up. `rehype-slug` (next.config.ts)
 * already gives every heading an `id`; `Outline` reads those (currently
 * for `h2`/`h3` only) to build the corner TOC.
 */
export function H1(props: ComponentPropsWithoutRef<"h1">) {
  return <h1 className="text-2xl text-center text-balance my-24" {...props} />;
}

export function H2(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 className="text-xl text-center my-2"{...props} />;
}

export function H3(props: ComponentPropsWithoutRef<"h3">) {
  return <h3 className="text-lg text-center" {...props} />;
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
