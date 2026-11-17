import { useEffect } from "react";
import { X, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Project } from "../../config";
import { SmartImage } from "./SmartImage";

interface ProjectCaseModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectCaseModal = ({ project, onClose }: ProjectCaseModalProps) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const liveUrl = project.link || project.liveDemo;

  return (
    <div
      className="case-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="case-modal-panel">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <div className="meta-inline" style={{ marginBottom: "0.35rem" }}>
              <span>{project.category}</span>
              <span className="meta-sep" aria-hidden="true">·</span>
              <span>{project.year}</span>
            </div>
            <h2
              id="case-study-modal-title"
              style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project case study"
            className="btn-ghost"
            style={{ minWidth: "44px", minHeight: "44px", padding: "0.5rem" }}
          >
            <X size={20} />
          </button>
        </div>

        <SmartImage
          src={project.image}
          alt={`${project.title} interface preview`}
          aspectRatio="16 / 9"
        />

        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1.25rem" }}>
          <div>
            <h3
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.35rem",
              }}
            >
              Overview
            </h3>
            <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.65 }}>
              {project.description}
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.35rem",
              }}
            >
              System Architecture
            </h3>
            <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.65 }}>
              {project.architectureSummary}
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              Key Engineering Capabilities
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "0.5rem",
              }}
            >
              {project.capabilities.map((cap, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <CheckCircle2
                    size={16}
                    style={{
                      color: "var(--accent-sage)",
                      flexShrink: 0,
                      marginTop: "0.2rem",
                    }}
                  />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-hairline)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div className="meta-inline">
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

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <span>Live Deployment</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <FaGithub size={16} />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
