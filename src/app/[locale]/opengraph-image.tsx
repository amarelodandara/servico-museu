import { ImageResponse } from "next/og";
import { figurePalette } from "@/lib/figure-palette";

export const alt = "A serviço do museu — diretrizes de experiência para a instituição museo-educativa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  "pt-BR": {
    kicker: "Uma explicação mais amigável de uma pesquisa de design",
    title: "A serviço do museu",
    subtitle: "Diretrizes de experiência para a instituição museo-educativa",
    stat: "223 museus em Belo Horizonte",
  },
  en: {
    kicker: "A friendlier explanation of a design research project",
    title: "In service of the museum",
    subtitle: "Experience guidelines for the museum-educational institution",
    stat: "223 museums in Belo Horizonte",
  },
} as const;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = COPY[locale as keyof typeof COPY] ?? COPY["pt-BR"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: figurePalette.surface,
          color: figurePalette.ink,
          padding: 40,
        }}
      >
        {/* Picture-frame motif around the whole card. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            border: `8px solid ${figurePalette.ink}`,
            backgroundColor: figurePalette.card,
            padding: "60px 80px",
          }}
        >
          <div style={{ fontSize: 26, opacity: 0.7 }}>{copy.kicker}</div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 16,
            }}
          >
            {copy.title}
          </div>
          <div style={{ fontSize: 30, marginTop: 20, opacity: 0.85 }}>
            {copy.subtitle}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 40,
              fontSize: 26,
              fontWeight: 700,
              color: figurePalette.magenta,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: figurePalette.magenta,
              }}
            />
            {copy.stat}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
