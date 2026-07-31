"use client";

import { useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import { FramedArtwork } from "@/components/contributors";
import { useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";

/**
 * The canvas the shader was composed on in the Paper builder. It defines
 * both the shader's world and the frame's aspect ratio, so the artwork
 * decides its own proportions and nothing gets cropped to fit a box.
 */
const WORLD = { width: 1280, height: 720 };

/** The wave's rate, running and stopped. */
const SPEED = { running: 0.5, held: 0 };

/**
 * The stop is springed rather than switched. Cutting `speed` to 0 on the
 * hover event halts the wave mid-stride, which reads as a dropped frame;
 * easing it down lets the motion carry its own weight into the stop, so the
 * wave settles the way something with mass does. Low stiffness and heavy
 * damping on purpose — this should feel like a wave being calmed, not
 * caught.
 */
const SETTLE = { stiffness: 55, damping: 22, mass: 1 };

/**
 * The digest's opening plate: a grain-gradient shader in the same recessed
 * frame as the contributor portraits.
 *
 * Colour, shape and the feel knobs come from the Paper builder and should be
 * edited there, then pasted back. Grain is a first-class uniform (`noise`),
 * not an overlay, so unlike `.photo-grain` it's part of the image rather
 * than a tile laid on top — which is why the frame's own film layer is
 * switched off.
 *
 * The wave runs on its own and stops under the pointer. Nothing else
 * responds: the composition never pans or scales, so what the reader looks
 * at while it's held is exactly the composition that was tuned. Stopping is
 * the whole interaction — it hands the image over to be read instead of
 * asking to be played with.
 *
 * `prefers-reduced-motion` holds it stopped permanently.
 */
export function HeroShader() {
  const reduceMotion = useReducedMotion();
  const springSpeed = useSpring(SPEED.running, SETTLE);

  /*
   * The shader takes a plain number, not a motion value, so the spring's
   * output has to cross back into React state to reach it. Committing every
   * spring frame would re-render this subtree at 60fps; rounding to two
   * decimals first means a render only happens when the value changes at
   * the precision the shader can act on, collapsing most frames into none.
   */
  const [speed, setSpeed] = useState(SPEED.running);
  useMotionValueEvent(springSpeed, "change", (value) => {
    const next = Math.round(value * 100) / 100;
    setSpeed((prev) => (prev === next ? prev : next));
  });

  const hold = () => springSpeed.set(SPEED.held);
  const resume = () => springSpeed.set(SPEED.running);

  return (
    /*
     * The portrait frame, reused verbatim — the recess is the same one the
     * contributor photographs sit in, just at the artwork's proportions.
     *
     * The box takes its ratio from the shader (WORLD), not the other way
     * round: the plate that was here before this existed was a 3:2
     * placeholder, and holding the shader to it would crop the composition.
     */
    <div onPointerEnter={hold} onPointerLeave={resume}>
      <FramedArtwork
        className="mx-auto w-11/12"
        style={{ aspectRatio: `${WORLD.width} / ${WORLD.height}` }}
        grain={false}
      >
        {/*
          Every value here is as tuned in the builder and stays fixed —
          `speed` is the only thing the reader touches.

          `worldWidth`/`worldHeight` are what keep the framing honest.
          Without them the pattern is drawn in pixel space, so a wider
          element shows *more* of the field rather than the same composition
          larger, and the framing would drift with the reading column's
          width. Pinning the world to the builder's canvas and fitting it
          means the element can be any size and still show the whole thing,
          at the proportions it was composed at.
        */}
        <GrainGradient
          width="100%"
          height="100%"
          fit="contain"
          worldWidth={WORLD.width}
          worldHeight={WORLD.height}
          colorBack="#d8e0e4"
          colors={["#0c78c6", "#beae60", "#d7cbc6"]}
          shape="wave"
          softness={0.59}
          intensity={0.37}
          noise={0.22}
          offsetX={-0.06}
          speed={reduceMotion ? SPEED.held : speed}
        />
      </FramedArtwork>
    </div>
  );
}
