import { useEffect, useRef } from "react";

interface MagneticCursorProps {
  disabled?: boolean;
}

/**
 * Calm, precision magnetic cursor ring for DesktopExperience.
 * On-demand rAF loop: only runs while pointer is actively moving and settles to idle.
 */
export const MagneticCursor = ({ disabled = false }: MagneticCursorProps) => {
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;
    if (
      document.documentElement.getAttribute("data-software-gl") === "true" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const el = ringRef.current;
    if (!el) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHovered = false;
    let rafId = 0;
    let running = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      const scale = isHovered ? 1.45 : 1;
      el.style.transform = `translate3d(${currentX - 14}px, ${currentY - 14}px, 0) scale(${scale})`;
      el.style.borderColor = isHovered
        ? "var(--accent-primary)"
        : "var(--border-strong)";

      if (Math.hypot(targetX - currentX, targetY - currentY) > 0.25) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const interactive = (e.target as HTMLElement | null)?.closest(
        "a, button, input, textarea, select, [role='button']"
      );
      isHovered = Boolean(interactive);
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        border: "1px solid var(--border-strong)",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate3d(-100px, -100px, 0)",
        transition: "border-color 150ms ease",
      }}
    />
  );
};
