"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EASE_IN_OUT } from "@/lib/ease";

const MIN_MS = 450;
const MAX_MS = 900;
const PX_PER_MS = 2.2;

export function ScrollLink({
  targetId,
  className,
  children,
}: {
  targetId: string;
  className?: string;
  children: ReactNode;
}) {
  const frame = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const travel = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.getElementById(targetId);
    if (!target) return; // no target yet — the plain hash is a fine fallback
    event.preventDefault();

    const from = window.scrollY;
    const to = target.getBoundingClientRect().top + from;
    const distance = to - from;

    const land = () => {
      history.pushState(null, "", `#${targetId}`);
      target.focus({ preventScroll: true });
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced || Math.abs(distance) < 2) {
      window.scrollTo(0, to);
      land();
      return;
    }

    const duration = Math.min(
      MAX_MS,
      Math.max(MIN_MS, Math.abs(distance) / PX_PER_MS),
    );
    const started = performance.now();
    let cancelled = false;

    const yield_ = () => {
      cancelled = true;
    };
    const listen = (on: boolean) => {
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("wheel", yield_);
      window[method]("touchstart", yield_);
      window[method]("keydown", yield_);
    };

    const step = (now: number) => {
      if (cancelled) {
        listen(false);
        frame.current = null;
        return;
      }
      const progress = Math.min(1, (now - started) / duration);
      window.scrollTo(0, from + distance * EASE_IN_OUT(progress));

      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
        return;
      }
      listen(false);
      frame.current = null;
      land();
    };

    listen(true);
    frame.current = requestAnimationFrame(step);
  };

  return (
    <a href={`#${targetId}`} onClick={travel} className={className}>
      {children}
    </a>
  );
}
