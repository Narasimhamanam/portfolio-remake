import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import { useExperienceMode } from "./hooks/useExperienceMode";
import "./App.css";

// Lazy-load DesktopExperience and MobileExperience so mobile never downloads the desktop 3D bundle
const DesktopExperience = lazy(() => import("./experiences/DesktopExperience"));
const MobileExperience = lazy(() => import("./experiences/MobileExperience"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));

const ExperienceLoadingFallback = ({ label }: { label: string }) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      backgroundColor: "var(--bg-canvas)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
    }}
  >
    <span>{label}</span>
  </div>
);

const PortfolioRouterSwitch = () => {
  const { mode, prefersReducedMotion } = useExperienceMode();

  return (
    <Suspense
      fallback={
        <ExperienceLoadingFallback
          label={
            mode === "desktop"
              ? "Initializing Spatial Studio..."
              : "Loading Mobile Portfolio..."
          }
        />
      }
    >
      {mode === "desktop" ? (
        <DesktopExperience prefersReducedMotion={prefersReducedMotion} />
      ) : (
        <MobileExperience prefersReducedMotion={prefersReducedMotion} />
      )}
    </Suspense>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioRouterSwitch />} />
          <Route
            path="/myworks"
            element={
              <Suspense
                fallback={
                  <ExperienceLoadingFallback label="Loading Engineering Archive..." />
                }
              >
                <MyWorks />
              </Suspense>
            }
          />
          <Route
            path="/play"
            element={
              <Suspense
                fallback={
                  <ExperienceLoadingFallback label="Initializing Chess Arena..." />
                }
              >
                <Play />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
