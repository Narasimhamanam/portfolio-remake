import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Copy,
  Check,
  Send,
  Mail,
  MapPin,
  FileText,
  Crown,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { config } from "../../config";
import { validateContactForm } from "../../utils/portfolioLogic";

export const ContactFooterSection = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formError, setFormError] = useState("");
  const [submittedNote, setSubmittedNote] = useState("");
  const [submittedEntries, setSubmittedEntries] = useState<
    { name: string; email: string; message: string; timestamp: string }[]
  >([]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(formData);
    if (!validation.valid) {
      setFormError(validation.error);
      setSubmittedNote("");
      return;
    }

    setFormError("");
    const entry = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setSubmittedEntries((prev) => [entry, ...prev]);
    setSubmittedNote(
      `Inquiry logged for ${config.contact.email}. You can also launch your email client directly below.`
    );
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <footer
      id="contact"
      className="section-shell"
      style={{
        borderTop: "1px solid var(--border-hairline)",
        paddingBottom: "var(--space-12)",
      }}
    >
      {/* Interactive Chess Arena Callout Banner */}
      <div
        className="glass-surface"
        style={{
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          marginBottom: "var(--space-10)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-5)",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <span className="section-kicker">Interactive WebAssembly Engine</span>
          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Challenge the Embedded Chess Engine
          </h2>
          <p style={{ fontSize: "var(--text-sm)" }}>
            Play a live standard chess match powered client-side by RedoxChess / Stockfish
            WebAssembly with real-time algebraic move history, board orientation controls,
            and material balance tracking.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link to="/play" className="btn-primary">
            <Crown size={16} />
            <span>Open Chess Arena</span>
            <ArrowUpRight size={16} />
          </Link>
          <Link to="/myworks" className="btn-secondary">
            <span>View Full Project Archive</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main Contact Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: "var(--space-8)",
          alignItems: "start",
        }}
      >
        {/* Column 1: Direct Contact & Coordinates */}
        <div>
          <span className="section-kicker">04. Initiate Dialogue</span>
          <h2 className="section-heading" style={{ marginBottom: "var(--space-4)" }}>
            Let’s build thoughtful software together.
          </h2>
          <p
            style={{
              fontSize: "var(--text-base)",
              marginBottom: "var(--space-6)",
              maxWidth: "48ch",
            }}
          >
            Available for full-stack engineering internships, generative AI research
            collaborations, and ambitious web engineering roles.
          </p>

          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div
              className="elevated-card"
              style={{
                padding: "var(--space-4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Mail size={18} style={{ color: "var(--accent-primary)" }} />
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Direct Email
                  </div>
                  <a
                    href={`mailto:${config.contact.email}`}
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {config.contact.email}
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn-secondary"
                aria-label="Copy email address"
                style={{ minHeight: "40px", padding: "0.4rem 0.85rem" }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span>{copied ? "Copied" : "Copy Email"}</span>
              </button>
            </div>

            <div
              className="elevated-card"
              style={{
                padding: "var(--space-4)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <MapPin size={18} style={{ color: "var(--accent-sage)" }} />
              <div>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Base Location
                </div>
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  {config.contact.location}
                </div>
              </div>
            </div>

            {/* Social & Resume Links */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.25rem" }}>
              <a
                href={config.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <FaGithub size={16} />
                <span>GitHub</span>
                <ArrowUpRight size={14} />
              </a>
              <a
                href={config.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <FaLinkedinIn size={16} />
                <span>LinkedIn</span>
                <ArrowUpRight size={14} />
              </a>
              <a
                href={config.developer.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <FileText size={16} />
                <span>Resume PDF</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Validated Contact Form */}
        <div
          className="glass-surface"
          style={{
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
          }}
        >
          <h3
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 600,
              marginBottom: "var(--space-4)",
            }}
          >
            Send a Direct Message
          </h3>

          <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label
                htmlFor="contact-name"
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.35rem",
                }}
              >
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Ada Lovelace"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-strong)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  fontSize: "var(--text-sm)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.35rem",
                }}
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="ada@analytical.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-strong)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  fontSize: "var(--text-sm)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                style={{
                  display: "block",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.35rem",
                }}
              >
                Project Brief or Inquiry
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Tell me about the system or product you are building..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-strong)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  fontSize: "var(--text-sm)",
                  resize: "vertical",
                }}
              />
            </div>

            {formError && (
              <div
                role="alert"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--status-danger)",
                  fontWeight: 600,
                }}
              >
                {formError}
              </div>
            )}

            {submittedNote && (
              <div
                role="status"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--status-positive)",
                  fontWeight: 600,
                }}
              >
                {submittedNote}
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <button type="submit" className="btn-primary">
                <Send size={15} />
                <span>Send Message</span>
              </button>
              <a
                href={`mailto:${config.contact.email}?subject=${encodeURIComponent(
                  `Portfolio Inquiry from ${formData.name || "Visitor"}`
                )}&body=${encodeURIComponent(formData.message)}`}
                className="btn-secondary"
              >
                <span>Open Mail Client</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </form>

          {submittedEntries.length > 0 && (
            <div
              style={{
                marginTop: "1.25rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                Recent Session Dispatches ({submittedEntries.length})
              </div>
              {submittedEntries.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    padding: "0.35rem 0",
                  }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>{item.name}</strong> (
                  {item.email}) · {item.timestamp}: “{item.message}”
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quiet Editorial Footer */}
      <div
        style={{
          marginTop: "var(--space-12)",
          paddingTop: "var(--space-5)",
          borderTop: "1px solid var(--border-hairline)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div className="meta-inline">
          <span>© {new Date().getFullYear()} {config.developer.fullName}</span>
          <span className="meta-sep" aria-hidden="true">·</span>
          <span>B.Tech CSE, R.V.R & J.C College of Engineering</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "var(--text-xs)" }}>
          <a href="#top" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            Back to top ↑
          </a>
          <Link to="/myworks" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            Archive
          </Link>
          <Link to="/play" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            Chess Arena
          </Link>
        </div>
      </div>
    </footer>
  );
};
