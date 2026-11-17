import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Layers,
  Home,
  Briefcase,
  Cpu,
  Crown,
  Mail,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { config, Project } from "../config";
import { useTheme } from "../hooks/useTheme";
import { GlassNavigation } from "../components/ui/GlassNavigation";
import { SmartImage } from "../components/ui/SmartImage";
import { ProjectCaseModal } from "../components/ui/ProjectCaseModal";
import { MobileLightScene } from "../components/three/MobileLightScene";
import { ContactFooterSection } from "../components/sections/ContactFooterSection";

interface MobileExperienceProps {
  prefersReducedMotion: boolean;
}

/**
 * Designed specifically for thumbs and mobile/tablet viewports:
 * - Single-column narrative
 * - Minimum 44px touch targets on all interactive controls
 * - Swipeable horizontal snap cards for Featured Works
 * - Lightweight 3D canvas (DPR <= 1.5, opt-in gyroscope tilt)
 * - Bottom glass navigation bar (56px height, well below the 15% mobile sticky cap;
 *   top header is non-sticky on mobile so only the bottom glass nav is fixed)
 */
export const MobileExperience = ({
  prefersReducedMotion,
}: MobileExperienceProps) => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<string>("top");

  const featuredProjects = config.projects.filter((p) => p.featured);
  const secondaryProjects = config.projects.filter((p) => !p.featured);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div
      id="top"
      className="app-root"
      data-experience="mobile"
      style={{ paddingBottom: "76px" }}
    >
      {/* Non-sticky compact top header so aggregate sticky height is strictly <= 15% */}
      <GlassNavigation
        compactMobileHeader
        onSectionSelect={(id) => scrollToSection(id)}
      />

      <main id="main-content">
        {/* Mobile Hero Section */}
        <section
          aria-labelledby="mobile-hero-heading"
          style={{ padding: "var(--space-5) var(--space-4)" }}
        >
          <div className="meta-inline" style={{ marginBottom: "var(--space-2)" }}>
            <span>Full Stack & Generative AI</span>
            <span className="meta-sep" aria-hidden="true">·</span>
            <span>CGPA 9.41</span>
          </div>

          <h1
            id="mobile-hero-heading"
            style={{
              fontSize: "clamp(1.85rem, 6vw, 2.5rem)",
              fontWeight: 700,
              lineHeight: 1.12,
              marginBottom: "var(--space-3)",
            }}
          >
            {config.developer.fullName}
          </h1>

          <p
            style={{
              fontSize: "var(--text-sm)",
              lineHeight: 1.6,
              marginBottom: "var(--space-4)",
            }}
          >
            {config.developer.description}
          </p>

          {/* Lightweight 3D Scene for Mobile */}
          <div style={{ marginBottom: "var(--space-4)" }}>
            <MobileLightScene
              theme={theme}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          {/* Thumb-Friendly Primary Actions (min 44px height) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.625rem",
              marginBottom: "var(--space-4)",
            }}
          >
            <button
              type="button"
              onClick={() => scrollToSection("work")}
              className="btn-primary"
              style={{ width: "100%", minHeight: "46px" }}
            >
              <span>View Projects</span>
              <ArrowUpRight size={16} />
            </button>

            <Link
              to="/play"
              className="btn-secondary"
              style={{ width: "100%", minHeight: "46px" }}
            >
              <Crown size={16} />
              <span>Chess Arena</span>
            </Link>
          </div>

          {/* Academic Highlights Card */}
          <div
            className="elevated-card"
            style={{
              padding: "var(--space-4)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <img
              src={config.developer.portrait}
              alt={config.developer.fullName}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "var(--radius-sm)",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>
                R.V.R & J.C College of Engineering
              </div>
              <div className="meta-inline">
                <span>B.Tech CSE (2023–2027)</span>
                <span className="meta-sep" aria-hidden="true">·</span>
                <span>CGPA 9.41</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="hairline-divider" />

        {/* Swipeable Featured Projects Section */}
        <section
          id="work"
          aria-labelledby="mobile-works-heading"
          style={{ padding: "var(--space-6) var(--space-4)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "var(--space-4)",
            }}
          >
            <div>
              <span className="section-kicker">01. Featured Systems</span>
              <h2 id="mobile-works-heading" style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
                Selected Works
              </h2>
            </div>
            <Link
              to="/myworks"
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: "var(--accent-primary)",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>All ({config.projects.length})</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Swipeable Horizontal Snap Cards */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-4)",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: "var(--space-3)",
              margin: "0 -1rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            {featuredProjects.map((project, index) => {
              const liveUrl = project.link || project.liveDemo;
              return (
                <article
                  key={project.id}
                  className="elevated-card"
                  style={{
                    minWidth: "85vw",
                    maxWidth: "340px",
                    scrollSnapAlign: "center",
                    padding: "var(--space-4)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div className="meta-inline" style={{ marginBottom: "0.5rem" }}>
                      <span>0{index + 1}</span>
                      <span className="meta-sep" aria-hidden="true">·</span>
                      <span>{project.category}</span>
                    </div>

                    <SmartImage
                      src={project.image}
                      alt={project.title}
                      aspectRatio="16 / 9"
                    />

                    <h3
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: 700,
                        marginTop: "0.75rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {project.title}
                    </h3>

                    <p style={{ fontSize: "var(--text-xs)", lineHeight: 1.55, marginBottom: "0.75rem" }}>
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="meta-inline" style={{ marginBottom: "0.75rem" }}>
                      {project.techList.slice(0, 4).map((tech, idx) => (
                        <span key={tech}>
                          {idx > 0 && (
                            <span className="meta-sep" aria-hidden="true">
                              {" · "}
                            </span>
                          )}
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="btn-primary"
                        style={{ flex: 1, minHeight: "44px", padding: "0.5rem" }}
                      >
                        <Layers size={15} />
                        <span>Details</span>
                      </button>

                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{ minHeight: "44px", padding: "0.5rem 0.75rem" }}
                          aria-label={`Open ${project.title}`}
                        >
                          <ArrowUpRight size={16} />
                        </a>
                      )}

                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ minHeight: "44px", padding: "0.5rem 0.75rem" }}
                        aria-label={`${project.title} GitHub repository`}
                      >
                        <FaGithub size={16} />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Secondary Repository Works */}
          <div style={{ marginTop: "var(--space-5)", display: "grid", gap: "0.75rem" }}>
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Additional Repository Projects
            </div>
            {secondaryProjects.map((proj) => (
              <div
                key={proj.id}
                className="elevated-card"
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 700 }}>
                    {proj.title}
                  </div>
                  <div className="meta-inline">
                    <span>{proj.category}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(proj)}
                  className="btn-secondary"
                  style={{ minHeight: "44px", padding: "0.4rem 0.75rem" }}
                >
                  <span>Inspect</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <hr className="hairline-divider" />

        {/* Capabilities & Skills Section */}
        <section
          id="capabilities"
          aria-labelledby="mobile-capabilities-heading"
          style={{ padding: "var(--space-6) var(--space-4)" }}
        >
          <span className="section-kicker">02. Technical Domains</span>
          <h2
            id="mobile-capabilities-heading"
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              marginBottom: "var(--space-4)",
            }}
          >
            Engineering Stack
          </h2>

          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {[config.skills.develop, config.skills.design].map((group) => (
              <div
                key={group.title}
                className="elevated-card"
                style={{ padding: "var(--space-4)" }}
              >
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "0.25rem" }}>
                  {group.title}
                </h3>
                <p style={{ fontSize: "var(--text-xs)", marginBottom: "0.75rem" }}>
                  {group.details}
                </p>
                <div className="meta-inline" style={{ color: "var(--text-primary)" }}>
                  {group.tools.map((tool, i) => (
                    <span key={tool}>
                      {i > 0 && (
                        <span className="meta-sep" aria-hidden="true">
                          {" · "}
                        </span>
                      )}
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="hairline-divider" />

        {/* Experience & Education Section */}
        <section
          id="experience"
          aria-labelledby="mobile-exp-heading"
          style={{ padding: "var(--space-6) var(--space-4)" }}
        >
          <span className="section-kicker">03. Trajectory</span>
          <h2
            id="mobile-exp-heading"
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              marginBottom: "var(--space-4)",
            }}
          >
            Experience & Education
          </h2>

          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            {config.experiences.map((exp) => (
              <div
                key={exp.id}
                className="elevated-card"
                style={{ padding: "var(--space-4)" }}
              >
                <div className="meta-inline" style={{ marginBottom: "0.25rem" }}>
                  <span>{exp.period}</span>
                  <span className="meta-sep" aria-hidden="true">·</span>
                  <span>{exp.company}</span>
                </div>
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "0.35rem" }}>
                  {exp.position}
                </h3>
                <p style={{ fontSize: "var(--text-xs)", lineHeight: 1.55 }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Footer */}
        <ContactFooterSection />
      </main>

      {/* Bottom Glass Navigation Bar for Thumbs (56px height = 6.6% of 844px viewport) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="glass-surface-strong glass-over-canvas"
        style={{
          position: "fixed",
          bottom: "10px",
          left: "12px",
          right: "12px",
          height: "56px",
          borderRadius: "var(--radius-pill)",
          zIndex: 200,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          alignItems: "center",
          padding: "0 6px",
        }}
      >
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          aria-label="Home section"
          className="btn-ghost"
          style={{
            minHeight: "44px",
            padding: "4px",
            flexDirection: "column",
            gap: "2px",
            fontSize: "10px",
            color: activeSection === "top" ? "var(--accent-primary)" : "var(--text-secondary)",
          }}
        >
          <Home size={16} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("work")}
          aria-label="Projects section"
          className="btn-ghost"
          style={{
            minHeight: "44px",
            padding: "4px",
            flexDirection: "column",
            gap: "2px",
            fontSize: "10px",
            color: activeSection === "work" ? "var(--accent-primary)" : "var(--text-secondary)",
          }}
        >
          <Layers size={16} />
          <span>Works</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("capabilities")}
          aria-label="Capabilities section"
          className="btn-ghost"
          style={{
            minHeight: "44px",
            padding: "4px",
            flexDirection: "column",
            gap: "2px",
            fontSize: "10px",
            color:
              activeSection === "capabilities"
                ? "var(--accent-primary)"
                : "var(--text-secondary)",
          }}
        >
          <Cpu size={16} />
          <span>Stack</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("experience")}
          aria-label="Experience section"
          className="btn-ghost"
          style={{
            minHeight: "44px",
            padding: "4px",
            flexDirection: "column",
            gap: "2px",
            fontSize: "10px",
            color:
              activeSection === "experience"
                ? "var(--accent-primary)"
                : "var(--text-secondary)",
          }}
        >
          <Briefcase size={16} />
          <span>Journey</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("contact")}
          aria-label="Contact section"
          className="btn-ghost"
          style={{
            minHeight: "44px",
            padding: "4px",
            flexDirection: "column",
            gap: "2px",
            fontSize: "10px",
            color:
              activeSection === "contact"
                ? "var(--accent-primary)"
                : "var(--text-secondary)",
          }}
        >
          <Mail size={16} />
          <span>Contact</span>
        </button>
      </nav>

      <ProjectCaseModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default MobileExperience;
