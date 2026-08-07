export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="my-2 flex flex-col">
      <strong className="text-2xl font-semibold text-[var(--accent)]">
        {value}
      </strong>
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        {label}
      </span>
    </div>
  );
}
