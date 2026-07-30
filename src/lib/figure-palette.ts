/**
 * Literal hex mirror of the --fig-* tokens in globals.css (light-mode
 * steps), for the surfaces that can't read CSS variables: the SVG→canvas
 * PNG export and the next/og ImageResponse OG images. Keep in sync with
 * globals.css when the user's palette pass lands.
 */
export const figurePalette = {
  pink: "#e0559d",
  yellow: "#c2930f",
  ink: "#3d3a35",
  magenta: "#a8156b",
  surface: "#F2F6F7",
  card: "#ffffff",
} as const;
