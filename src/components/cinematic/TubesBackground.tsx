import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Farmora Agritech Palettes for dynamic color randomization on click
const AGRITECH_PALETTES = [
  {
    tubes: ['#b6b243', '#658665', '#986924'], // Chartreuse, Sage, Bronze
    lights: ['#d7ce93', '#b6b243', '#658665', '#38bdf8']
  },
  {
    tubes: ['#10b981', '#059669', '#38bdf8'], // Emerald, Forest, Sky
    lights: ['#6ee7b7', '#34d399', '#0284c7', '#fbbf24']
  },
  {
    tubes: ['#f59e0b', '#d97706', '#b6b243'], // Golden Hour Solar
    lights: ['#fef3c7', '#fde68a', '#b6b243', '#10b981']
  },
  {
    tubes: ['#8b5cf6', '#38bdf8', '#b6b243'], // Cyber Agritech
    lights: ['#c4b5fd', '#67e8f9', '#d7ce93', '#658665']
  }
];

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
  minHeight?: string;
}

export const TubesBackground: React.FC<TubesBackgroundProps> = ({
  children,
  className = '',
  enableClickInteraction = true,
  minHeight = '100vh'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesAppRef = useRef<any>(null);
  const paletteIndexRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    let fallbackCleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Dynamic import from CDN as provided in reference implementation
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted || !canvasRef.current) return;

        const initialPalette = AGRITECH_PALETTES[0];
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: initialPalette.tubes,
            lights: {
              intensity: 220,
              colors: initialPalette.lights
            }
          }
        });

        tubesAppRef.current = app;
        setIsLoaded(true);
      } catch (err) {
        console.warn('TubesCursor CDN unavailable, engaging local Three.js ambient fallback:', err);
        if (!mounted || !canvasRef.current) return;
        // Three.js interactive cursor ribbons fallback
        fallbackCleanup = initFallbackScene(canvasRef.current);
        setIsLoaded(true);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (fallbackCleanup) fallbackCleanup();
      if (tubesAppRef.current && typeof tubesAppRef.current.destroy === 'function') {
        try {
          tubesAppRef.current.destroy();
        } catch (_) {}
      }
    };
  }, []);

  // Three.js interactive cursor stream fallback
  const initFallbackScene = (canvas: HTMLCanvasElement): (() => void) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient floating agritech particles & ribbon ring
    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.TorusKnotGeometry(2.5, 0.45, 120, 16, 2, 3);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb6b243,
      emissive: 0x5c4f2d,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const light1 = new THREE.PointLight(0xb6b243, 80, 20);
    light1.position.set(4, 4, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x38bdf8, 60, 20);
    light2.position.set(-4, -4, 4);
    scene.add(light2);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      group.rotation.x += 0.005;
      group.rotation.y += 0.008;
      group.position.x += (mouseX * 1.5 - group.position.x) * 0.05;
      group.position.y += (mouseY * 1.5 - group.position.y) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!canvas.parentElement) return;
      camera.aspect = canvas.parentElement.clientWidth / canvas.parentElement.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!enableClickInteraction) return;

    paletteIndexRef.current = (paletteIndexRef.current + 1) % AGRITECH_PALETTES.length;
    const nextPalette = AGRITECH_PALETTES[paletteIndexRef.current];

    if (tubesAppRef.current && tubesAppRef.current.tubes) {
      try {
        tubesAppRef.current.tubes.setColors(nextPalette.tubes);
        tubesAppRef.current.tubes.setLightsColors(nextPalette.lights);
      } catch (_) {}
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight,
        overflow: 'hidden',
        backgroundColor: '#0C0D05'
      }}
    >
      {/* 3D Tubes Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
          zIndex: 1
        }}
      />

      {/* Subtle Farmora Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 35%, rgba(12, 13, 5, 0.75) 90%)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* Interactive Children Overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};
