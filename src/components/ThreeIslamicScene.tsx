"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ThreeIslamicScene({ fixed = false }: { fixed?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e1b15, 0.045);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = false;

    container.appendChild(renderer.domElement);

    // ==========================================
    // 3D ISLAMIC ARCHITECTURE (PROCEDURAL MESHES)
    // ==========================================

    const architectureGroup = new THREE.Group();
    scene.add(architectureGroup);

    // Materials
    const stoneDark = new THREE.MeshStandardMaterial({
      color: 0x142b23,
      roughness: 0.85,
      metalness: 0.1,
    });

    const stoneTrim = new THREE.MeshStandardMaterial({
      color: 0x1d3a30,
      roughness: 0.7,
      metalness: 0.2,
    });

    const goldAccent = new THREE.MeshStandardMaterial({
      color: 0xc4a468,
      roughness: 0.35,
      metalness: 0.8,
      emissive: 0x5a441e,
      emissiveIntensity: 0.15,
    });

    const goldGlow = new THREE.MeshBasicMaterial({
      color: 0xe8cf9b,
    });

    // Helper: Build a classic pointed Islamic Arch (Ogee / Moorish arch profile)
    function createIslamicArchShape(w: number, h: number, curvePeak: number) {
      const shape = new THREE.Shape();
      const hw = w / 2;
      const springHeight = h * 0.55;

      shape.moveTo(-hw, 0);
      shape.lineTo(-hw, springHeight);

      // Left arch curve
      shape.bezierCurveTo(
        -hw,
        springHeight + curvePeak * 0.6,
        -hw * 0.25,
        h * 0.9,
        0,
        h
      );

      // Right arch curve
      shape.bezierCurveTo(
        hw * 0.25,
        h * 0.9,
        hw,
        springHeight + curvePeak * 0.6,
        hw,
        springHeight
      );

      shape.lineTo(hw, 0);
      shape.closePath();
      return shape;
    }

    // Outer & Inner Archway (Mihrab Portal)
    const archH = 5.6;
    const archW = 3.6;
    const archShape = createIslamicArchShape(archW, archH, 2.0);

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const archGeom = new THREE.ExtrudeGeometry(archShape, extrudeSettings);
    archGeom.center();
    const outerArch = new THREE.Mesh(archGeom, stoneTrim);
    outerArch.position.set(0, 0.4, -1.2);
    outerArch.castShadow = true;
    outerArch.receiveShadow = true;
    architectureGroup.add(outerArch);

    // Inner Gold Arch outline
    const innerArchShape = createIslamicArchShape(archW * 0.84, archH * 0.84, 1.7);
    const innerArchGeom = new THREE.ExtrudeGeometry(innerArchShape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
    innerArchGeom.center();
    const innerArch = new THREE.Mesh(innerArchGeom, goldAccent);
    innerArch.position.set(0, 0.35, -1.0);
    architectureGroup.add(innerArch);

    // Columns on left and right
    const columnRadius = 0.16;
    const columnH = 4.8;
    const columnGeom = new THREE.CylinderGeometry(columnRadius, columnRadius * 1.15, columnH, 32);

    const capGeom = new THREE.CylinderGeometry(columnRadius * 1.6, columnRadius * 0.9, 0.35, 8);
    const baseGeom = new THREE.CylinderGeometry(columnRadius * 1.2, columnRadius * 1.8, 0.35, 8);

    [-2.2, 2.2].forEach((xPos) => {
      const col = new THREE.Mesh(columnGeom, stoneTrim);
      col.position.set(xPos, 0, -0.6);
      col.castShadow = true;

      const cap = new THREE.Mesh(capGeom, goldAccent);
      cap.position.set(xPos, columnH / 2, -0.6);

      const base = new THREE.Mesh(baseGeom, stoneDark);
      base.position.set(xPos, -columnH / 2, -0.6);

      architectureGroup.add(col);
      architectureGroup.add(cap);
      architectureGroup.add(base);
    });

    // Floor with subtle reflective stone
    const floorGeom = new THREE.PlaneGeometry(30, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d1c16,
      roughness: 0.35,
      metalness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.4;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floating Serene Crescent (Hilal) & Golden Light Disk
    const moonGroup = new THREE.Group();
    moonGroup.position.set(0, 2.1, -2.8);

    // Subtle crescent shape
    const crescentShape = new THREE.Shape();
    crescentShape.absarc(0, 0, 0.55, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0.2, 0.18, 0.46, 0, Math.PI * 2, true);
    crescentShape.holes.push(holePath);

    const crescentGeom = new THREE.ExtrudeGeometry(crescentShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
    });
    crescentGeom.center();
    const crescentMesh = new THREE.Mesh(crescentGeom, goldAccent);
    crescentMesh.rotation.z = 0.3;
    moonGroup.add(crescentMesh);

    // Glowing halo behind crescent
    const haloGeom = new THREE.RingGeometry(0.65, 0.85, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd6b56d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    moonGroup.add(halo);

    architectureGroup.add(moonGroup);

    // Subtle floating geometric lattice (Mashrabiya inspired 8-point star rings)
    const latticeGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const ringGeom = new THREE.TorusGeometry(1.2 + i * 0.9, 0.015, 8, 8);
      const ringMesh = new THREE.Mesh(ringGeom, goldAccent);
      ringMesh.position.set(0, 0.8, -3.2 - i * 0.6);
      ringMesh.rotation.z = (Math.PI / 8) * i;
      latticeGroup.add(ringMesh);
    }
    architectureGroup.add(latticeGroup);

    // ==========================================
    // FLOATING 3D SACRED ISLAMIC GEOMETRIC CRYSTALS
    // ==========================================
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    const octaGeom = new THREE.OctahedronGeometry(0.42, 0);
    const icosaGeom = new THREE.IcosahedronGeometry(0.35, 0);

    const crystalGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x423210,
      emissiveIntensity: 0.25,
    });

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffe8aa,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const crystalConfigs = [
      { geom: octaGeom, pos: [-3.4, 1.4, -1.8], rotSpeed: 0.008 },
      { geom: icosaGeom, pos: [3.4, -0.4, -2.2], rotSpeed: -0.007 },
      { geom: octaGeom, pos: [-2.8, -1.8, -1.2], rotSpeed: 0.009 },
      { geom: icosaGeom, pos: [2.9, 1.9, -2.6], rotSpeed: -0.006 },
      { geom: octaGeom, pos: [-1.8, 3.2, -3.2], rotSpeed: 0.007 },
      { geom: icosaGeom, pos: [1.8, 3.4, -3.2], rotSpeed: -0.008 },
    ];

    crystalConfigs.forEach((cfg) => {
      const mesh = new THREE.Mesh(cfg.geom, crystalGoldMat);
      const wire = new THREE.Mesh(cfg.geom, wireframeMat);
      wire.scale.setScalar(1.04);
      mesh.add(wire);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      crystalGroup.add(mesh);
    });

    // ==========================================
    // GOLDEN ATMOSPHERIC DUST PARTICLES
    // ==========================================

    const particleCount = 260;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8 + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: Math.random() * 0.004 + 0.002,
        z: (Math.random() - 0.5) * 0.003,
      });
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Circle texture for soft particles
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext("2d");
    if (pCtx) {
      const gradient = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(232, 214, 172, 1)");
      gradient.addColorStop(0.35, "rgba(214, 181, 109, 0.6)");
      gradient.addColorStop(1, "rgba(214, 181, 109, 0)");
      pCtx.fillStyle = gradient;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xf5deb3,
      opacity: 0.75,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ==========================================
    // LIGHTING SETUP
    // ==========================================

    // Ambient night/courtyard emerald fill
    const ambientLight = new THREE.AmbientLight(0x19372d, 1.4);
    scene.add(ambientLight);

    // Warm Golden Sunlight beam entering from upper right
    const sunBeam = new THREE.DirectionalLight(0xf2dfb0, 3.2);
    sunBeam.position.set(4, 7, 3);
    sunBeam.castShadow = true;
    sunBeam.shadow.mapSize.width = 1024;
    sunBeam.shadow.mapSize.height = 1024;
    sunBeam.shadow.bias = -0.0005;
    scene.add(sunBeam);

    // Golden Point light at the Mihrab arch
    const archLight = new THREE.PointLight(0xd4af37, 2.5, 9);
    archLight.position.set(0, 1.8, -1.8);
    scene.add(archLight);

    // Soft teal lower reflection light
    const floorBounce = new THREE.PointLight(0x285949, 1.2, 8);
    floorBounce.position.set(0, -1.5, 1);
    scene.add(floorBounce);

    setIsLoaded(true);

    // ==========================================
    // INTERACTION & ANIMATION LOOP
    // ==========================================

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle Resize
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
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // STRONG NEW-STYLE CINEMATIC DIRECTION ANIMATIONS
      // 1. Dynamic architectural emissive breathing
      goldAccent.emissiveIntensity = 0.22 + Math.sin(elapsedTime * 1.6) * 0.16;

      // 2. Dynamic sunlight & archlight pulse
      sunBeam.intensity = 3.2 + Math.sin(elapsedTime * 0.7) * 0.5;
      archLight.intensity = 2.6 + Math.cos(elapsedTime * 1.1) * 0.4;

      // 3. Celestial crescent floating with rhythmic tilt
      moonGroup.position.y = 2.15 + Math.sin(elapsedTime * 1.3) * 0.12;
      moonGroup.rotation.z = 0.25 + Math.sin(elapsedTime * 0.8) * 0.06;
      moonGroup.rotation.y = Math.cos(elapsedTime * 0.5) * 0.08;

      // 4. Multi-axis rotation on Mashrabiya star lattice rings
      latticeGroup.children.forEach((child, idx) => {
        child.rotation.z += (0.0018 + idx * 0.0006) * (idx % 2 === 0 ? 1 : -1);
        child.rotation.x = Math.sin(elapsedTime * 0.4 + idx) * 0.08;
      });

      // 5. Rotate floating 3D sacred geometry crystals
      crystalGroup.children.forEach((crystal, idx) => {
        const cfg = crystalConfigs[idx];
        if (cfg) {
          crystal.rotation.x += cfg.rotSpeed;
          crystal.rotation.y += cfg.rotSpeed * 1.25;
          crystal.position.y = cfg.pos[1] + Math.sin(elapsedTime * 1.4 + idx) * 0.15;
        }
      });

      // 6. Dynamic cinematic camera orbital track & scroll depth
      if (!prefersReducedMotion) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.045;
        currentMouseY += (targetMouseY - currentMouseY) * 0.045;
        currentScrollY += (targetScrollY - currentScrollY) * 0.04;

        const scrollRatio = Math.min(currentScrollY / 2400, 1.4);

        // Gentle orbital sway + responsive mouse tilt + scroll plunge
        const cameraOrbitAngle = Math.sin(elapsedTime * 0.15) * 0.1;
        const cameraDistance = 8.8;

        camera.position.x = Math.sin(cameraOrbitAngle) * cameraDistance + currentMouseX * 0.85;
        camera.position.y = 0.55 - scrollRatio * 2.2 + Math.sin(elapsedTime * 0.25) * 0.15 - currentMouseY * 0.5;
        camera.position.z = Math.cos(cameraOrbitAngle) * cameraDistance - scrollRatio * 1.8;
        camera.lookAt(currentMouseX * 0.2, 0.45 - scrollRatio * 1.6, -1.2);

        // Architecture responsive parallax
        architectureGroup.rotation.y = currentMouseX * 0.05 + Math.sin(elapsedTime * 0.12) * 0.02;
        architectureGroup.rotation.x = -currentMouseY * 0.02;

        // 7. Swirling upward golden stardust particles
        const positions = particleGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleVelocities[i].y * 1.25;
          positions[i * 3] += Math.sin(elapsedTime * 0.9 + i) * 0.0022;
          positions[i * 3 + 2] += Math.cos(elapsedTime * 0.7 + i) * 0.0018;

          // Loop particles when they drift too high
          if (positions[i * 3 + 1] > 6.0) {
            positions[i * 3 + 1] = -2.4;
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
          }
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      archGeom.dispose();
      innerArchGeom.dispose();
      columnGeom.dispose();
      capGeom.dispose();
      baseGeom.dispose();
      floorGeom.dispose();
      crescentGeom.dispose();
      haloGeom.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      stoneDark.dispose();
      stoneTrim.dispose();
      goldAccent.dispose();
      goldGlow.dispose();
      floorMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#091510] via-[#10241B] to-[#19372D] overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#19372D] via-transparent to-black/60" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${
        fixed ? "fixed inset-0 pointer-events-none -z-10" : "absolute inset-0 pointer-events-none"
      } transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    />
  );
}

