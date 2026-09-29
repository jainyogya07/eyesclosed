import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  rainfall: number; // 0 to 80 mm
  temperature: number; // -2 to +5 °C
  canalHours: number; // 0 to 12 hrs
}

// Low-poly Agricultural Tree Component
const Tree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 5]} />
        <meshStandardMaterial color="#5C4F2D" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.55, 1.1, 6]} />
        <meshStandardMaterial color="#658665" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.4, 0.9, 6]} />
        <meshStandardMaterial color="#b6b243" roughness={0.7} flatShading />
      </mesh>
    </group>
  );
};

// Moving Atmospheric Clouds with Rain Reactivity
const CloudSystem: React.FC<{ rainfall: number }> = ({ rainfall }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  const cloudColor = useMemo(() => {
    if (rainfall > 35) return '#334155'; // Stormy dark grey
    if (rainfall > 15) return '#64748b'; // Overcast slate
    return '#AEAEAD'; // Farmora Platinum cloud
  }, [rainfall]);

  const cloudOpacity = useMemo(() => {
    return Math.min(0.95, 0.45 + (rainfall / 80) * 0.5);
  }, [rainfall]);

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      {[-3, 0, 3].map((x, i) => (
        <group key={i} position={[x, (i % 2) * 0.3, (i - 1) * 2]}>
          <mesh>
            <sphereGeometry args={[1.2 + (rainfall / 80) * 0.4, 7, 7]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0.8, -0.2, 0.4]}>
            <sphereGeometry args={[0.9, 6, 6]} />
            <meshStandardMaterial color={cloudColor} transparent opacity={cloudOpacity} roughness={0.4} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Flowing Irrigation Canal
const CanalWater: React.FC<{ canalHours: number; rainfall: number }> = ({ canalHours, rainfall }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.08 + Math.sin(state.clock.elapsedTime * 2.5) * 0.02;
    }
  });

  const waterColor = useMemo(() => {
    if (rainfall > 35) return '#0369a1';
    if (canalHours > 6) return '#0284c7';
    return '#38bdf8';
  }, [rainfall, canalHours]);

  return (
    <mesh ref={meshRef} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.2, 14]} />
      <meshStandardMaterial color={waterColor} roughness={0.1} metalness={0.4} transparent opacity={0.88} />
    </mesh>
  );
};

// Orbiting Satellite Layer
const OrbitingSatellite: React.FC = () => {
  const satRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (satRef.current) {
      const t = state.clock.elapsedTime * 0.35;
      satRef.current.position.x = Math.cos(t) * 7;
      satRef.current.position.z = Math.sin(t) * 7;
      satRef.current.position.y = 7.5 + Math.sin(t * 2) * 0.5;
      satRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={satRef}>
      <mesh>
        <boxGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color="#FBFBFB" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.45, 0, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.25]} />
        <meshStandardMaterial color="#B6B243" roughness={0.3} />
      </mesh>
      <mesh position={[0.45, 0, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.25]} />
        <meshStandardMaterial color="#B6B243" roughness={0.3} />
      </mesh>
    </group>
  );
};

// 3D Landscape Terrain & Agricultural Plots
const LandscapeMesh: React.FC<{ rainfall: number; temperature: number }> = ({ rainfall, temperature }) => {
  const plotColor = useMemo(() => {
    if (rainfall > 40) return '#1e3a8a'; // Waterlogged flood alert
    if (rainfall > 15) return '#2e3a1f'; // Moist rich soil
    if (temperature > 2) return '#986924'; // Heat stress dry amber
    return '#658665'; // Healthy sage canopy
  }, [rainfall, temperature]);

  return (
    <group>
      {/* Base Ground Terrain - Obsidian Soil */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0C0D05" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Left Farm Plot */}
      <mesh position={[-3.2, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 12]} />
        <meshStandardMaterial color={plotColor} roughness={0.8} />
      </mesh>

      {/* Right Farm Plot (Depression prone to inundation) */}
      <mesh position={[3.2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 12]} />
        <meshStandardMaterial
          color={rainfall > 30 ? '#dc2626' : plotColor}
          roughness={0.8}
        />
      </mesh>

      {/* Boundary rows */}
      <Tree position={[-0.9, 0, -4]} scale={0.9} />
      <Tree position={[-0.9, 0, -1]} scale={1.1} />
      <Tree position={[-0.9, 0, 2]} scale={0.85} />
      <Tree position={[-0.9, 0, 5]} scale={1.0} />

      <Tree position={[0.9, 0, -3.5]} scale={0.95} />
      <Tree position={[0.9, 0, 0]} scale={1.05} />
      <Tree position={[0.9, 0, 3.5]} scale={0.9} />
    </group>
  );
};

export const Landscape3DScene: React.FC<SceneProps> = ({ rainfall, temperature, canalHours }) => {
  const lightIntensity = useMemo(() => {
    return Math.max(0.4, 1.2 - (rainfall / 80) * 0.7);
  }, [rainfall]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '440px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 8, 12], fov: 45 }}
        style={{ background: '#0C0D05', borderRadius: 'var(--radius-xl)' }}
      >
        <ambientLight intensity={lightIntensity * 0.8} color="#D7CE93" />
        <directionalLight
          position={[10, 15, 8]}
          intensity={lightIntensity * 1.5}
          color="#B6B243"
          castShadow
        />

        <LandscapeMesh rainfall={rainfall} temperature={temperature} />
        <CanalWater canalHours={canalHours} rainfall={rainfall} />
        <CloudSystem rainfall={rainfall} />
        <OrbitingSatellite />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={6}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
};
