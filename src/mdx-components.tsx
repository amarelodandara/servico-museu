import type { MDXComponents } from "mdx/types";
import { H1, H2, H3, H4, H5, H6 } from "@/components/headings";
import { P } from "@/components/paragraph";
import { Sidenote } from "@/components/sidenote";
import { GlossaryTerm } from "@/components/glossary-term";
import { Figure } from "@/components/figure";
import { Aside } from "@/components/aside";
import { Stat } from "@/components/stat";
import { TodoNote } from "@/components/todo-note";
import { WordCountBars } from "@/components/word-count-bars";

// Global MDX component overrides, registered here so every .mdx file in
// src/content can use them without per-file imports. DocumentPile joins
// this map in Bite 3.
const components: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  Sidenote,
  GlossaryTerm,
  Figure,
  Aside,
  Stat,
  TodoNote,
  WordCountBars,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
