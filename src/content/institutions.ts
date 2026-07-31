/**
 * PLACEHOLDER LIST — replace wholesale when the real one lands.
 *
 * These are Belo Horizonte museums standing in so the search has something
 * to match against; none of them has been checked against the study's
 * actual inclusion criteria. Swapping the list is the only change needed —
 * the search reads names and aliases and nothing else.
 *
 * `aliases` exist because people type what they say, not what's on the
 * building: acronyms (MAO), short names (Minas e Metal), old names.
 */
export type Institution = {
  name: string;
  aliases?: string[];
};

export const INSTITUTIONS: Institution[] = [
  { name: "Museu de Artes e Ofícios", aliases: ["MAO"] },
  { name: "Museu das Minas e do Metal", aliases: ["MMM", "Minas e Metal"] },
  { name: "Museu Histórico Abílio Barreto", aliases: ["MHAB", "Abílio Barreto"] },
  { name: "Museu de Arte da Pampulha", aliases: ["MAP", "Pampulha"] },
  { name: "Memorial Minas Gerais Vale", aliases: ["Memorial Vale"] },
  { name: "Casa Fiat de Cultura" },
  { name: "Centro Cultural Banco do Brasil Belo Horizonte", aliases: ["CCBB", "CCBB BH"] },
  { name: "Museu de Ciências Naturais PUC Minas", aliases: ["PUC Minas", "Ciências Naturais"] },
  { name: "Museu Inimá de Paula" },
  { name: "Espaço do Conhecimento UFMG", aliases: ["UFMG", "Espaço do Conhecimento"] },
  { name: "Museu de História Natural e Jardim Botânico da UFMG", aliases: ["MHNJB"] },
  { name: "Palácio das Artes" },
];
