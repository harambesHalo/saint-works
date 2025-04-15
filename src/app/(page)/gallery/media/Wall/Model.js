import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Box3, Vector3 } from 'three';

const Model = ({ registerMoveForward }) => {
  const { scene, animations } = useGLTF('/medias/galleryNew1.glb', {
    onLoad: () => console.log('[Model] GLB model loaded successfully'),
    onError: (err) => console.error('[Model] Error loading GLB:', err)
  });
  console.log("[Model] Loaded scene:", scene);
  const { viewport, clock } = useThree();
  const modelRef = useRef();
  const mixerRef = useRef();

  const baseScale = Math.min(viewport.width, viewport.height) / 2.5;
  const velocity = useRef(0);
  const direction = new Vector3(0.8, 0, 1.5);
  const stopZRef = useRef(3);

  useEffect(() => {
    if (registerMoveForward) {
      registerMoveForward(() => {
        velocity.current = 0.03;
      });
    }
  }, [registerMoveForward]);

  useEffect(() => {
    if (animations.length) {
      console.log("animations", animations);
      mixerRef.current = new AnimationMixer(scene);
    }
    
    // Center the model
    const box = new Box3().setFromObject(scene);
    const center = new Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    // Store stopZ as a % of model's bounding box depth
    const size = new Vector3();
    box.getSize(size);
    stopZRef.current = size.z * 0.75;
    console.log("[Model] Scene box size:", size);
    console.log("[Model] Scene center offset:", center);
  }, [animations, scene]);

  useFrame(() => {
    if (mixerRef.current) {
      mixerRef.current.update(clock.getDelta());
    }

    if (velocity.current > 0 && modelRef.current) {
      modelRef.current.position.addScaledVector(direction, velocity.current);

      if (modelRef.current.position.z >= stopZRef.current) {
        velocity.current = 0;
      }
    }
  });

  return (
    <group
      ref={modelRef}
      scale={[baseScale, baseScale, baseScale]}
      rotation={[0, 4.71, 0]}
      position={[-1.75, 1.0, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/medias/galleryNew1.glb');
export default Model;