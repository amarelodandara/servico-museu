import type { ReactNode } from "react";

/**
 * Visible marker for content gaps (see the Gaps table in the implementation
 * plan) — flags what's genuinely missing instead of silently inventing a
 * number or asset.
 */
export function TodoNote({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="my-4 rounded-md border border-dashed border-amber-500 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-200"
    >
      <span className="mr-1 font-semibold tracking-wide uppercase">TODO</span>
      {children}
    </div>
  );
}
