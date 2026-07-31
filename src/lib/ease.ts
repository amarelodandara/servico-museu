export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (progress: number) => number {
  const axis = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;

  return (progress) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;

    let low = 0;
    let high = 1;
    let t = progress;
    for (let i = 0; i < 24; i += 1) {
      t = (low + high) / 2;
      if (axis(t, x1, x2) < progress) low = t;
      else high = t;
    }
    return axis(t, y1, y2);
  };
}

export const EASE_IN_OUT = cubicBezier(0.77, 0, 0.175, 1);
