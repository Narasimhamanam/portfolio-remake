import { useState } from "react";
import { Layers } from "lucide-react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

/**
 * Zero-Broken-Image resilient media frame.
 * Renders the image with referrerPolicy="no-referrer" and falls back to a calm
 * architectural surface with the item's title if the asset fails to load.
 */
export const SmartImage = ({
  src,
  alt,
  className = "",
  aspectRatio = "16 / 10",
  priority = false,
}: SmartImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`media-frame ${className}`}
      style={{ aspectRatio }}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="media-fallback" role="img" aria-label={alt}>
          <Layers size={24} style={{ color: "var(--accent-primary)", marginBottom: "8px" }} />
          <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
            {alt}
          </span>
        </div>
      )}
    </div>
  );
};
