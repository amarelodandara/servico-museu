import type { ComponentPropsWithoutRef } from "react";

/**
 * Plain markdown paragraph, given its own named component (like
 * `headings.tsx`) so there's a real place in the codebase to style it —
 * unstyled by default, add classNames here.
 */
export function P(props: ComponentPropsWithoutRef<"p">) {
  return <p className="text-xl"{...props} />;
}
