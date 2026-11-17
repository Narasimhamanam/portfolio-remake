import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DRACOLoader, GLTFLoader } from "three-stdlib";
import { ChevronDown, ChevronUp, Sparkles, Sliders, RotateCcw } from "lucide-react";
import { decryptFile } from "../Character/utils/decrypt";
import { ThemeMode, clampDevicePixelRatio } from "../../utils/portfolioLogic";

export type FinishPreset = "steel" | "glass" | "travertine";
export type CameraPreset = "atelier" | "isometric" | "closeup";
export type SubjectMode = "kinetic" | "avatar";

interface DesktopStudioSceneProps {
  theme: ThemeMode;
  scrollProgressRef: React.MutableRefObject<number>;
  prefersReducedMotion: boolean;
}

// Pre-allocated math scratch objects outside the render loop (Zero GC)
const _tempMatrix = new THREE.Matrix4();
const _tempPos = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();
const _tempScale = new THREE.Vector3();
const _tempColor = new THREE.Color();
const _raycaster = new THREE.Raycaster();
const _pointerNdc = new THREE.Vector2();

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const rendererStr = String(gl.getParameter(param));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return true;
  }
}

export const DesktopStudioScene = ({
  theme,
  scrollProgressRef,
  prefersReducedMotion,
}: DesktopStudioSceneProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Interactive HUD state stored in refs so WebGL canvas never tears down on UI state change
  const [finish, setFinish] = useState<FinishPreset>("steel");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("atelier");
  const [exploded, setExploded] = useState<number>(0.15);
  const [subjectMode, setSubjectMode] = useState<SubjectMode>("kinetic");
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(0);

  const stateRef = useRef({
    theme,
    finish,
    cameraPreset,
    exploded,
    subjectMode,
    prefersReducedMotion,
    impulseEnergy: 0,
  });

  useEffect(() => {
    stateRef.current.theme = theme;
    stateRef.current.finish = finish;
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.exploded = exploded;
    stateRef.current.subjectMode = subjectMode;
    stateRef.current.prefersReducedMotion = prefersReducedMotion;
    (window as unknown as { __requestDesktop3DRender?: () => void }).__requestDesktop3DRender?.();
  }, [theme, finish, cameraPreset, exploded, subjectMode, prefersReducedMotion]);

  const triggerPhysicsImpulse = () => {
    stateRef.current.impulseEnergy = 1.35;
    setPulseCount((c) => c + 1);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    if (isSoftwareGl) {
      document.documentElement.setAttribute("data-software-gl", "true");
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: isSoftwareGl,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      clampDevicePixelRatio({
        rawDpr: window.devicePixelRatio || 1,
        mode: "desktop",
        isSoftwareGl,
      })
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initialBgHex = stateRef.current.theme === "dark" ? 0x0e1116 : 0xf4f2ee;
    scene.fog = new THREE.FogExp2(initialBgHex, 0.042);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 6.6);

    // Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xd4e0ec, 0xe5e0d8, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.85);
    keyLight.position.set(4.2, 6.5, 4.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    const d = 4.2;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7899b8, 1.1);
    rimLight.position.set(-4.5, 3.2, -3.8);
    scene.add(rimLight);

    // Procedural Brushed Metal Bump Texture
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 128;
    bumpCanvas.height = 128;
    const bCtx = bumpCanvas.getContext("2d");
    if (bCtx) {
      bCtx.fillStyle = "#808080";
      bCtx.fillRect(0, 0, 128, 128);
      for (let y = 0; y < 128; y += 2) {
        const shade = 115 + ((y * 7) % 26);
        bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
        bCtx.fillRect(0, y, 128, 1);
      }
    }
    const brushedBump = new THREE.CanvasTexture(bumpCanvas);
    brushedBump.wrapS = THREE.RepeatWrapping;
    brushedBump.wrapT = THREE.RepeatWrapping;
    brushedBump.repeat.set(4, 4);
    brushedBump.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Shared PBR Materials
    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: 0x5b7c99,
      metalness: 0.86,
      roughness: 0.22,
      bumpMap: brushedBump,
      bumpScale: 0.008,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
    });

    const secondaryMat = new THREE.MeshStandardMaterial({
      color: 0x8fa89b,
      metalness: 0.45,
      roughness: 0.52,
    });

    const coreCrystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xdbe6f0,
      metalness: 0.1,
      roughness: 0.12,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.65 : 1,
      ior: 1.52,
      thickness: 1.2,
      clearcoat: 1,
    });

    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xe4e0d8,
      metalness: 0.08,
      roughness: 0.82,
    });

    // =========================================================================
    // COMPOSITE 9-PART ARCHITECTURAL KINETIC INSTRUMENT (THREE.Group)
    // =========================================================================
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const kineticGroup = new THREE.Group();
    rootGroup.add(kineticGroup);

    // Part 1: Grounded Architectural Plinth Base (bottom-center pivot)
    const plinthGeo = new THREE.CylinderGeometry(1.55, 1.72, 0.24, 32);
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -1.65;
    plinthMesh.receiveShadow = true;
    kineticGroup.add(plinthMesh);

    // Part 2: Disjoint Soft Contact Shadow Disc (offset by +0.015 on Y to prevent Z-fighting)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 8, 64, 64, 60);
      grad.addColorStop(0, "rgba(20, 23, 28, 0.42)");
      grad.addColorStop(1, "rgba(20, 23, 28, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowDiscGeo = new THREE.CircleGeometry(2.1, 32);
    const shadowDiscMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = -1.515;
    kineticGroup.add(shadowDisc);

    // Part 3: Central Precision Core Octagonal Column
    const coreColumnGeo = new THREE.CylinderGeometry(0.42, 0.48, 1.45, 8);
    const coreColumn = new THREE.Mesh(coreColumnGeo, primaryMat);
    coreColumn.castShadow = true;
    coreColumn.receiveShadow = true;
    kineticGroup.add(coreColumn);

    // Part 4: Inner Optical Lens Polyhedron
    const lensGeo = new THREE.IcosahedronGeometry(0.58, 1);
    const lensMesh = new THREE.Mesh(lensGeo, coreCrystalMat);
    lensMesh.position.y = 0.15;
    lensMesh.renderOrder = 2;
    kineticGroup.add(lensMesh);

    // Part 5 & 6: Counter-Rotating Precision Gimbal Rings
    const outerRingGeo = new THREE.TorusGeometry(1.38, 0.045, 20, 64);
    const outerRing = new THREE.Mesh(outerRingGeo, primaryMat);
    outerRing.castShadow = true;
    kineticGroup.add(outerRing);

    const innerRingGeo = new THREE.TorusGeometry(1.02, 0.036, 16, 48);
    const innerRing = new THREE.Mesh(innerRingGeo, secondaryMat);
    innerRing.rotation.x = Math.PI / 3;
    innerRing.castShadow = true;
    kineticGroup.add(innerRing);

    // Part 7 & 8: Upper & Lower Crown Tensor Plates (expand on exploded slider)
    const crownGeo = new THREE.CylinderGeometry(0.76, 0.56, 0.16, 6);
    const upperCrown = new THREE.Mesh(crownGeo, secondaryMat);
    upperCrown.position.y = 0.88;
    upperCrown.castShadow = true;
    kineticGroup.add(upperCrown);

    const lowerCrown = new THREE.Mesh(crownGeo, secondaryMat);
    lowerCrown.rotation.z = Math.PI;
    lowerCrown.position.y = -0.88;
    lowerCrown.castShadow = true;
    kineticGroup.add(lowerCrown);

    // Part 9: 24 Instanced Orbital Data Nodes (InstancedMesh with per-instance scale & tint)
    const nodeCount = 24;
    const nodeGeo = new THREE.OctahedronGeometry(0.085, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.65,
      roughness: 0.28,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    const nodeBaseData: {
      angle: number;
      radius: number;
      yOffset: number;
      scale: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.68 + (i % 3) * 0.24;
      const yOffset = ((i % 5) - 2) * 0.32;
      const scale = 0.85 + ((i * 13) % 30) / 100; // ±15% variation
      const speed = 0.25 + (i % 4) * 0.08;
      nodeBaseData.push({ angle, radius, yOffset, scale, speed });

      _tempPos.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius
      );
      _tempQuat.setFromEuler(new THREE.Euler(angle, angle * 0.5, 0));
      _tempScale.setScalar(scale);
      _tempMatrix.compose(_tempPos, _tempQuat, _tempScale);
      instancedNodes.setMatrixAt(i, _tempMatrix);

      _tempColor.setHex(i % 2 === 0 ? 0x5b7c99 : 0x8fa89b);
      instancedNodes.setColorAt(i, _tempColor);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    if (instancedNodes.instanceColor) instancedNodes.instanceColor.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    instancedNodes.frustumCulled = false;
    kineticGroup.add(instancedNodes);

    // Interactive Physics-Driven Satellite Polyhedra (Respond to Click / Pointer Raycast)
    const interactables: THREE.Mesh[] = [
      coreColumn,
      lensMesh,
      outerRing,
      upperCrown,
      lowerCrown,
    ];

    // Optional Encrypted 3D Avatar Loader (from /models/character.enc)
    const avatarGroup = new THREE.Group();
    avatarGroup.visible = false;
    avatarGroup.position.set(0, -1.65, 0);
    avatarGroup.scale.setScalar(0.14);
    rootGroup.add(avatarGroup);

    let avatarLoaded = false;
    let avatarMixer: THREE.AnimationMixer | null = null;
    let avatarHeadBone: THREE.Object3D | null = null;

    const loadEncryptedAvatarIfNeeded = async () => {
      if (avatarLoaded) return;
      avatarLoaded = true;
      try {
        const decryptedBuffer = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([decryptedBuffer]));
        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        loader.setDRACOLoader(draco);
        loader.load(
          blobUrl,
          (gltf) => {
            const charScene = gltf.scene;
            avatarGroup.add(charScene);
            avatarHeadBone = charScene.getObjectByName("spine006") || null;
            if (gltf.animations && gltf.animations.length > 0) {
              avatarMixer = new THREE.AnimationMixer(charScene);
              const clip =
                gltf.animations.find((c) => c.name === "introAnimation") ||
                gltf.animations[0];
              if (clip) {
                const action = avatarMixer.clipAction(clip);
                action.play();
              }
            }
            draco.dispose();
            URL.revokeObjectURL(blobUrl);
          },
          undefined,
          () => {
            draco.dispose();
          }
        );
      } catch {
        // Fallback gracefully to kinetic sculpture if model fails
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer Parallax & Raycast Impulse
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseSmoothX = 0;
    let mouseSmoothY = 0;
    let currentExploded = stateRef.current.exploded;

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      mouseTargetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseTargetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(interactables, false);
      if (hits.length > 0) {
        stateRef.current.impulseEnergy = 1.4;
        setPulseCount((c) => c + 1);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    renderer.domElement.addEventListener("click", onCanvasClick);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Animation & On-Demand Software-WebGL Paced Loop
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext | null;
      if (!gl || typeof gl.fenceSync !== "function") {
        frameId = window.setTimeout(cb, 40);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 40);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const renderFrame = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1) || 0.016;
      const elapsed = isSoftwareGl ? 1.25 : clock.getElapsedTime();
      const st = stateRef.current;
      const scrollP = scrollProgressRef.current || 0;

      // Sync Theme Colors smoothly
      const isDark = st.theme === "dark";
      const targetFogHex = isDark ? 0x0e1116 : 0xf4f2ee;
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(targetFogHex);
      }
      plinthMat.color.setHex(isDark ? 0x1d2430 : 0xe4e0d8);

      // Sync Material Finish Preset
      if (st.finish === "steel") {
        primaryMat.color.setHex(isDark ? 0x7899b8 : 0x5b7c99);
        primaryMat.metalness = 0.86;
        primaryMat.roughness = 0.22;
      } else if (st.finish === "glass") {
        primaryMat.color.setHex(isDark ? 0x9bb5ce : 0x8fa89b);
        primaryMat.metalness = 0.25;
        primaryMat.roughness = 0.12;
      } else {
        primaryMat.color.setHex(isDark ? 0x8b857c : 0xd6d0c4);
        primaryMat.metalness = 0.12;
        primaryMat.roughness = 0.68;
      }

      // Subject Toggle
      if (st.subjectMode === "avatar") {
        loadEncryptedAvatarIfNeeded();
        kineticGroup.visible = false;
        avatarGroup.visible = true;
        if (avatarMixer && !st.prefersReducedMotion) {
          avatarMixer.update(dt);
        }
        if (avatarHeadBone) {
          avatarHeadBone.rotation.y = THREE.MathUtils.damp(
            avatarHeadBone.rotation.y,
            mouseSmoothX * 0.45,
            6,
            dt
          );
          avatarHeadBone.rotation.x = THREE.MathUtils.damp(
            avatarHeadBone.rotation.x,
            -mouseSmoothY * 0.25,
            6,
            dt
          );
        }
      } else {
        kineticGroup.visible = true;
        avatarGroup.visible = false;
      }

      // Smoothly damp mouse & impulse energy
      mouseSmoothX = isSoftwareGl
        ? mouseTargetX
        : THREE.MathUtils.damp(mouseSmoothX, mouseTargetX, 5, dt);
      mouseSmoothY = isSoftwareGl
        ? mouseTargetY
        : THREE.MathUtils.damp(mouseSmoothY, mouseTargetY, 5, dt);
      st.impulseEnergy = isSoftwareGl
        ? 0
        : THREE.MathUtils.damp(st.impulseEnergy, 0, 3.2, dt);

      // Exploded view combines slider + scroll progress + physics impulse
      const targetExplode = Math.min(
        1,
        st.exploded + scrollP * 0.55 + st.impulseEnergy * 0.35
      );
      currentExploded = isSoftwareGl
        ? targetExplode
        : THREE.MathUtils.damp(currentExploded, targetExplode, 6, dt);

      // Camera Preset + Scroll-linked Camera Path + Mouse Parallax
      let baseCamX = 0.9;
      let baseCamY = 0.45;
      let baseCamZ = 6.2;

      if (st.cameraPreset === "isometric") {
        baseCamX = 2.6;
        baseCamY = 1.85;
        baseCamZ = 5.6;
      } else if (st.cameraPreset === "closeup") {
        baseCamX = 0.35;
        baseCamY = 0.25;
        baseCamZ = 4.25;
      }

      const scrollCamX = baseCamX + Math.sin(scrollP * Math.PI) * 1.1;
      const scrollCamY = baseCamY + scrollP * 0.65;
      const scrollCamZ = baseCamZ - Math.sin(scrollP * Math.PI * 0.5) * 0.7;

      if (isSoftwareGl) {
        camera.position.set(
          scrollCamX + mouseSmoothX * 0.42,
          scrollCamY + mouseSmoothY * 0.28,
          scrollCamZ
        );
      } else {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          scrollCamX + mouseSmoothX * 0.42,
          4.5,
          dt
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          scrollCamY + mouseSmoothY * 0.28,
          4.5,
          dt
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          scrollCamZ,
          4.5,
          dt
        );
      }
      camera.lookAt(0, 0.05, 0);

      // Kinetic Sculpture Transforms
      const motionFactor = st.prefersReducedMotion ? 0.1 : 1;
      const spinBoost = 1 + st.impulseEnergy * 3.5;

      kineticGroup.rotation.y =
        elapsed * 0.22 * motionFactor +
        scrollP * Math.PI * 1.25 +
        mouseSmoothX * 0.3;
      kineticGroup.rotation.x =
        Math.sin(elapsed * 0.4) * 0.06 * motionFactor + mouseSmoothY * 0.15;

      outerRing.rotation.x =
        elapsed * 0.35 * motionFactor * spinBoost + currentExploded * 0.6;
      outerRing.rotation.y = elapsed * 0.25 * motionFactor;
      innerRing.rotation.y = -elapsed * 0.48 * motionFactor * spinBoost;
      innerRing.rotation.z = elapsed * 0.3 * motionFactor;

      lensMesh.rotation.y = -elapsed * 0.4 * motionFactor;
      lensMesh.position.y =
        0.12 + Math.sin(elapsed * 1.4) * 0.06 * motionFactor;
      const lensScale = 1 + currentExploded * 0.22 + st.impulseEnergy * 0.12;
      lensMesh.scale.setScalar(lensScale);

      upperCrown.position.y = 0.86 + currentExploded * 0.68;
      lowerCrown.position.y = -0.86 - currentExploded * 0.68;
      coreColumn.scale.y = 1 - currentExploded * 0.22;

      for (let i = 0; i < nodeCount; i++) {
        const item = nodeBaseData[i];
        const a =
          item.angle + elapsed * item.speed * motionFactor + scrollP * 1.5;
        const r = item.radius + currentExploded * 0.78;
        const y =
          item.yOffset * (1 + currentExploded * 0.65) +
          Math.sin(elapsed * 1.2 + i) * 0.06 * motionFactor;
        _tempPos.set(Math.cos(a) * r, y, Math.sin(a) * r);
        _tempQuat.setFromEuler(
          new THREE.Euler(a * 0.5, a, elapsed * 0.4 * motionFactor)
        );
        _tempScale.setScalar(item.scale * (1 + st.impulseEnergy * 0.25));
        _tempMatrix.compose(_tempPos, _tempQuat, _tempScale);
        instancedNodes.setMatrixAt(i, _tempMatrix);
      }
      instancedNodes.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        renderFrame();
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    const tick = () => {
      if (disposed) return;
      renderFrame();
      frameId = requestAnimationFrame(tick);
    };

    const onScrollUpdate = () => {
      if (isSoftwareGl) requestRender();
    };
    window.addEventListener("scroll", onScrollUpdate, { passive: true });
    (window as unknown as { __requestDesktop3DRender?: () => void }).__requestDesktop3DRender =
      requestRender;

    if (isSoftwareGl) {
      renderFrame();
      requestRender();
    } else {
      tick();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScrollUpdate);
      renderer.domElement.removeEventListener("click", onCanvasClick);

      plinthGeo.dispose();
      shadowDiscGeo.dispose();
      coreColumnGeo.dispose();
      lensGeo.dispose();
      outerRingGeo.dispose();
      innerRingGeo.dispose();
      crownGeo.dispose();
      nodeGeo.dispose();

      brushedBump.dispose();
      shadowTex.dispose();
      envTexture.dispose();

      primaryMat.dispose();
      secondaryMat.dispose();
      coreCrystalMat.dispose();
      plinthMat.dispose();
      shadowDiscMat.dispose();
      nodeMat.dispose();

      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "540px",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        border: "1px solid var(--border-hairline)",
        background:
          "radial-gradient(circle at 60% 35%, var(--accent-steel-soft), transparent 68%), var(--bg-canvas-subtle)",
      }}
    >
      {/* Dedicated empty mount ref for Three.js WebGLRenderer */}
      <div
        ref={mountRef}
        data-testid="desktop-3d-canvas"
        style={{ width: "100%", height: "100%", minHeight: "540px" }}
      />

      {/* Top-Left Minimal Spec Label */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "18px",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span className="meta-inline">
          <span>WebGL PBR Studio</span>
          <span className="meta-sep" aria-hidden="true">·</span>
          <span>Click sculpture to impulse</span>
          {pulseCount > 0 && (
            <>
              <span className="meta-sep" aria-hidden="true">·</span>
              <span>Impulses: {pulseCount}</span>
            </>
          )}
        </span>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Single-Row, Zero Viewport Occlusion) */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(96%, 660px)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          aria-expanded={!dockCollapsed}
          aria-label={dockCollapsed ? "Show 3D scene controls" : "Hide 3D scene controls"}
          className="glass-surface glass-over-canvas"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "3px 12px",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            borderRadius: "var(--radius-pill)",
            marginBottom: dockCollapsed ? "0" : "6px",
            minHeight: "28px",
          }}
        >
          {dockCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          <span>{dockCollapsed ? "Show Controls" : "Hide Controls"}</span>
        </button>

        {!dockCollapsed && (
          <div
            className="glass-surface glass-over-canvas"
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            {/* Finish Swatches */}
            <div className="segmented-control" role="group" aria-label="3D Material Finish">
              {(["steel", "glass", "travertine"] as FinishPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFinish(preset)}
                  aria-pressed={finish === preset}
                  className={`segmented-btn ${finish === preset ? "active" : ""}`}
                  style={{ minHeight: "28px", padding: "2px 8px", fontSize: "11px" }}
                >
                  {preset === "steel"
                    ? "Steel"
                    : preset === "glass"
                    ? "Glass"
                    : "Stone"}
                </button>
              ))}
            </div>

            {/* Exploded View Slider */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                whiteSpace: "nowrap",
              }}
            >
              <Sliders size={12} />
              <span>Explode</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={exploded}
                aria-label="Exploded view separation"
                onChange={(e) => setExploded(parseFloat(e.target.value))}
                style={{ width: "54px", accentColor: "var(--accent-primary)" }}
              />
            </label>

            {/* Camera & Model Switch */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() =>
                  setCameraPreset((prev) =>
                    prev === "atelier"
                      ? "isometric"
                      : prev === "isometric"
                      ? "closeup"
                      : "atelier"
                  )
                }
                className="btn-ghost"
                style={{ minHeight: "28px", padding: "2px 8px", fontSize: "11px" }}
              >
                <RotateCcw size={12} />
                <span>{cameraPreset.charAt(0).toUpperCase() + cameraPreset.slice(1)}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setSubjectMode((prev) => (prev === "kinetic" ? "avatar" : "kinetic"))
                }
                className="btn-ghost"
                style={{ minHeight: "28px", padding: "2px 8px", fontSize: "11px" }}
              >
                <Sparkles size={12} />
                <span>{subjectMode === "kinetic" ? "Avatar" : "Kinetic"}</span>
              </button>

              <button
                type="button"
                onClick={triggerPhysicsImpulse}
                className="btn-primary"
                style={{ minHeight: "28px", padding: "2px 10px", fontSize: "11px" }}
              >
                <span>Impulse</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
