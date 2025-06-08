import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneTransitionProps {
  fromScene: string;
  toScene: string;
  duration?: number;
  onComplete?: () => void;
}

const SceneTransition: React.FC<SceneTransitionProps> = ({
  fromScene,
  toScene,
  duration = 1000,
  onComplete
}) => {
  const { camera } = useThree();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min(elapsed / duration, 1);

      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    animate();
  }, [duration, onComplete]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        color="black"
        transparent
        opacity={progress}
      />
    </mesh>
  );
};

export default SceneTransition; 