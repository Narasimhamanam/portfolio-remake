import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { config, Project } from "../config";
import {
  ProjectDomainFilter,
  filterProjects,
} from "../utils/portfolioLogic";
import { GlassNavigation } from "../components/ui/GlassNavigation";
import { SmartImage } from "../components/ui/SmartImage";
import { ProjectCaseModal } from "../components/ui/ProjectCaseModal";
import { ContactFooterSection } from "../components/sections/ContactFooterSection";
import "./MyWorks.css";

const MyWorks = () => {
  const [domainFilter, setDomainFilter] = useState<ProjectDomainFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = filterProjects(
    config.projects,
    domainFilter,
    searchQuery
  );

  return (
    <div className="app-root myworks-page-shell">
      <GlassNavigation />

      <main
        id="main-content"
        className="section-shell"
        style={{
          paddingTop: "calc(var(--header-height) + var(--space-8))",
          maxWidth: "var(--container-wide)",
        }}
      >
        {/* Top Breadcrumb & Title */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <Link
            to="/"
            className="btn-ghost"
            style={{
              paddingLeft: 0,
              marginBottom: "var(--space-3)",
              color: "var(--accent-primary)",
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Portfolio Overview</span>
          </Link>

          <span className="section-kicker">Complete Engineering Archive</span>
          <h1
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: 700,
              marginBottom: "var(--space-3)",
            }}
          >
            Systems, Research & Web Applications
          </h1>
          <p style={{ fontSize: "var(--text-base)", maxWidth: "65ch" }}>
            A comprehensive index of full-stack applications, multi-agent LLM
            architectures, computational research tools, and machine learning
            platforms engineered by {config.developer.fullName}.
          </p>
        </div>

        {/* Interactive Filter & Search Toolbar */}
        <div
          className="glass-surface myworks-toolbar"
          style={{
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "var(--space-8)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div
            className="segmented-control"
            role="group"
            aria-label="Filter archive by category"
            style={{ overflowX: "auto", maxWidth: "100%" }}
          >
            {(
              [
                { id: "all", label: `All Works (${config.projects.length})` },
                { id: "featured", label: "Featured (4)" },
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

          <div
            style={{
              position: "relative",
              minWidth: "min(100%, 280px)",
              flex: "0 1 320px",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by technology, title, or capability..."
              aria-label="Search projects"
              style={{
                width: "100%",
                minHeight: "42px",
                padding: "0.5rem 0.875rem 0.5rem 2.25rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-strong)",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                fontSize: "var(--text-xs)",
              }}
            />
          </div>
        </div>

        {/* Project Archive Grid */}
        {filteredProjects.length === 0 ? (
          <div
            className="elevated-card"
            style={{
              padding: "var(--space-10)",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "0.5rem" }}>
              No matching projects found
            </h2>
            <p style={{ fontSize: "var(--text-sm)", marginBottom: "1rem" }}>
              Try clearing your search filter or selecting “All Works”.
            </p>
            <button
              type="button"
              onClick={() => {
                setDomainFilter("all");
                setSearchQuery("");
              }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="myworks-archive-grid">
            {filteredProjects.map((project, index) => {
              const liveUrl = project.link || project.liveDemo;
              return (
                <article
                  key={project.id}
                  className="elevated-card myworks-archive-card"
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div className="meta-inline">
                        <span>0{index + 1}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{project.category}</span>
                        <span className="meta-sep" aria-hidden="true">·</span>
                        <span>{project.year}</span>
                      </div>
                      {project.featured && (
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            fontFamily: "var(--font-mono)",
                            color: "var(--accent-primary)",
                            fontWeight: 600,
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>

                    <div
                      onClick={() => setSelectedProject(project)}
                      style={{ cursor: "pointer", marginBottom: "1rem" }}
                    >
                      <SmartImage
                        src={project.image}
                        alt={project.title}
                        aspectRatio="16 / 9"
                        priority={index < 3}
                      />
                    </div>

                    <h2
                      style={{
                        fontSize: "var(--text-xl)",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {project.title}
                    </h2>

                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        lineHeight: 1.65,
                        marginBottom: "1rem",
                      }}
                    >
                      {project.description}
                    </p>

                    <div style={{ marginBottom: "1.25rem" }}>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Key Capabilities
                      </div>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "grid",
                          gap: "0.35rem",
                        }}
                      >
                        {project.capabilities.slice(0, 4).map((cap, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "0.45rem",
                              fontSize: "var(--text-xs)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <CheckCircle2
                              size={14}
                              style={{
                                color: "var(--accent-sage)",
                                flexShrink: 0,
                                marginTop: "0.18rem",
                              }}
                            />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--border-hairline)",
                    }}
                  >
                    <div className="meta-inline" style={{ marginBottom: "0.875rem" }}>
                      {project.techList.map((tech, tIdx) => (
                        <span key={tech}>
                          {tIdx > 0 && (
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
                        style={{ minHeight: "42px", padding: "0.5rem 1rem" }}
                      >
                        <Layers size={15} />
                        <span>Case Study</span>
                      </button>

                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{ minHeight: "42px", padding: "0.5rem 1rem" }}
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight size={15} />
                        </a>
                      )}

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost"
                          style={{ minHeight: "42px", padding: "0.5rem 0.85rem" }}
                        >
                          <FaGithub size={15} />
                          <span>Repository</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <ContactFooterSection />

      <ProjectCaseModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default MyWorks;
