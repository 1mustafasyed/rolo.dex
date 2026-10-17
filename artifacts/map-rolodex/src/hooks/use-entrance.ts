import { useCallback, useEffect, useRef, useState } from "react";

export const ENTRANCE_TIMING = {
  // The rust layer starts the cascade; the welcome artwork animates while its
  // pane rises, then the route stroke immediately starts the upward exit.
  rust: 200,
  rustFinish: 120,
  paneRise: 600,
  reveal: 500,
  exit: 900,
  animationGrace: 100,
} as const;

export type EntranceStage =
  | "none"
  | "rust-enter"
  | "welcome-enter"
  | "welcome-reveal"
  | "welcome-exit";

// Holds begin after React commits the visible stage. Animations advance on their
// actual completion; bounded watchdogs also recover if the browser drops an event.
export function useEntrance() {
  const [stage, setStage] = useState<EntranceStage>("none");
  const [reducedMotion, setReducedMotion] = useState(false);
  const revealStartedAt = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const start = useCallback(() => {
    setStage("rust-enter");
  }, []);
  const cancel = useCallback(() => {
    setStage("none");
  }, []);
  const completeAnimation = useCallback((expected: EntranceStage) => {
    setStage((current) => {
      if (current !== expected) return current;
      if (current === "rust-enter") return "welcome-enter";
      if (current === "welcome-enter") return "welcome-reveal";
      if (current === "welcome-reveal") return "welcome-exit";
      if (current === "welcome-exit") return "none";
      return current;
    });
  }, []);

  useEffect(() => {
    let duration: number;
    let advance: () => void;
    if (stage !== "none") {
      if (stage === "welcome-enter") revealStartedAt.current = Date.now();
      // Text/artwork already animate during entry. Only wait for the remaining
      // reveal time, not another full reveal after the pane reaches the top.
      const revealRemaining = Math.max(
        0,
        ENTRANCE_TIMING.reveal - (Date.now() - revealStartedAt.current),
      );
      const animationDuration =
        stage === "rust-enter"
          ? ENTRANCE_TIMING.rust
          : stage === "welcome-enter"
            ? ENTRANCE_TIMING.paneRise
            : stage === "welcome-reveal"
              ? revealRemaining
              : ENTRANCE_TIMING.exit;
      duration = reducedMotion
        ? 0
        : animationDuration + ENTRANCE_TIMING.animationGrace;
      advance = () => completeAnimation(stage);
    } else return;
    const timer = window.setTimeout(advance, duration);
    return () => window.clearTimeout(timer);
  }, [stage, reducedMotion, completeAnimation]);

  return { stage, reducedMotion, start, cancel, completeAnimation };
}
