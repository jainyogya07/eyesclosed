import React, { useEffect, useRef } from 'react';

interface AgroWarpBackgroundProps {
  className?: string;
  speedMultiplier?: number;
  rayCount?: number;
  particleCount?: number;
}

interface Ray {
  angle: number;
  length: number;
  width: number;
  speed: number;
  colorType: 'golden' | 'emerald' | 'cyan';
  opacity: number;
  pulsePhase: number;
}

interface Spore {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speedZ: number;
}

export const AgroWarpBackground: React.FC<AgroWarpBackgroundProps> = ({
  className = '',
  speedMultiplier = 1,
  rayCount = 48,
  particleCount = 90
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.45, targetX: 0.5, targetY: 0.45 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Color definitions for farm atmosphere
    const COLOR_PALETTES = {
      golden: ['rgba(245, 158, 11, ', 'rgba(251, 191, 36, '], // Sunlit Ripe Grain
      emerald: ['rgba(16, 185, 129, ', 'rgba(5, 150, 105, '], // Lush Chlorophyll
      cyan: ['rgba(6, 182, 212, ', 'rgba(56, 189, 248, ']     // Monsoon Rain Cloud
    };

    // Initialize radial warp rays
    const rays: Ray[] = [];
    for (let i = 0; i < rayCount; i++) {
      const typeRand = Math.random();
      const colorType: 'golden' | 'emerald' | 'cyan' =
        typeRand < 0.45 ? 'emerald' : typeRand < 0.8 ? 'golden' : 'cyan';

      rays.push({
        angle: (i / rayCount) * Math.PI * 2 + (Math.random() * 0.1 - 0.05),
        length: 0.35 + Math.random() * 0.75,
        width: 1.2 + Math.random() * 3.5,
        speed: (0.002 + Math.random() * 0.004) * speedMultiplier,
        colorType,
        opacity: 0.2 + Math.random() * 0.55,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Initialize 3D bio-spores drifting outward from warp center
    const spores: Spore[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isGold = Math.random() > 0.5;
      spores.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000 + 10,
        size: 1.5 + Math.random() * 2.5,
        color: isGold ? '#fbbf24' : '#34d399',
        speedZ: (1.5 + Math.random() * 2.5) * speedMultiplier
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Soft mouse lerp for natural parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const originX = width * mouseRef.current.x;
      const originY = height * mouseRef.current.y;
      const maxDim = Math.max(width, height) * 1.4;

      // Deep, rich cosmic agricultural backdrop (dark soil green/black)
      ctx.fillStyle = '#030806';
      ctx.fillRect(0, 0, width, height);

      // Radial ambient center glow
      const centerGlow = ctx.createRadialGradient(
        originX,
        originY,
        10,
        originX,
        originY,
        Math.min(width, height) * 0.75
      );
      centerGlow.addColorStop(0, 'rgba(5, 150, 105, 0.22)');
      centerGlow.addColorStop(0.35, 'rgba(245, 158, 11, 0.10)');
      centerGlow.addColorStop(0.7, 'rgba(6, 182, 212, 0.04)');
      centerGlow.addColorStop(1, 'rgba(3, 8, 6, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      // Render Radiating Warp Streaks (Luma-Style Hyperspace Rays)
      ctx.save();
      ctx.lineWidth = 2;

      for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];
        ray.angle += ray.speed;
        const currentOpacity =
          ray.opacity * (0.65 + 0.35 * Math.sin(time * 2 + ray.pulsePhase));

        const cosA = Math.cos(ray.angle);
        const sinA = Math.sin(ray.angle);

        // Streak extends outward from vanishing point
        const innerRadius = 40 + 20 * Math.sin(time + i);
        const outerRadius = innerRadius + maxDim * ray.length;

        const startX = originX + cosA * innerRadius;
        const startY = originY + sinA * innerRadius;
        const endX = originX + cosA * outerRadius;
        const endY = originY + sinA * outerRadius;

        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
        const palette = COLOR_PALETTES[ray.colorType];
        grad.addColorStop(0, `${palette[0]}0)`);
        grad.addColorStop(0.25, `${palette[0]}${currentOpacity})`);
        grad.addColorStop(0.7, `${palette[1]}${currentOpacity * 0.8})`);
        grad.addColorStop(1, `${palette[1]}0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      ctx.restore();

      // Render 3D Spores / Floating Bio-Pollen shooting forward
      ctx.save();
      for (let i = 0; i < spores.length; i++) {
        const s = spores[i];
        s.z -= s.speedZ;

        // Reset particle if passed camera
        if (s.z <= 10) {
          s.z = 1000;
          s.x = (Math.random() - 0.5) * 2000;
          s.y = (Math.random() - 0.5) * 2000;
        }

        // Perspective projection
        const k = 350 / s.z;
        const px = originX + s.x * k;
        const py = originY + s.y * k;
        const pSize = s.size * k;
        const alpha = Math.min(1, (1000 - s.z) / 400);

        if (px >= -20 && px <= width + 20 && py >= -20 && py <= height + 20 && alpha > 0) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, pSize), 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = alpha * 0.75;
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
          ctx.fill();
        }
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [speedMultiplier, rayCount, particleCount]);

  return (
    <div
      className={`agro-warp-container ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
      {/* Soft atmospheric overlay for text contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(3, 8, 6, 0.4) 0%, rgba(3, 8, 6, 0.82) 80%, rgba(2, 5, 4, 0.96) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
