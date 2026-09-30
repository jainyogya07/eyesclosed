import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface SceneProps {
  rainfall: number; // 0 to 80 mm
  temperature: number; // -2 to +5 °C
  canalHours: number; // 0 to 12 hrs
  layerMode?: 'canopy' | 'moisture' | 'flood' | 'strata';
  selectedPlot?: string;
  onSelectPlot?: (plot: string) => void;
}

// Low-poly Agricultural Tree Component
const Tree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 5]} />
        <meshStandardMaterial color="#5C4F2D" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.55, 1.1, 6]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[0.4, 0.9, 6]} />
        <meshStandardMaterial color="#22c55e" roughness={0.7} flatShading />
      </mesh>
    </group>
  );
};

// Moving Atmospheric Clouds with Rain Reactivity
const CloudSystem: React.FC<{ rainfall: number }> = ({ rainfall }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  const cloudColor = useMemo(() => {
    if (rainfall > 35) return '#1e293b'; // Dark storm grey
    if (rainfall > 15) return '#475569'; // Overcast slate
    return '#f1f5f9'; // Soft white cloud
  }, [rainfall]);

  const cloudOpacity = useMemo(() => {
    return Math.min(0.96, 0.5 + (rainfall / 80) * 0.45);
  }, [rainfall]);

  return (
    <group ref={groupRef} position={[0, 5.2, 0]}>
      {[-3.5, 0, 3.5].map((x, i) => (
        <group key={i} position={[x, (i % 2) * 0.35, (i - 1) * 2.2]}>
          <mesh>
            <sphereGeometry args={[1.3 + (rainfall / 80) * 0.4, 8, 8]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.5} flatShading />
          </mesh>
          <mesh position={[0.9, -0.2, 0.4]}>
            <sphereGeometry args={[0.95, 7, 7]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.5} flatShading />
          </mesh>
          <mesh position={[-0.8, -0.15, -0.3]}>
            <sphereGeometry args={[0.85, 7, 7]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.5} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Dynamic 3D Falling Rain Particle System
const RainParticles: React.FC<{ rainfall: number }> = ({ rainfall }) => {
  const count = useMemo(() => Math.min(750, Math.floor(rainfall * 16)), [rainfall]);
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || count === 0) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= delta * 12; // Falling speed
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 6.5;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (rainfall <= 0 || count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#38bdf8"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Flowing Irrigation Canal Mesh
const CanalWater: React.FC<{ canalHours: number; rainfall: number }> = ({ canalHours, rainfall }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.08 + Math.sin(state.clock.elapsedTime * 2.8) * 0.02;
    }
  });

  const waterColor = useMemo(() => {
    if (rainfall > 35) return '#0369a1';
    if (canalHours > 6) return '#0284c7';
    return '#38bdf8';
  }, [rainfall, canalHours]);

  return (
    <group>
      {/* Canal Base Trench */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 14.5]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Canal Water Surface */}
      <mesh ref={meshRef} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 14]} />
        <meshStandardMaterial color={waterColor} roughness={0.1} metalness={0.5} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// Orbiting Sentinel-2 Satellite
const OrbitingSatellite: React.FC = () => {
  const satRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (satRef.current) {
      const t = state.clock.elapsedTime * 0.4;
      satRef.current.position.x = Math.cos(t) * 7.5;
      satRef.current.position.z = Math.sin(t) * 7.5;
      satRef.current.position.y = 7.0 + Math.sin(t * 2) * 0.4;
      satRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={satRef}>
      {/* Main Body */}
      <mesh>
        <boxGeometry args={[0.35, 0.25, 0.45]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Solar Wings */}
      <mesh position={[-0.55, 0, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.3]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0.55, 0, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.3]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};

// Pulsing 3D Interactive Telemetry Pin
const TelemetryPin: React.FC<{
  position: [number, number, number];
  color: string;
  label: string;
  onClick?: () => void;
}> = ({ position, color, label, onClick }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3.5) * 0.3;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Ground Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[0.2, 0.32, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      {/* Pin Stem */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} />
      </mesh>
      {/* Head Orb */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

// 3D Landscape Terrain Mesh with Layer Modes
const LandscapeMesh: React.FC<{
  rainfall: number;
  temperature: number;
  layerMode: 'canopy' | 'moisture' | 'flood' | 'strata';
  onSelectPlot?: (plot: string) => void;
}> = ({ rainfall, temperature, layerMode, onSelectPlot }) => {
  // Plot 1 Color (Basmati Highland)
  const plot1Color = useMemo(() => {
    if (layerMode === 'moisture') {
      const m = 31.4 + rainfall * 0.4 - temperature * 0.6;
      if (m > 36) return '#0284c7'; // Saturated deep blue
      if (m > 25) return '#10b981'; // Optimal emerald
      return '#f59e0b'; // Low moisture amber
    }
    if (layerMode === 'flood') {
      return rainfall > 30 ? '#dc2626' : '#10b981';
    }
    if (layerMode === 'strata') {
      return '#78350f'; // Root-zone clay loam
    }
    // Default Canopy
    if (temperature > 3) return '#84cc16'; // Thermal stress olive
    return '#15803d'; // Lush Basmati green
  }, [rainfall, temperature, layerMode]);

  // Plot 2 Color (Lowland Basin - flood prone)
  const plot2Color = useMemo(() => {
    if (layerMode === 'flood' || rainfall > 25) {
      return rainfall > 25 ? '#ef4444' : '#f97316'; // High waterlogging risk
    }
    if (layerMode === 'moisture') {
      return '#0369a1';
    }
    return '#16a34a';
  }, [rainfall, layerMode]);

  return (
    <group>
      {/* Base Geological Plate */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16.5, 16.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Plot 1: North Basmati Terrace */}
      <mesh
        position={[-3.3, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => onSelectPlot?.('Plot A (North Basmati Terrace)')}
      >
        <planeGeometry args={[4.8, 12]} />
        <meshStandardMaterial color={plot1Color} roughness={0.75} />
      </mesh>

      {/* Plot 2: South Basin (Waterlogging sensitive) */}
      <mesh
        position={[3.3, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => onSelectPlot?.('Plot B (Kishanpur Low Basin)')}
      >
        <planeGeometry args={[4.8, 12]} />
        <meshStandardMaterial color={plot2Color} roughness={0.75} />
      </mesh>

      {/* Field Boundary Tree Rows */}
      <Tree position={[-0.95, 0, -4]} scale={0.9} />
      <Tree position={[-0.95, 0, -1]} scale={1.1} />
      <Tree position={[-0.95, 0, 2]} scale={0.85} />
      <Tree position={[-0.95, 0, 5]} scale={1.0} />

      <Tree position={[0.95, 0, -3.5]} scale={0.95} />
      <Tree position={[0.95, 0, 0]} scale={1.05} />
      <Tree position={[0.95, 0, 3.5]} scale={0.9} />

      {/* Interactive Telemetry Pins */}
      <TelemetryPin
        position={[-3.3, 0, 0]}
        color="#10b981"
        label="Plot A: Basmati Probe"
        onClick={() => onSelectPlot?.('Plot A: Alluvial Loam (-15cm probe: 32.4%)')}
      />
      <TelemetryPin
        position={[3.3, 0, 2]}
        color={rainfall > 20 ? '#ef4444' : '#f59e0b'}
        label="Plot B: Lowland Sensor"
        onClick={() => onSelectPlot?.('Plot B: Basin Clay (Risk Level: Moderate Waterlogging)')}
      />
      <TelemetryPin
        position={[0, 0, -4]}
        color="#0284c7"
        label="Canal Siphon Gauge"
        onClick={() => onSelectPlot?.('Canal Feeder: Sharda Sahayak Siphon (Flow: 82.4%)')}
      />
    </group>
  );
};

export const Landscape3DScene: React.FC<SceneProps> = ({
  rainfall,
  temperature,
  canalHours,
  layerMode = 'canopy',
  selectedPlot,
  onSelectPlot
}) => {
  const lightIntensity = useMemo(() => {
    return Math.max(0.45, 1.25 - (rainfall / 80) * 0.7);
  }, [rainfall]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '480px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 8.5, 13], fov: 44 }}
        style={{ background: 'linear-gradient(180deg, #090d16 0%, #0f172a 100%)', borderRadius: '20px' }}
      >
        <ambientLight intensity={lightIntensity * 0.85} color="#e2e8f0" />
        <directionalLight
          position={[10, 16, 9]}
          intensity={lightIntensity * 1.6}
          color="#fef08a"
          castShadow
        />

        <LandscapeMesh
          rainfall={rainfall}
          temperature={temperature}
          layerMode={layerMode}
          onSelectPlot={onSelectPlot}
        />
        <CanalWater canalHours={canalHours} rainfall={rainfall} />
        <CloudSystem rainfall={rainfall} />
        <RainParticles rainfall={rainfall} />
        <OrbitingSatellite />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={6}
          maxDistance={22}
        />
      </Canvas>
    </div>
  );
};
