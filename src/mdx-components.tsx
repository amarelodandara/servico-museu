import type { MDXComponents } from "mdx/types";
import { H1, H2, H3, H4, H5, H6 } from "@/components/headings";
import { P } from "@/components/paragraph";
import { Blockquote } from "@/components/blockquote";
import { Quote } from "@/components/quote";
import { Sidenote } from "@/components/sidenote";
import { GlossaryTerm } from "@/components/glossary-term";
import { Figure } from "@/components/figure";
import { Aside } from "@/components/aside";
import { Stat } from "@/components/stat";
import { TodoNote } from "@/components/todo-note";
import { WordCountBars } from "@/components/word-count-bars";
import { DocumentPile } from "@/components/document-pile";
import { PlanningLevels } from "@/components/planning-levels";
import { TuftePrinciples } from "@/components/tufte-principles";
import { Cronograma } from "@/components/cronograma";
import { ShareLink } from "@/components/share-link";
import { BookCarousel } from "@/components/book-carousel";

// Global MDX component overrides, registered here so every .mdx file in
// src/content can use them without per-file imports.
const components: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  blockquote: Blockquote,
  Quote,
  Sidenote,
  GlossaryTerm,
  Figure,
  Aside,
  Stat,
  TodoNote,
  WordCountBars,
  DocumentPile,
  PlanningLevels,
  TuftePrinciples,
  Cronograma,
  ShareLink,
  BookCarousel,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
