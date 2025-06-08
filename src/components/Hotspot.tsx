import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface HotspotProps {
  position: [number, number, number];
  title: string;
  description: string;
  onClick: () => void;
}

const Hotspot: React.FC<HotspotProps> = ({ position, title, description, onClick }) => {
  return (
    <group position={new THREE.Vector3(...position)}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <Html position={[0, 0.2, 0]} center>
        <div className="bg-white p-2 rounded shadow-lg">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </Html>
    </group>
  );
};

export default Hotspot; 