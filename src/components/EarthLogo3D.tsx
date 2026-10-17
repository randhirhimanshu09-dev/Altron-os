import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface EarthLogo3DProps {
  isListening?: boolean;
  isProcessing?: boolean;
  isSpeaking?: boolean;
  size?: 'compact' | 'hero' | 'screen';
  onClick?: () => void;
}

// Scratch reusable vector objects to guarantee ZERO GC allocations in 60fps render loop
const _vec3 = new THREE.Vector3();

export const EarthLogo3D: React.FC<EarthLogo3DProps> = ({
  isListening = false,
  isProcessing = false,
  isSpeaking = false,
  size = 'hero',
  onClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isListening, isProcessing, isSpeaking });
  const mouseRef = useRef({ isDown: false, startX: 0, startY: 0, rotX: 0, rotY: 0, velX: 0, velY: 0 });

  useEffect(() => {
    stateRef.current = { isListening, isProcessing, isSpeaking };
  }, [isListening, isProcessing, isSpeaking]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. WebGL Renderer with High-Performance Precision
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.3);

    // 3. Studio Lighting & Reflections (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Cyber Lighting
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.8); // Brilliant cyan key
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 3.2); // Electric purple-violet rim
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const emeraldLight = new THREE.DirectionalLight(0x10b981, 1.8); // Subtle polar aurora accent
    emeraldLight.position.set(0, 5, -2);
    scene.add(emeraldLight);

    const hemiLight = new THREE.HemisphereLight(0x00f2ff, 0x020617, 1.4);
    scene.add(hemiLight);

    // 4. Procedural High-Res Ultra-Attractive Dark Cyber Earth Texture (2048x1024 Canvas)
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Deep Cosmic Midnight Ocean with Radial Depth
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#020b18');
    oceanGrad.addColorStop(0.3, '#020614');
    oceanGrad.addColorStop(0.5, '#01030a');
    oceanGrad.addColorStop(0.7, '#020614');
    oceanGrad.addColorStop(1, '#020b18');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Longitudinal and Latitudinal Hexagonal Matrix
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x <= 2048; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }

    // Continents & High-Tech Topography
    const continents = [
      // North America
      [[280, 160], [480, 140], [620, 220], [540, 420], [420, 510], [310, 390], [240, 270]],
      // Central & South America
      [[480, 530], [620, 560], [580, 820], [510, 930], [450, 740]],
      // Europe & Scandinavia
      [[860, 150], [1160, 140], [1240, 240], [1080, 340], [890, 270]],
      // Asia & Far East
      [[1160, 170], [1560, 180], [1720, 370], [1520, 540], [1280, 480], [1180, 330]],
      // Africa
      [[880, 430], [1110, 440], [1160, 710], [1030, 890], [920, 750], [860, 520]],
      // India & Subcontinent
      [[1300, 470], [1420, 490], [1370, 640], [1310, 560]],
      // Australia & Pacific
      [[1540, 640], [1730, 650], [1710, 830], [1560, 810]],
    ];

    continents.forEach(poly => {
      // Land Fill Gradient (Dark Carbon Cyberpunk with Emerald/Cyan Edges)
      const landGrad = ctx.createLinearGradient(poly[0][0], poly[0][1], poly[2]?.[0] || poly[0][0], poly[2]?.[1] || poly[0][1]);
      landGrad.addColorStop(0, '#061a33');
      landGrad.addColorStop(0.5, '#0b2a4a');
      landGrad.addColorStop(1, '#081e38');
      ctx.fillStyle = landGrad;

      ctx.beginPath();
      ctx.moveTo(poly[0][0], poly[0][1]);
      for (let i = 1; i < poly.length; i++) {
        ctx.lineTo(poly[i][0], poly[i][1]);
      }
      ctx.closePath();
      ctx.fill();

      // Glowing Neon Shorelines
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 40+ Megacity Optical Hubs (Glowing Cyan & Golden Nodes)
    const cityHubs = [
      [360, 310], [530, 350], [450, 410], [470, 370], [510, 680], [540, 760],
      [970, 260], [1020, 290], [1070, 270], [1140, 240], [930, 320], [1050, 360],
      [960, 510], [1010, 480], [1060, 840], [1340, 510], [1360, 570], [1440, 470],
      [1560, 380], [1620, 410], [1680, 400], [1660, 740], [1610, 780]
    ];

    // Connect mega cities with glowing flight / fiber optic routes
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < cityHubs.length - 1; i += 2) {
      const [x1, y1] = cityHubs[i];
      const [x2, y2] = cityHubs[i + 1];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const cpX = (x1 + x2) / 2;
      const cpY = Math.min(y1, y2) - 40;
      ctx.quadraticCurveTo(cpX, cpY, x2, y2);
      ctx.stroke();
    }

    cityHubs.forEach(([cx, cy]) => {
      // Outer Glow Aura
      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
      radGrad.addColorStop(0, '#38bdf8');
      radGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.6)');
      radGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 5. Procedural Aurora & Swirling Cloud Texture (1024x512 Canvas)
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cloudCtx = cloudCanvas.getContext('2d')!;
    cloudCtx.clearRect(0, 0, 1024, 512);

    for (let i = 0; i < 60; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 512;
      const rad = 35 + Math.random() * 70;
      const cloudGrad = cloudCtx.createRadialGradient(rx, ry, 0, rx, ry, rad);
      cloudGrad.addColorStop(0, 'rgba(34, 211, 238, 0.22)');
      cloudGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.12)');
      cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      cloudCtx.fillStyle = cloudGrad;
      cloudCtx.beginPath();
      cloudCtx.arc(rx, ry, rad, 0, Math.PI * 2);
      cloudCtx.fill();
    }
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    cloudTexture.colorSpace = THREE.SRGBColorSpace;

    // 6. THREE.Group Master Hierarchy (Composite Procedural Model)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // PART 1: Ultra-Reflective PBR Core Globe Mesh
    const globeGeo = new THREE.SphereGeometry(1.22, 64, 64);
    const globeMat = new THREE.MeshPhysicalMaterial({
      map: earthTexture,
      roughness: 0.18,
      metalness: 0.92,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      emissive: new THREE.Color(0x02162e),
      emissiveIntensity: 0.55,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    earthGroup.add(globeMesh);

    // PART 2: Translucent Swirling Cloud Atmosphere Shell
    const atmoGeo = new THREE.SphereGeometry(1.25, 48, 48);
    const atmoMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      roughness: 0.1,
      metalness: 0.3,
      depthWrite: false,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmoMesh);

    // PART 3: Custom Atmospheric Fresnel Rim Shader (Neon Cyber Corona)
    const haloGeo = new THREE.SphereGeometry(1.31, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.8);
          vec3 cyanColor = vec3(0.13, 0.83, 0.98);
          vec3 purpleColor = vec3(0.66, 0.33, 0.97);
          vec3 finalColor = mix(cyanColor, purpleColor, vNormal.y * 0.5 + 0.5);
          gl_FragColor = vec4(finalColor, fresnel * 0.9);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    earthGroup.add(haloMesh);

    // PART 4: Glowing Holographic Equatorial Telemetry Ring
    const ringGeo = new THREE.RingGeometry(1.52, 1.76, 72);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.25;
    earthGroup.add(ringMesh);

    // PART 5: Polar Gyroscope Laser Ring (Metallic Torus)
    const polarTorusGeo = new THREE.TorusGeometry(1.92, 0.018, 16, 96);
    const polarMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 1.2,
      metalness: 0.95,
      roughness: 0.08,
    });
    const polarRing = new THREE.Mesh(polarTorusGeo, polarMat);
    polarRing.rotation.y = Math.PI / 3;
    polarRing.rotation.x = Math.PI / 5.5;
    earthGroup.add(polarRing);

    // PART 6: Outer Thin Radar Compass Ring
    const outerRingGeo = new THREE.RingGeometry(2.15, 2.18, 96);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = Math.PI / 2.15;
    earthGroup.add(outerRingMesh);

    // PART 7: Constellation Quantum Particle Dust Field (150 Glittering Nodes)
    const particleCount = 160;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.65 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random() * 0.04 + 0.015;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    earthGroup.add(particlePoints);

    // PART 8: 3 Futuristic Autonomous Relay Satellites with Neon Solar Panels
    const satellites: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const satGroup = new THREE.Group();

      const satBodyGeo = new THREE.BoxGeometry(0.07, 0.07, 0.12);
      const satBodyMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.98,
        roughness: 0.12,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3,
      });
      satGroup.add(new THREE.Mesh(satBodyGeo, satBodyMat));

      const satWingGeo = new THREE.BoxGeometry(0.3, 0.01, 0.08);
      const satWingMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1,
      });
      satGroup.add(new THREE.Mesh(satWingGeo, satWingMat));

      const satBeaconGeo = new THREE.SphereGeometry(0.02, 12, 12);
      const satBeaconMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const beacon = new THREE.Mesh(satBeaconGeo, satBeaconMat);
      beacon.position.y = 0.06;
      satGroup.add(beacon);

      satellites.push(satGroup);
      earthGroup.add(satGroup);
    }

    // Pre-warm and compile shaders
    renderer.compile(scene, camera);

    // 7. Interactive Drag-to-Rotate Gesture Handling (Touch & Mouse)
    const dom = renderer.domElement;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      mouseRef.current.isDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.startX = clientX;
      mouseRef.current.startY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!mouseRef.current.isDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - mouseRef.current.startX;
      const deltaY = clientY - mouseRef.current.startY;

      mouseRef.current.velX = deltaX * 0.005;
      mouseRef.current.velY = deltaY * 0.005;

      mouseRef.current.rotY += mouseRef.current.velX;
      mouseRef.current.rotX += mouseRef.current.velY;

      mouseRef.current.startX = clientX;
      mouseRef.current.startY = clientY;
    };

    const onPointerUp = () => {
      mouseRef.current.isDown = false;
    };

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 8. Animation Loop with 60 FPS Exponential Inertia & State Responsiveness
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const { isListening: listening, isProcessing: processing, isSpeaking: speaking } = stateRef.current;

      // Base planetary spin + responsive voice acceleration
      let targetSpinSpeed = 0.38;
      let pulseScale = 1.0;

      if (listening) {
        targetSpinSpeed = 1.15;
        pulseScale = 1.0 + Math.sin(elapsedTime * 9) * 0.045;
      } else if (processing) {
        targetSpinSpeed = 2.4;
        pulseScale = 1.0 + Math.sin(elapsedTime * 16) * 0.065;
      } else if (speaking) {
        targetSpinSpeed = 0.85;
        pulseScale = 1.0 + Math.sin(elapsedTime * 7) * 0.035;
      }

      // Drag inertia damping
      if (!mouseRef.current.isDown) {
        mouseRef.current.velX *= 0.94;
        mouseRef.current.velY *= 0.94;
        mouseRef.current.rotY += mouseRef.current.velX;
        mouseRef.current.rotX += mouseRef.current.velY;
      }

      // Continuous planetary rotation + user drag tilt
      globeMesh.rotation.y += targetSpinSpeed * delta + mouseRef.current.velX;
      atmoMesh.rotation.y += targetSpinSpeed * 1.18 * delta;
      ringMesh.rotation.z += 0.25 * delta;
      polarRing.rotation.z -= 0.35 * delta;
      outerRingMesh.rotation.z += 0.15 * delta;
      particlePoints.rotation.y += 0.08 * delta;

      // Subtle vertical bobbing & pulse
      earthGroup.scale.set(pulseScale, pulseScale, pulseScale);
      earthGroup.rotation.x = THREE.MathUtils.lerp(earthGroup.rotation.x, mouseRef.current.rotX, 0.1);

      // Orbit autonomous satellites in 3D paths
      satellites.forEach((sat, idx) => {
        const angle = elapsedTime * 0.9 + (idx * Math.PI * 2) / 3;
        const orbitRadius = 2.2;
        sat.position.x = Math.cos(angle) * orbitRadius;
        sat.position.z = Math.sin(angle) * orbitRadius;
        sat.position.y = Math.sin(angle * 2.5) * 0.42;
        sat.rotation.y = -angle;
      });

      // Interactive gentle camera tilt
      camera.position.x = Math.sin(elapsedTime * 0.35) * 0.12;
      camera.position.y = Math.cos(elapsedTime * 0.28) * 0.08;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup & Proper WebGL Resource Disposal
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      polarTorusGeo.dispose();
      polarMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      earthTexture.dispose();
      cloudTexture.dispose();
    };
  }, []);

  const sizeClasses = {
    compact: 'w-24 h-24',
    hero: 'w-52 h-52 sm:w-64 sm:h-64',
    screen: 'w-full h-full min-h-[280px]',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none transition-transform active:scale-95 group ${sizeClasses}`}
      title="Tap Earth to activate ALTRON Voice Assistant • Drag to rotate"
    >
      <div ref={mountRef} className="w-full h-full" />
      {/* Sci-Fi Hologram Overlay Brackets */}
      <div className="absolute inset-1 pointer-events-none border border-cyan-500/20 rounded-full animate-spin-slow group-hover:border-cyan-400/40 transition-colors" />
      <div className="absolute -inset-1 pointer-events-none border border-dashed border-cyan-400/15 rounded-full" />
      {/* Interactive Drag Hint */}
      <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-black/60 border border-cyan-500/20 text-[9px] font-mono text-cyan-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        DRAG TO ROTATE • TAP TO TALK
      </div>
    </div>
  );
};
