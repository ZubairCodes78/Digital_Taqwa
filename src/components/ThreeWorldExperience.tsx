"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeWorldExperienceProps {
  currentStage: number; // 0 = Hero, 1 = Vision, 2 = Survey, 3 = Completion
  onSceneReady?: () => void;
}

export function ThreeWorldExperience({ currentStage, onSceneReady }: ThreeWorldExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const stageRef = useRef<number>(currentStage);

  // Keep ref in sync for animation loop
  useEffect(() => {
    stageRef.current = currentStage;
  }, [currentStage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1410, 0.038);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 9.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // ==========================================
    // MATERIALS SYSTEM
    // ==========================================

    const emeraldDark = new THREE.MeshStandardMaterial({
      color: 0x0f221a,
      roughness: 0.85,
      metalness: 0.15,
    });

    const emeraldTrim = new THREE.MeshStandardMaterial({
      color: 0x163428,
      roughness: 0.65,
      metalness: 0.3,
    });

    const champagneGold = new THREE.MeshStandardMaterial({
      color: 0xd6b56d,
      roughness: 0.3,
      metalness: 0.85,
      emissive: 0x544018,
      emissiveIntensity: 0.2,
    });

    const goldPathwayMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0x3d2f10,
      emissiveIntensity: 0.25,
    });

    // Helper: Build pointed Moorish / Islamic Arch
    function createIslamicArch(w: number, h: number, curvePeak: number) {
      const shape = new THREE.Shape();
      const hw = w / 2;
      const springH = h * 0.52;

      shape.moveTo(-hw, 0);
      shape.lineTo(-hw, springH);
      shape.bezierCurveTo(-hw, springH + curvePeak * 0.6, -hw * 0.2, h * 0.92, 0, h);
      shape.bezierCurveTo(hw * 0.2, h * 0.92, hw, springH + curvePeak * 0.6, hw, springH);
      shape.lineTo(hw, 0);
      shape.closePath();
      return shape;
    }

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ==========================================
    // 1. REFLECTIVE MARBLE FLOOR WITH GOLD AISLE
    // ==========================================

    const floorGeom = new THREE.PlaneGeometry(36, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x08120d,
      roughness: 0.25,
      metalness: 0.55,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.4, 0);
    floor.receiveShadow = true;
    worldGroup.add(floor);

    // Illuminated central golden walkway
    const aisleGeom = new THREE.PlaneGeometry(2.4, 38);
    const aisle = new THREE.Mesh(aisleGeom, goldPathwayMat);
    aisle.rotation.x = -Math.PI / 2;
    aisle.position.set(0, -2.39, 0);
    aisle.receiveShadow = true;
    worldGroup.add(aisle);

    // ==========================================
    // 2. GRAND ENTRANCE ARCHWAY (Z = 5.5)
    // ==========================================

    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, 5.5);

    const portalShape = createIslamicArch(4.4, 6.2, 2.2);
    const portalGeom = new THREE.ExtrudeGeometry(portalShape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    });
    portalGeom.center();
    const portalMesh = new THREE.Mesh(portalGeom, emeraldTrim);
    portalMesh.castShadow = true;
    portalMesh.receiveShadow = true;
    portalGroup.add(portalMesh);

    // Inner gold arch frame
    const innerShape = createIslamicArch(3.7, 5.3, 1.8);
    const innerGeom = new THREE.ExtrudeGeometry(innerShape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    innerGeom.center();
    const innerMesh = new THREE.Mesh(innerGeom, champagneGold);
    portalGroup.add(innerMesh);

    worldGroup.add(portalGroup);

    // ==========================================
    // 3. FLUTED COLONNADE ALONG THE SANCTUARY
    // ==========================================

    const colonnadeZ = [6.5, 4.0, 1.5, -1.0, -3.5];
    const colRadius = 0.18;
    const colH = 5.2;
    const columnGeom = new THREE.CylinderGeometry(colRadius, colRadius * 1.15, colH, 24);
    const capGeom = new THREE.CylinderGeometry(colRadius * 1.6, colRadius * 0.9, 0.35, 8);
    const baseGeom = new THREE.CylinderGeometry(colRadius * 1.2, colRadius * 1.8, 0.35, 8);

    colonnadeZ.forEach((z) => {
      [-2.6, 2.6].forEach((x) => {
        const col = new THREE.Mesh(columnGeom, emeraldTrim);
        col.position.set(x, 0.2, z);
        col.castShadow = true;

        const cap = new THREE.Mesh(capGeom, champagneGold);
        cap.position.set(x, 0.2 + colH / 2, z);

        const base = new THREE.Mesh(baseGeom, emeraldDark);
        base.position.set(x, 0.2 - colH / 2, z);

        worldGroup.add(col);
        worldGroup.add(cap);
        worldGroup.add(base);
      });
    });

    // ==========================================
    // 4. INNER SANCTUARY MIHRAB (Z = -4.5)
    // ==========================================

    const sanctuaryGroup = new THREE.Group();
    sanctuaryGroup.position.set(0, 0.4, -4.5);

    const mihrabShape = createIslamicArch(3.6, 5.4, 1.9);
    const mihrabGeom = new THREE.ExtrudeGeometry(mihrabShape, {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    mihrabGeom.center();
    const mihrabMesh = new THREE.Mesh(mihrabGeom, champagneGold);
    mihrabMesh.castShadow = true;
    sanctuaryGroup.add(mihrabMesh);

    worldGroup.add(sanctuaryGroup);

    // ==========================================
    // 5. CELESTIAL HORIZON: GLOWING HILAL & MASHBIYA
    // ==========================================

    const celestialGroup = new THREE.Group();
    celestialGroup.position.set(0, 2.6, -7.5);

    // Crescent Moon (Hilal)
    const moonShape = new THREE.Shape();
    moonShape.absarc(0, 0, 0.65, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0.24, 0.22, 0.54, 0, Math.PI * 2, true);
    moonShape.holes.push(hole);

    const moonGeom = new THREE.ExtrudeGeometry(moonShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
    });
    moonGeom.center();
    const moonMesh = new THREE.Mesh(moonGeom, champagneGold);
    moonMesh.rotation.z = 0.35;
    celestialGroup.add(moonMesh);

    // Radiant Golden Halo
    const haloGeom = new THREE.RingGeometry(0.75, 1.1, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd6b56d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    celestialGroup.add(halo);

    // Concentric 8-point geometric star rings
    const latticeGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const ringGeom = new THREE.TorusGeometry(1.4 + i * 0.9, 0.018, 8, 8);
      const ringMesh = new THREE.Mesh(ringGeom, champagneGold);
      ringMesh.position.set(0, 0, -0.4 - i * 0.3);
      ringMesh.rotation.z = (Math.PI / 8) * i;
      latticeGroup.add(ringMesh);
    }
    celestialGroup.add(latticeGroup);

    worldGroup.add(celestialGroup);

    // ==========================================
    // 6. ATMOSPHERIC GOLDEN PARTICLES (DUST MOTES)
    // ==========================================

    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 9 + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18 + 1;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: Math.random() * 0.0035 + 0.0018,
        z: (Math.random() - 0.5) * 0.002,
      });
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const pCanvas = document.createElement("canvas");
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(245, 222, 179, 1)");
      grad.addColorStop(0.35, "rgba(214, 181, 109, 0.7)");
      grad.addColorStop(1, "rgba(214, 181, 109, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.13,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xf5deb3,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ==========================================
    // 7. CINEMATIC LIGHTING
    // ==========================================

    const ambientLight = new THREE.AmbientLight(0x0e1c16, 1.6);
    scene.add(ambientLight);

    // Golden Sunlight beam
    const sunBeam = new THREE.DirectionalLight(0xf2dfb0, 3.4);
    sunBeam.position.set(5, 8, 4);
    sunBeam.castShadow = true;
    sunBeam.shadow.mapSize.width = 1024;
    sunBeam.shadow.mapSize.height = 1024;
    sunBeam.shadow.bias = -0.0005;
    scene.add(sunBeam);

    // Point lights along the sacred corridor
    const lightCorridor1 = new THREE.PointLight(0xd4af37, 2.8, 10);
    lightCorridor1.position.set(0, 2.2, 5.0);
    scene.add(lightCorridor1);

    const lightCorridor2 = new THREE.PointLight(0xd4af37, 3.2, 12);
    lightCorridor2.position.set(0, 2.5, -3.5);
    scene.add(lightCorridor2);

    const floorBounce = new THREE.PointLight(0x194535, 1.4, 9);
    floorBounce.position.set(0, -1.6, 1.5);
    scene.add(floorBounce);

    if (onSceneReady) onSceneReady();

    // ==========================================
    // CAMERA STATIONS DEFINITION
    // ==========================================

    const cameraStations = [
      // 0: Hero Introduction
      { pos: new THREE.Vector3(0, 0.6, 9.2), lookAt: new THREE.Vector3(0, 0.8, 3.0) },
      // 1: The Vision Sanctuary
      { pos: new THREE.Vector3(0, 1.1, 4.2), lookAt: new THREE.Vector3(0, 1.0, -1.0) },
      // 2: 3D Interactive Survey Chamber
      { pos: new THREE.Vector3(0, 1.3, -0.6), lookAt: new THREE.Vector3(0, 1.2, -5.2) },
      // 3: Completion / Sacred Dawn
      { pos: new THREE.Vector3(0, 2.1, -4.2), lookAt: new THREE.Vector3(0, 2.8, -8.5) },
    ];

    // ==========================================
    // INTERACTION & ANIMATION LOOP
    // ==========================================

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const currentLookAt = new THREE.Vector3(0, 0.8, 3.0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentIdx = Math.min(Math.max(stageRef.current, 0), cameraStations.length - 1);
      const station = cameraStations[currentIdx];

      // Smooth mouse interpolation
      if (!prefersReducedMotion) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;
      }

      // Smooth camera position interpolation
      const desiredPos = station.pos.clone();
      if (!prefersReducedMotion) {
        desiredPos.x += currentMouseX * 0.45;
        desiredPos.y += -currentMouseY * 0.3;
      }

      camera.position.lerp(desiredPos, 0.045);

      // Smooth camera lookAt interpolation
      currentLookAt.lerp(station.lookAt, 0.045);
      camera.lookAt(currentLookAt);

      // Celestial objects breathing animation
      celestialGroup.position.y = 2.6 + Math.sin(elapsedTime * 1.1) * 0.08;
      latticeGroup.children.forEach((c, idx) => {
        c.rotation.z += 0.0012 * (idx % 2 === 0 ? 1 : -1);
      });

      // Drift golden dust particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3] += Math.sin(elapsedTime * 0.8 + i) * 0.0012;

        if (positions[i * 3 + 1] > 6.0) {
          positions[i * 3 + 1] = -2.3;
          positions[i * 3] = (Math.random() - 0.5) * 16;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      portalGeom.dispose();
      innerGeom.dispose();
      columnGeom.dispose();
      capGeom.dispose();
      baseGeom.dispose();
      floorGeom.dispose();
      aisleGeom.dispose();
      mihrabGeom.dispose();
      moonGeom.dispose();
      haloGeom.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      pTex.dispose();
      emeraldDark.dispose();
      emeraldTrim.dispose();
      champagneGold.dispose();
      goldPathwayMat.dispose();
      floorMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSceneReady]);

  if (!webGLSupported) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-[#091510] via-[#10241B] to-[#19372D] overflow-hidden -z-10">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410] via-transparent to-black/70" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
}

