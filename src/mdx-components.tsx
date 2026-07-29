import type { MDXComponents } from "mdx/types";
import { Sidenote } from "@/components/sidenote";
import { GlossaryTerm } from "@/components/glossary-term";
import { Figure } from "@/components/figure";
import { Stat } from "@/components/stat";
import { TodoNote } from "@/components/todo-note";

// Global MDX component overrides, registered here so every .mdx file in
// src/content can use them without per-file imports. DocumentPile joins
// this map in Bite 3.
const components: MDXComponents = {
  Sidenote,
  GlossaryTerm,
  Figure,
  Stat,
  TodoNote,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
