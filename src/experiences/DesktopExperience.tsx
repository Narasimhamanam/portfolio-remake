import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowUpRight,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { config, Project } from "../config";
import { useTheme } from "../hooks/useTheme";
import {
  ProjectDomainFilter,
  filterProjects,
} from "../utils/portfolioLogic";
import { GlassNavigation } from "../components/ui/GlassNavigation";
import { MagneticCursor } from "../components/ui/MagneticCursor";
import { SmartImage } from "../components/ui/SmartImage";
import { ProjectCaseModal } from "../components/ui/ProjectCaseModal";
import { DesktopStudioScene } from "../components/three/DesktopStudioScene";
import { ContactFooterSection } from "../components/sections/ContactFooterSection";

gsap.registerPlugin(ScrollTrigger);

interface DesktopExperienceProps {
  prefersReducedMotion: boolean;
}

export const DesktopExperience = ({
  prefersReducedMotion,
}: DesktopExperienceProps) => {
  const { theme } = useTheme();
  const scrollProgressRef = useRef<number>(0);
  const horizontalTrackRef = useRef<HTMLDivElement | null>(null);
  const [domainFilter, setDomainFilter] = useState<ProjectDomainFilter>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const featuredProjects = config.projects.filter((p) => p.featured);
  const secondaryProjects = filterProjects(config.projects, domainFilter);

  // Initialize Lenis smooth scroll & GSAP ScrollTrigger progress choreography
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (document.documentElement.getAttribute("data-software-gl") === "true") {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on("scroll", (e: { progress?: number }) => {
      scrollProgressRef.current = e.progress ?? 0;
      ScrollTrigger.update();
    });

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Reveal animations for sections
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  const scrollHorizontalShowcase = (direction: "prev" | "next") => {
    const nextIdx =
      direction === "next"
        ? Math.min(featuredProjects.length - 1, activeSlideIndex + 1)
        : Math.max(0, activeSlideIndex - 1);
    setActiveSlideIndex(nextIdx);
    const track = horizontalTrackRef.current;
    if (track) {
      const cardWidth = 540;
      track.scrollTo({
        left: nextIdx * cardWidth,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <div id="top" className="app-root" data-experience="desktop">
      <MagneticCursor disabled={prefersReducedMotion} />
      <GlassNavigation />

      <main id="main-content" style={{ paddingTop: "var(--header-height)" }}>
        {/* ===================================================================
            HERO SECTION: Split-Screen Typographic Hierarchy + 3D Studio Canvas
            =================================================================== */}
        <section
          aria-labelledby="hero-heading"
          style={{
            width: "100%",
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            padding: "var(--space-8) var(--space-6) var(--space-10)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(420px, 1fr) minmax(500px, 1.15fr)",
              gap: "var(--space-8)",
              alignItems: "stretch",
              minHeight: "560px",
            }}
          >
            {/* Left Column: Editorial Hierarchy & Primary Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "var(--space-4) 0",
              }}
            >
              <div>
                <div className="meta-inline" style={{ marginBottom: "var(--space-4)" }}>
                  <span>Full Stack Developer</span>
                  <span className="meta-sep" aria-hidden="true">·</span>
                  <span>Generative AI Engineer</span>
                  <span className="meta-sep" aria-hidden="true">·</span>
                  <span>Guntur, India</span>
                </div>

                <h1
                  id="hero-heading"
                  style={{
                    fontSize: "var(--text-display)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.08,
                    marginBottom: "var(--space-5)",
                  }}
                >
                  Architecting{" "}
                  <span className="font-serif-accent" style={{ fontWeight: 400 }}>
                    intelligent
                  </span>{" "}
                  systems & spatial web interfaces.
                </h1>

                <p
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--text-secondary)",
                    maxWidth: "56ch",
                    lineHeight: 1.65,
                    marginBottom: "var(--space-6)",
                  }}
                >
                  {config.developer.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <a href="#work" className="btn-primary">
                    <span>Featured Works</span>
                    <ArrowUpRight size={16} />
                  </a>
                  <Link to="/play" className="btn-secondary">
                    <Crown size={16} />
                    <span>Chess Arena</span>
                  </Link>
                  <a
                    href={config.developer.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    <span>Resume PDF</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>

              {/* Portrait + Brief Academic Credibility Strip */}
              <div
                className="glass-surface"
                style={{
                  marginTop: "var(--space-8)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                }}
              >
                <img
                  src={config.developer.portrait}
                  alt={config.developer.fullName}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-md)",
                    objectFit: "cover",
                    border: "1px solid var(--border-strong)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {config.about.headline}
                  </div>
                  <div className="meta-inline" style={{ marginTop: "2px" }}>
                    <span>R.V.R & J.C College of Engineering</span>
                    <span className="meta-sep" aria-hidden="true">·</span>
                    <span>CGPA 9.41 / 10.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D WebGL Studio Scene */}
            <div style={{ minHeight: "560px", display: "flex" }}>
              <DesktopStudioScene
                theme={theme}
                scrollProgressRef={scrollProgressRef}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </div>

          {/* Full-Width 4-Column Verified Academic & Engineering Strip */}
          <div
            style={{
              marginTop: "var(--space-8)",
              paddingTop: "var(--space-6)",
              borderTop: "1px solid var(--border-hairline)",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--space-6)",
            }}
          >
            {config.about.highlights.map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="font-mono-tabular"
                  style={{
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="hairline-divider" />

        {/* ===================================================================
            01. FEATURED WORKS: Horizontal Showcase + Case Study Modal
            Features ADAM-1 Enhanced, Simha AI, ResumePilot, Smart Loan
            =================================================================== */}
        <section
          id="work"
          aria-labelledby="featured-works-heading"
          className="section-shell gsap-reveal"
          style={{ maxWidth: "var(--container-wide)" }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <div>
              <span className="section-kicker">01. Selected Engineering Case Studies</span>
              <h2 id="featured-works-heading" className="section-heading">
                Featured Systems & Platforms
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => scrollHorizontalShowcase("prev")}
                aria-label="Previous featured project"
                className="btn-secondary"
                style={{ minWidth: "44px", padding: "0.5rem" }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontalShowcase("next")}
                aria-label="Next featured project"
                className="btn-secondary"
                style={{ minWidth: "44px", padding: "0.5rem" }}
              >
                <ChevronRight size={18} />
              </button>
              <Link to="/myworks" className="btn-ghost">
                <span>All {config.projects.length} Works</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* Horizontal Showcase Track for Primary 4 Featured Projects */}
          <div
            ref={horizontalTrackRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(480px, 1fr))",
              gap: "var(--space-6)",
              overflowX: "auto",
              paddingBottom: "var(--space-4)",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "thin",
            }}
          >
            {featuredProjects.map((project, index) => {
              const liveUrl = project.link || project.liveDemo;
              return (
                <article
                  key={project.id}
                  className="elevated-card"
                  style={{
                    padding: "var(--space-5)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    scrollSnapAlign: "start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      <div className="meta-inline">
                        <span>0{index + 1}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{project.category}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{project.year}</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedProject(project)}
                      style={{ cursor: "pointer", marginBottom: "var(--space-4)" }}
                    >
                      <SmartImage
                        src={project.image}
                        alt={project.title}
                        aspectRatio="16 / 9"
                        priority={index < 2}
                      />
                    </div>

                    <h3
                      style={{
                        fontSize: "var(--text-xl)",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {project.title}
                    </h3>

                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        lineHeight: 1.65,
                        marginBottom: "var(--space-4)",
                      }}
                    >
                      {project.description}
                    </p>

                    <ul
                      style={{
                        margin: "0 0 var(--space-4) 0",
                        paddingLeft: "1.1rem",
                        fontSize: "var(--text-xs)",
                        color: "var(--text-secondary)",
                        display: "grid",
                        gap: "0.3rem",
                      }}
                    >
                      {project.capabilities.slice(0, 3).map((cap, i) => (
                        <li key={i}>{cap}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      paddingTop: "var(--space-4)",
                      borderTop: "1px solid var(--border-hairline)",
                    }}
                  >
                    <div className="meta-inline" style={{ marginBottom: "var(--space-3)" }}>
                      {project.techList.map((tech, idx) => (
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

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="btn-primary"
                        style={{ minHeight: "40px", padding: "0.45rem 0.95rem" }}
                      >
                        <Layers size={15} />
                        <span>Inspect Architecture</span>
                      </button>

                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{ minHeight: "40px", padding: "0.45rem 0.95rem" }}
                        >
                          <span>Live / Demo</span>
                          <ArrowUpRight size={15} />
                        </a>
                      )}

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost"
                          style={{ minHeight: "40px", padding: "0.45rem 0.85rem" }}
                        >
                          <FaGithub size={15} />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Complete Repository Directory & Secondary Projects Filter */}
          <div style={{ marginTop: "var(--space-10)" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "var(--space-5)",
              }}
            >
              <div>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>
                  Complete Engineering Index ({secondaryProjects.length})
                </h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  Filter across featured systems and secondary repository projects (NeuroXAI, CineSnap, 3D Portfolio).
                </p>
              </div>

              <div className="segmented-control" role="group" aria-label="Filter projects by domain">
                {(
                  [
                    { id: "all", label: "All Works" },
                    { id: "featured", label: "Featured" },
                    { id: "ai", label: "Generative AI" },
                    { id: "ml", label: "Machine Learning" },
                    { id: "fullstack", label: "Full-Stack" },
                  ] as { id: ProjectDomainFilter; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDomainFilter(tab.id)}
                    aria-pressed={domainFilter === tab.id}
                    className={`segmented-btn ${domainFilter === tab.id ? "active" : ""}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--space-5)",
              }}
            >
              {secondaryProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="elevated-card"
                  style={{
                    padding: "var(--space-4)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "var(--space-3)",
                  }}
                >
                  <div>
                    <div className="meta-inline" style={{ marginBottom: "0.35rem" }}>
                      <span>{proj.category}</span>
                      <span className="meta-sep" aria-hidden="true">·</span>
                      <span>{proj.year}</span>
                    </div>
                    <h4 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "0.35rem" }}>
                      {proj.title}
                    </h4>
                    <p style={{ fontSize: "var(--text-xs)", lineHeight: 1.55 }}>
                      {proj.description}
                    </p>
                  </div>

                  <div
                    style={{
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--border-hairline)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProject(proj)}
                      className="btn-ghost"
                      style={{ minHeight: "34px", padding: "0.25rem 0.6rem", fontSize: "var(--text-xs)" }}
                    >
                      <span>Case Study</span>
                      <ArrowUpRight size={13} />
                    </button>

                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ minHeight: "34px", padding: "0.25rem 0.6rem", fontSize: "var(--text-xs)" }}
                    >
                      <FaGithub size={14} />
                      <span>Repository</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="hairline-divider" />

        {/* ===================================================================
            02. CAPABILITIES & TECHNICAL STACK ARCHITECTURE
            =================================================================== */}
        <section
          id="capabilities"
          aria-labelledby="capabilities-heading"
          className="section-shell gsap-reveal"
        >
          <span className="section-kicker">02. Technical Architecture & Domains</span>
          <h2
            id="capabilities-heading"
            className="section-heading"
            style={{ marginBottom: "var(--space-6)" }}
          >
            Engineering Capabilities & Verified Stack
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "var(--space-6)",
              marginBottom: "var(--space-8)",
            }}
          >
            {[config.skills.develop, config.skills.design].map((pillar, idx) => (
              <div
                key={pillar.title}
                className="glass-surface"
                style={{
                  padding: "var(--space-6)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div className="meta-inline" style={{ marginBottom: "0.5rem" }}>
                  <span>0{idx + 1}</span>
                  <span className="meta-sep" aria-hidden="true">·</span>
                  <span>{pillar.description}</span>
                </div>
                <h3
                  style={{
                    fontSize: "var(--text-xl)",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.65,
                    marginBottom: "var(--space-5)",
                  }}
                >
                  {pillar.details}
                </p>

                <div
                  style={{
                    paddingTop: "var(--space-4)",
                    borderTop: "1px solid var(--border-hairline)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Verified Technologies & Frameworks
                  </div>
                  <div className="meta-inline" style={{ color: "var(--text-primary)" }}>
                    {pillar.tools.map((tool, tIdx) => (
                      <span key={tool}>
                        {tIdx > 0 && (
                          <span className="meta-sep" aria-hidden="true">
                            {" · "}
                          </span>
                        )}
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Core Focus Areas from config.about.interests */}
          <div
            className="elevated-card"
            style={{
              padding: "var(--space-6)",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-4)",
            }}
          >
            {config.about.interests.map((interest, idx) => (
              <div
                key={interest}
                style={{
                  padding: "var(--space-3)",
                  borderBottom: idx < 3 ? "1px solid var(--border-hairline)" : "none",
                }}
              >
                <div
                  className="font-mono-tabular"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--accent-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  0{idx + 1}. Focus Area
                </div>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {interest}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="hairline-divider" />

        {/* ===================================================================
            03. EXPERIENCE, EDUCATION & CREDENTIALS
            =================================================================== */}
        <section
          id="experience"
          aria-labelledby="experience-heading"
          className="section-shell gsap-reveal"
        >
          <span className="section-kicker">03. Academic & Professional Trajectory</span>
          <h2
            id="experience-heading"
            className="section-heading"
            style={{ marginBottom: "var(--space-6)" }}
          >
            Experience, Education & Honors
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.35fr 0.85fr",
              gap: "var(--space-8)",
              alignItems: "start",
            }}
          >
            {/* Left: Chronological Experience & Education Timeline */}
            <div style={{ display: "grid", gap: "var(--space-4)" }}>
              {config.experiences.map((exp) => (
                <article
                  key={exp.id}
                  className="elevated-card"
                  style={{ padding: "var(--space-5)" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>
                      {exp.position}
                    </h3>
                    <span className="meta-inline">
                      <span>{exp.period}</span>
                      <span className="meta-sep" aria-hidden="true">·</span>
                      <span>{exp.type}</span>
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--accent-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {exp.company} · {exp.location}
                  </div>

                  <p style={{ fontSize: "var(--text-sm)", marginBottom: "0.75rem" }}>
                    {exp.description}
                  </p>

                  <ul
                    style={{
                      margin: "0 0 0.75rem 0",
                      paddingLeft: "1.1rem",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-secondary)",
                      display: "grid",
                      gap: "0.25rem",
                    }}
                  >
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>

                  <div className="meta-inline">
                    {exp.technologies.map((tech, idx) => (
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
                </article>
              ))}
            </div>

            {/* Right: Verified Certifications & Leadership */}
            <div style={{ display: "grid", gap: "var(--space-5)" }}>
              <div
                className="glass-surface"
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <Award size={18} style={{ color: "var(--accent-primary)" }} />
                  <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>
                    Verified Certifications
                  </h3>
                </div>

                <div style={{ display: "grid", gap: "0.875rem" }}>
                  {config.certifications.map((cert) => (
                    <div
                      key={cert.title}
                      style={{
                        paddingBottom: "0.875rem",
                        borderBottom: "1px solid var(--border-hairline)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {cert.title}
                      </div>
                      <div className="meta-inline" style={{ marginTop: "2px" }}>
                        <span>{cert.issuer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="glass-surface"
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <BookOpen size={18} style={{ color: "var(--accent-sage)" }} />
                  <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>
                    Leadership & Communities
                  </h3>
                </div>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.1rem",
                    display: "grid",
                    gap: "0.625rem",
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {config.activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>

              <div
                className="elevated-card"
                style={{ padding: "var(--space-5)" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Briefcase size={16} style={{ color: "var(--accent-primary)" }} />
                  <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700 }}>
                    Academic Standing
                  </h3>
                </div>
                <p style={{ fontSize: "var(--text-xs)", lineHeight: 1.6 }}>
                  {config.about.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            04. CONTACT & FOOTER
            =================================================================== */}
        <ContactFooterSection />
      </main>

      <ProjectCaseModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default DesktopExperience;
