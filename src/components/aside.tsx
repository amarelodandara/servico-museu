import type { ReactNode } from "react";

/**
 * Marks a block of content to render in the right-hand margin column
 * instead of the main reading column. Pure positioning — no border, no
 * background, no font-size — so it composes with anything: wrap a
 * `Figure`, an image, a `Stat`, a stray paragraph. Placement is an
 * authoring choice made per block, not implied by which component you
 * reach for. For an inline numbered citation use `Sidenote` instead;
 * this is for standalone content sitting between paragraphs.
 */
export function Aside({ children }: { children: ReactNode }) {
  return <aside className="aside-float">{children}</aside>;
}
