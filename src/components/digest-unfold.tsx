"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function DigestUnfold({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [unfolded, setUnfolded] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setUnfolded(true);
        observer.disconnect();
      },
      { rootMargin: "-20% 0px -20% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      tabIndex={-1}
      data-unfolded={unfolded}
      className={`digest-unfold ${className}`}
    >
      {children}
    </div>
  );
}
