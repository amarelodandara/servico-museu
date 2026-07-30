export type BookEntry = {
  title: string;
  author: string;
  year: string;
  /** Which panorama field the work belongs to; picks the cover's accent. */
  field: "museology" | "serviceDesign" | "informationDesign" | "intersection";
  /** Path to a real cover image under public/, once gathered. */
  cover?: string;
};

const FIELD_COLOR: Record<BookEntry["field"], string> = {
  museology: "var(--fig-pink)",
  serviceDesign: "var(--fig-yellow)",
  informationDesign: "var(--fig-magenta)",
  intersection: "var(--fig-ink)",
};

/**
 * Horizontal scroll-snap shelf of the core bibliography. Until the real
 * cover assets are gathered (user TODO), each work gets a typographic
 * placeholder cover accented with its panorama-field color, framed like the
 * site's other artworks.
 */
export function BookCarousel({ books }: { books: BookEntry[] }) {
  return (
    <div className="my-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
      {books.map((book) => (
        <div
          key={book.title}
          className="paspateur-bg w-36 shrink-0 snap-start rounded-sm p-2.5 inset-shadow-sm inset-shadow-blue-50 inset-ring inset-ring-gray-200"
        >
          <div className="relative flex aspect-[2/3] flex-col overflow-hidden bg-[var(--fig-card)] shadow-xs shadow-gray-200">
            {book.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.cover}
                alt={`${book.title} — ${book.author}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <>
                <div
                  aria-hidden="true"
                  className="h-8 shrink-0"
                  style={{ backgroundColor: FIELD_COLOR[book.field] }}
                />
                <div className="flex flex-1 flex-col justify-between p-2.5 text-neutral-900">
                  <span className="text-[0.8rem] leading-snug font-bold text-balance">
                    {book.title}
                  </span>
                  <span className="font-lato text-[0.65rem] text-neutral-500">
                    {book.author}
                    <br />
                    {book.year}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
