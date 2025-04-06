import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Box3, Vector3 } from 'three';

const Model = ({ registerMoveForward, onEnteredGallery }) => {
  const { scene, animations } = useGLTF('/medias/GalleryRoomTest3.glb');
  const { viewport, clock } = useThree();
  const modelRef = useRef();
  const mixerRef = useRef();
  const actionsRef = useRef([]);

  const velocity = useRef(0);
  const direction = new Vector3(0.9, 0, 1.0);
  const stopZ = 3.1;

  useEffect(() => {
    if (registerMoveForward) {
      registerMoveForward(() => {
        console.log("moveForward() called");
        velocity.current = 0.03;
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

      if (modelRef.current.position.z >= stopZ) {
        velocity.current = 0;
        console.log("User now in gallery");

        if (onEnteredGallery) {
          onEnteredGallery(); // 👈 this will now toggle the overlay
        }
      }
    }
  });

  return (
    <group
      ref={modelRef}
      scale={viewport.width / 5.35}
      rotation={[0, 4.72, 0]}
      position={[-1.75, 0, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/medias/medias/GalleryRoomTest3.glb');
export default Model;
