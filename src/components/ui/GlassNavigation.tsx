import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, ArrowUpRight } from "lucide-react";
import { config } from "../../config";
import { useTheme } from "../../hooks/useTheme";

interface GlassNavigationProps {
  onSectionSelect?: (sectionId: string) => void;
  compactMobileHeader?: boolean;
}

/**
 * Follows the strict 1-row, 3-zone Top Bar Contract:
 * Zone 1: Single text element wordmark (Narasimha Manam)
 * Zone 2: 5 concise single-line navigation links
 * Zone 3: Theme toggle + Primary Resume action
 */
export const GlassNavigation = ({
  onSectionSelect,
  compactMobileHeader = false,
}: GlassNavigationProps) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    if (!isHome) return;
    e.preventDefault();
    if (onSectionSelect) {
      onSectionSelect(sectionId);
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      const lenis = (window as unknown as { lenis?: { scrollTo: (el: HTMLElement, opts?: object) => void } }).lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(target, { offset: -68, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className="top-nav-header glass-surface glass-over-canvas"
      style={
        compactMobileHeader
          ? { position: "relative", height: "56px" }
          : undefined
      }
    >
      {/* Zone 1: Brand Wordmark (single text element, no badges or subtitles) */}
      <Link to="/" className="nav-brand-wordmark">
        {config.developer.fullName}
      </Link>

      {/* Zone 2: 5 Single-Line Navigation Links */}
      {!compactMobileHeader && (
        <nav className="nav-links-zone" aria-label="Primary navigation">
          {isHome ? (
            <>
              <a
                href="#work"
                onClick={(e) => handleAnchorClick(e, "work")}
                className="nav-link-item"
              >
                Projects
              </a>
              <a
                href="#capabilities"
                onClick={(e) => handleAnchorClick(e, "capabilities")}
                className="nav-link-item"
              >
                Capabilities
              </a>
              <a
                href="#experience"
                onClick={(e) => handleAnchorClick(e, "experience")}
                className="nav-link-item"
              >
                Experience
              </a>
              <a
                href="#contact"
                onClick={(e) => handleAnchorClick(e, "contact")}
                className="nav-link-item"
              >
                Contact
              </a>
            </>
          ) : (
            <Link to="/" className="nav-link-item">
              Overview
            </Link>
          )}
          <Link
            to="/myworks"
            className="nav-link-item"
            aria-current={location.pathname === "/myworks" ? "page" : undefined}
          >
            Archive
          </Link>
          <Link
            to="/play"
            className="nav-link-item"
            aria-current={location.pathname === "/play" ? "page" : undefined}
          >
            Chess Arena
          </Link>
        </nav>
      )}

      {/* Zone 3: Theme Toggle + Primary Action */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
          title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          className="btn-secondary"
          style={{
            minWidth: "44px",
            minHeight: "44px",
            padding: "0.5rem 0.75rem",
          }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>
            {theme === "light" ? "Dark" : "Light"}
          </span>
        </button>

        <a
          href={config.developer.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ minHeight: "40px", padding: "0.5rem 1rem" }}
        >
          <span>Resume</span>
          <ArrowUpRight size={15} />
        </a>
      </div>
    </header>
  );
};
