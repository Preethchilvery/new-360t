import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface PanoramaViewerProps {
  imageUrl: string;
}

const PanoramaSphere: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const texture = new THREE.TextureLoader().load(
    imageUrl,
    () => setIsLoading(false),
    undefined,
    () => {
      setIsLoading(false);
      setHasError(true);
    }
  );

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
  });

  if (hasError) {
    return (
      <Html center>
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <h3 className="text-red-500 font-bold mb-2">Error Loading Image</h3>
          <p className="text-gray-600">Please check if the image exists at: {imageUrl}</p>
        </div>
      </Html>
    );
  }

  return (
    <>
      <Sphere ref={sphereRef} args={[500, 60, 40]} scale={[-1, 1, 1]}>
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </Sphere>
      {isLoading && (
        <Html center>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading panorama...</p>
          </div>
        </Html>
      )}
    </>
  );
};

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl }) => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#1a1a1a' }}>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <PanoramaSphere imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
};

export default PanoramaViewer; 