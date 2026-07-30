import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { SidenoteProvider } from "@/components/sidenote";
import { Outline } from "@/components/outline";
import { WordCountBars } from "@/components/word-count-bars";
import ContentPtBR from "@/content/pt-BR/index.mdx";
import ContentEn from "@/content/en/index.mdx";
import uemgPhoto from "../../../public/header/uemg.jpg";

const CONTENT = {
  "pt-BR": ContentPtBR,
  en: ContentEn,
};

function DownloadPdfLink({
  label,
  note,
  className = "",
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <a
        href="/academic.pdf"
        download
        className="w-fit text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
      >
        {label}
      </a>
      {note && (
        <span className="text-xs text-neutral-500 dark:text-neutral-500">
          {note}
        </span>
      )}
    </div>
  );
}

function FramedArtwork({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-sm paspateur-bg relative aspect-[3/4] h-40 p-4 inset-shadow-sm inset-shadow-blue-50 inset-ring inset-ring-gray-200">
      <div
        className=" pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />
      <div className="relative isolate z-10 h-full w-full overflow-hidden shadow-xs shadow-gray-100">
        {children}
        <div
          className="photo-grain pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

const CONTRIBUTORS = [
  { name: "Letícia França", roleKey: "researcher" as const },
  { name: "Nicoly Dandara", roleKey: "researcher" as const },
  { name: "Simone Souza", roleKey: "advisor" as const },
];

export default function DigestPage() {
  const t = useTranslations("Digest");
  const locale = useLocale();
  const Content = CONTENT[locale as keyof typeof CONTENT] ?? ContentPtBR;

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto flex w-10/12 flex-1 flex-col gap-6 px-6 py-16">
        <header className="grid grid-cols-5">
          <div className="flex flex-col gap-2 col-span-3 justify-end">
            <div className="space-y-6">


              <p className="font-inter">{t("introParagraph1")}</p>

              <div className="space-y-2 text-3xl text-balance">

            <h1 className="">
              {t("title")} <span className="lowercase text-gray-500">{t("titleSubtitle")}</span>
            </h1>
            <p className="">{t("introParagraph2")}</p>
              </div>
            </div>

            <div className="">
              <div className="col-span-3 flex flex-col space-y-8 text-balance">
                <div className="space-y-4">



                </div>

                <WordCountBars />

                {/*<div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#digest-content"
                    className="font-lato w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                  >
                    {t("readDigest")}
                  </a>
                  <DownloadPdfLink
                    label={t("downloadPdf")}
                    note={t("downloadPdfNote")}
                    className="font-lato"
                  />
                </div>*/}
              </div>


            </div>


          </div>

          <div className="col-span-2 flex  justify-end gap-6 flex-wrap-reverse">


              {CONTRIBUTORS.map(
                (person) => (
                  <div
                    key={person.name}
                    className="flex flex-col items-center text-center space-y-2"
                  >
                    <FramedArtwork>
                      <div
                        className="h-full w-full bg-[var(--color-accent)]"
                        aria-hidden="true"
                      />
                    </FramedArtwork>

                    <div className="flex flex-col items-center -space-y-0.5">
                    <span className="">
                      {person.name}
                    </span>
                    <span className="text-neutral-500">
                      {t(person.roleKey)}
                    </span>
                    </div>
                  </div>
                ),
            )}


              <div className="flex flex-col items-center text-center space-y-2">
                <FramedArtwork>
                  <Image
                    src={uemgPhoto}
                    alt={t("institutionAlt")}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </FramedArtwork>

                <div className="flex flex-col items-center -space-y-0.5">
                <span className="">
                  {t("institution")}
                </span>
                <span className="text-neutral-500">
                  {t("institutionLabel")}
                </span>
                </div>
              </div>

         </div>
        </header>

<div className="bg-white w-full h-screen"></div>

        <SidenoteProvider>
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div
              id="digest-content"
              className="col-span-1 space-y-6 lg:col-span-3"
            >
              <Content />
            </div>
          </div>
        </SidenoteProvider>

        <DownloadPdfLink label={t("downloadPdf")} note={t("downloadPdfNote")} />
      </main>

      <Outline containerId="digest-content" />
    </div>
  );
}
