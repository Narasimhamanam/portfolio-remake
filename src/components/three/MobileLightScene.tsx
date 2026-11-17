import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Compass, Sparkles } from "lucide-react";
import { ThemeMode, clampDevicePixelRatio } from "../../utils/portfolioLogic";

interface MobileLightSceneProps {
  theme: ThemeMode;
  prefersReducedMotion: boolean;
}

/**
 * Lightweight 3D scene tailored for MobileExperience:
 * - Low-poly 5-part geometric assembly
 * - DPR capped at <= 1.5 (1.0 on software WebGL)
 * - No expensive postprocessing or multi-pass transmission
 * - Optional gyroscope tilt ONLY when user explicitly grants permission
 */
export const MobileLightScene = ({
  theme,
  prefersReducedMotion,
}: MobileLightSceneProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const stateRef = useRef({
    theme,
    prefersReducedMotion,
    tiltX: 0,
    tiltY: 0,
    impulse: 0,
  });

  useEffect(() => {
    stateRef.current.theme = theme;
    stateRef.current.prefersReducedMotion = prefersReducedMotion;
  }, [theme, prefersReducedMotion]);

  const requestGyroPermission = async () => {
    try {
      const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof DeviceOrientationEventTyped.requestPermission === "function") {
        const res = await DeviceOrientationEventTyped.requestPermission();
        if (res === "granted") {
          setGyroEnabled(true);
        }
      } else {
        setGyroEnabled(true);
      }
    } catch {
      setGyroEnabled(false);
    }
  };

  useEffect(() => {
    if (!gyroEnabled) return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // [-90, 90]
      const beta = e.beta ?? 0;   // [-180, 180]
      stateRef.current.tiltX = THREE.MathUtils.clamp(gamma / 45, -1, 1);
      stateRef.current.tiltY = THREE.MathUtils.clamp((beta - 45) / 45, -1, 1);
    };
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [gyroEnabled]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isSoftwareGl = false;
    try {
      const probe = document.createElement("canvas").getContext("webgl");
      if (!probe) isSoftwareGl = true;
      else {
        const ext = probe.getExtension("WEBGL_debug_renderer_info");
        const gpu = String(
          probe.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER)
        );
        probe.getExtension("WEBGL_lose_context")?.loseContext();
        isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software/i.test(gpu);
      }
    } catch {
      isSoftwareGl = true;
    }

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 240;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: "low-power",
      preserveDrawingBuffer: isSoftwareGl,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(
      clampDevicePixelRatio({
        rawDpr: window.devicePixelRatio || 1,
        mode: "mobile",
        isSoftwareGl,
      })
    );
    renderer.setSize(width, height);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.3, 4.6);

    const hemi = new THREE.HemisphereLight(0xd4e0ec, 0xe5e0d8, 1.15);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xfff6ea, 1.45);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    // 5-Part Low-Poly Mobile Sculpture
    const group = new THREE.Group();
    scene.add(group);

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x5b7c99,
      metalness: 0.65,
      roughness: 0.3,
    });
    const sageMat = new THREE.MeshStandardMaterial({
      color: 0x8fa89b,
      metalness: 0.35,
      roughness: 0.55,
    });

    const coreGeo = new THREE.OctahedronGeometry(0.72, 0);
    const coreMesh = new THREE.Mesh(coreGeo, steelMat);
    group.add(coreMesh);

    const ring1Geo = new THREE.TorusGeometry(1.15, 0.04, 12, 36);
    const ring1 = new THREE.Mesh(ring1Geo, sageMat);
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(0.92, 0.03, 12, 32);
    const ring2 = new THREE.Mesh(ring2Geo, steelMat);
    ring2.rotation.x = Math.PI / 2.5;
    group.add(ring2);

    const capGeo = new THREE.ConeGeometry(0.32, 0.38, 6);
    const topCap = new THREE.Mesh(capGeo, sageMat);
    topCap.position.y = 1.05;
    group.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, sageMat);
    bottomCap.rotation.z = Math.PI;
    bottomCap.position.y = -1.05;
    group.add(bottomCap);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const renderFrame = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1) || 0.016;
      const elapsed = isSoftwareGl ? 1.1 : clock.getElapsedTime();
      const st = stateRef.current;

      steelMat.color.setHex(st.theme === "dark" ? 0x7899b8 : 0x5b7c99);
      st.impulse = isSoftwareGl
        ? 0
        : THREE.MathUtils.damp(st.impulse, 0, 3.5, dt);

      const motion = st.prefersReducedMotion ? 0.08 : 1;
      group.rotation.y = elapsed * 0.32 * motion + st.tiltX * 0.6 + st.impulse;
      group.rotation.x =
        Math.sin(elapsed * 0.5) * 0.12 * motion + st.tiltY * 0.4;
      ring1.rotation.x = elapsed * 0.45 * motion;
      ring2.rotation.y = -elapsed * 0.5 * motion;

      const s = 1 + st.impulse * 0.18;
      coreMesh.scale.setScalar(s);

      renderer.render(scene, camera);
    };

    const tick = () => {
      if (disposed) return;
      renderFrame();
      if (!isSoftwareGl) {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      coreGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      capGeo.dispose();
      steelMat.dispose();
      sageMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "240px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-hairline)",
        background:
          "radial-gradient(circle at 50% 40%, var(--accent-steel-soft), transparent 70%), var(--bg-canvas-subtle)",
        overflow: "hidden",
      }}
    >
      <div
        ref={mountRef}
        onClick={() => {
          stateRef.current.impulse = 1.2;
          setTapCount((c) => c + 1);
        }}
        data-testid="mobile-3d-canvas"
        style={{ width: "100%", height: "100%" }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "12px",
          right: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={() => {
            stateRef.current.impulse = 1.2;
            setTapCount((c) => c + 1);
          }}
          className="btn-secondary"
          style={{
            minHeight: "44px",
            padding: "0.4rem 0.85rem",
            fontSize: "var(--text-xs)",
          }}
        >
          <Sparkles size={14} />
          <span>Tap Pulse {tapCount > 0 ? `(${tapCount})` : ""}</span>
        </button>

        {!gyroEnabled && (
          <button
            type="button"
            onClick={requestGyroPermission}
            className="btn-secondary"
            style={{
              minHeight: "44px",
              padding: "0.4rem 0.85rem",
              fontSize: "var(--text-xs)",
            }}
          >
            <Compass size={14} />
            <span>Enable Tilt</span>
          </button>
        )}
      </div>
    </div>
  );
};
