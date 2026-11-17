import { useEffect, useState } from "react";
import {
  DESKTOP_MEDIA_QUERY,
  ExperienceMode,
  resolveExperienceMode,
} from "../utils/portfolioLogic";

/**
 * Selects DesktopExperience vs MobileExperience at runtime using
 * matchMedia("(pointer: fine) and (min-width: 1024px)") — never user-agent sniffing.
 * Handles window resize and orientation changes cleanly.
 */
export function useExperienceMode(): {
  mode: ExperienceMode;
  prefersReducedMotion: boolean;
} {
  const [mode, setMode] = useState<ExperienceMode>(() => {
    if (typeof window === "undefined") return "desktop";
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    return resolveExperienceMode({
      width: window.innerWidth,
      hasFinePointer: finePointer,
    });
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const desktopMq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const pointerMq = window.matchMedia("(pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const nextMode = resolveExperienceMode({
        width: window.innerWidth,
        hasFinePointer: pointerMq.matches,
      });
      setMode(nextMode);
      setPrefersReducedMotion(motionMq.matches);
    };

    evaluate();

    desktopMq.addEventListener("change", evaluate);
    pointerMq.addEventListener("change", evaluate);
    motionMq.addEventListener("change", evaluate);
    window.addEventListener("resize", evaluate, { passive: true });
    window.addEventListener("orientationchange", evaluate, { passive: true });

    return () => {
      desktopMq.removeEventListener("change", evaluate);
      pointerMq.removeEventListener("change", evaluate);
      motionMq.removeEventListener("change", evaluate);
      window.removeEventListener("resize", evaluate);
      window.removeEventListener("orientationchange", evaluate);
    };
  }, []);

  return { mode, prefersReducedMotion };
}
