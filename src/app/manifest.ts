import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A serviço do museu",
    short_name: "Serviço do museu",
    description:
      "Diretrizes de experiência para a instituição museo-educativa — uma pesquisa de design explicada de forma amigável.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F6F7",
    theme_color: "#F2F6F7",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
