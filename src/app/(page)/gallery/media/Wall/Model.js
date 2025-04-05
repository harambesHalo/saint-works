import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Box3, Vector3 } from 'three';

const Model = ({ registerMoveForward }) => {
  const { scene, animations } = useGLTF('/medias/3d_gallery_wall.glb');
  const { viewport, clock } = useThree();
  const modelRef = useRef();
  const mixerRef = useRef();
  const actionsRef = useRef([]);

  const velocity = useRef(0);
  const direction = new Vector3(0.90, 0, 1);

  useEffect(() => {
    if (registerMoveForward) {
      registerMoveForward(() => {
        console.log("moveForward() called");
        velocity.current = 0.02;
      });
    }
  }, [registerMoveForward]);

  useEffect(() => {
    if (animations.length) {
      mixerRef.current = new AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip);
        action.paused = true;
        actionsRef.current.push(action);
      });
    }
  }, [animations, scene]);

  useEffect(() => {
    const box = new Box3().setFromObject(scene);
    const center = new Vector3();
    box.getCenter(center);
    scene.position.sub(center);
  }, [scene]);

  useFrame(() => {
    if (mixerRef.current) {
      mixerRef.current.update(clock.getDelta());
    }

    if (velocity.current > 0 && modelRef.current) {
      modelRef.current.position.addScaledVector(direction, velocity.current);
    }
  });

  return (
    <group
      ref={modelRef}
      scale={viewport.width / 3.65}
      rotation={[0, 4.72, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/medias/3d_gallery_wall.glb');
export default Model;
