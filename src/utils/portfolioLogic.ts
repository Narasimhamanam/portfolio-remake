import { Project } from "../config";

export type ThemeMode = "light" | "dark";
export type ExperienceMode = "desktop" | "mobile";
export type ProjectDomainFilter = "all" | "featured" | "ai" | "ml" | "fullstack";

export const THEME_STORAGE_KEY = "nm-portfolio-theme";
export const DESKTOP_MEDIA_QUERY = "(pointer: fine) and (min-width: 1024px)";

/**
 * Pure determination of whether the viewport/input environment qualifies for DesktopExperience.
 * Tablets (coarse pointer or width < 1024px) always receive MobileExperience.
 */
export function resolveExperienceMode(params: {
  width: number;
  hasFinePointer: boolean;
}): ExperienceMode {
  if (params.width >= 1024 && params.hasFinePointer) {
    return "desktop";
  }
  return "mobile";
}

/**
 * Resolves the active theme from saved preference or OS prefers-color-scheme fallback.
 * Defaults to 'light' (#F4F2EE warm off-white) when neither is dark.
 */
export function resolveInitialTheme(
  savedTheme: string | null | undefined,
  systemPrefersDark: boolean
): ThemeMode {
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }
  return systemPrefersDark ? "dark" : "light";
}

/**
 * Toggles between light and dark theme modes.
 */
export function getNextTheme(current: ThemeMode): ThemeMode {
  return current === "light" ? "dark" : "light";
}

/**
 * Clamps device pixel ratio according to performance budgets:
 * - Software WebGL: 1.0
 * - Mobile experience: <= 1.5
 * - Desktop experience: <= 2.0
 */
export function clampDevicePixelRatio(params: {
  rawDpr: number;
  mode: ExperienceMode;
  isSoftwareGl?: boolean;
}): number {
  if (params.isSoftwareGl) return 1;
  const safeRaw = Number.isFinite(params.rawDpr) && params.rawDpr > 0 ? params.rawDpr : 1;
  const maxDpr = params.mode === "desktop" ? 2 : 1.5;
  return Math.min(safeRaw, maxDpr);
}

/**
 * Filters projects by domain/featured tab and search query.
 */
export function filterProjects(
  projects: Project[],
  domainFilter: ProjectDomainFilter,
  searchQuery = ""
): Project[] {
  const q = searchQuery.trim().toLowerCase();
  return projects.filter((project) => {
    if (domainFilter === "featured" && !project.featured) return false;
    if (
      (domainFilter === "ai" || domainFilter === "ml" || domainFilter === "fullstack") &&
      project.domain !== domainFilter
    ) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      project.title,
      project.category,
      project.technologies,
      project.description,
      ...project.capabilities,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/**
 * Formats flat chess move history into numbered turn pairs for tabular display.
 */
export interface MoveHistoryEntry {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  san: string;
}

export interface FormattedMovePair {
  moveNum: number;
  white: string;
  black: string;
}

export function formatChessMovePairs(moves: MoveHistoryEntry[]): FormattedMovePair[] {
  const pairs: FormattedMovePair[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      moveNum: Math.floor(i / 2) + 1,
      white: moves[i]?.san || "",
      black: moves[i + 1]?.san || "",
    });
  }
  return pairs;
}

/**
 * Calculates material balance from captured piece arrays (standard centipawn/pawn weights).
 */
const PIECE_WEIGHTS: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export function calculateMaterialAdvantage(
  capturedByWhite: string[],
  capturedByBlack: string[]
): { whiteScore: number; blackScore: number; netWhite: number } {
  const sumPieces = (arr: string[]) =>
    arr.reduce((acc, p) => acc + (PIECE_WEIGHTS[p.toLowerCase()] ?? 0), 0);
  const whiteScore = sumPieces(capturedByWhite);
  const blackScore = sumPieces(capturedByBlack);
  return {
    whiteScore,
    blackScore,
    netWhite: whiteScore - blackScore,
  };
}

/**
 * Validates contact form fields without silently substituting fallback values.
 */
export function validateContactForm(input: {
  name: string;
  email: string;
  message: string;
}): { valid: boolean; error: string } {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) {
    return { valid: false, error: "Please enter your name." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  if (!message || message.length < 8) {
    return { valid: false, error: "Please enter a message (at least 8 characters)." };
  }
  return { valid: true, error: "" };
}
