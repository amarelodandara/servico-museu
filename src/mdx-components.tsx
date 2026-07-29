import type { MDXComponents } from "mdx/types";

// Global MDX component overrides. Bite 1 will register Sidenote,
// GlossaryTerm, Figure, Stat, TodoNote, and DocumentPile here.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
