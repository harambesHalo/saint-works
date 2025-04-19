// Model.js

import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AnimationMixer,
  Box3,
  Vector3,
  RepeatWrapping,
  LinearFilter,
  LinearMipMapLinearFilter
} from 'three';

const Model = ({ registerMoveForward }) => {
  const { scene, animations } = useGLTF('/medias/bakedGallery.glb', {
    onLoad:  () => console.log('[Model] GLB model loaded successfully'),
    onError: err => console.error('[Model] Error loading GLB:', err)
  });
  const { viewport, clock, gl } = useThree();
  const modelRef   = useRef();
  const mixerRef   = useRef();
  const velocity   = useRef(0);
  const direction  = new Vector3(1.0, 0, 1.8);
  const stopZRef   = useRef(3);

  // ─── enable shadows & tweak material maps ─────────────────────────────────
  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();

    scene.traverse(child => {
      if (child.isMesh) {
        // shadows
        child.castShadow    = true;
        child.receiveShadow = true;

        const mat = child.material;
        if (mat) {
          // 1) soften normal strength
          if (mat.normalScale) {
            mat.normalScale.set(0.40, 0.40);
          }

          // 2) fix filtering + anisotropy on the normal map
          if (mat.normalMap) {
            mat.normalMap.wrapS       =
            mat.normalMap.wrapT       = RepeatWrapping;
            mat.normalMap.minFilter   = LinearMipMapLinearFilter;
            mat.normalMap.magFilter   = LinearFilter;
            mat.normalMap.anisotropy  = maxAniso;
          }

          // 3) same for roughness map if you baked one
          if (mat.roughnessMap) {
            mat.roughnessMap.wrapS       =
            mat.roughnessMap.wrapT       = RepeatWrapping;
            mat.roughnessMap.minFilter   = LinearMipMapLinearFilter;
            mat.roughnessMap.magFilter   = LinearFilter;
            mat.roughnessMap.anisotropy  = maxAniso;
          }

          mat.needsUpdate = true;
        }
      }

      if (child.isLight) {
        child.castShadow = true;
        child.shadow.mapSize.set(1024, 1024);
        child.shadow.bias = -0.00008;
      }
    });
  }, [scene, gl]);


  // ─── register moveForward callback ────────────────────────────────────────
  useEffect(() => {
    if (registerMoveForward) {
      registerMoveForward(() => {
        velocity.current = 0.03;
      });
    }
  }, [registerMoveForward]);


  // ─── setup mixer & center model & compute stopZ ───────────────────────────
  useEffect(() => {
    if (animations.length) {
      mixerRef.current = new AnimationMixer(scene);
    }

    const box    = new Box3().setFromObject(scene);
    const center = new Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    const size = new Vector3();
    box.getSize(size);
    stopZRef.current = size.z * 0.75;

    console.log('[Model] Scene box size:', size);
    console.log('[Model] Scene center offset:', center);
  }, [animations, scene]);


  // ─── animate mixer & move model forward ──────────────────────────────────
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


  const baseScale = Math.min(viewport.width, viewport.height) / 2.5;

  return (
    <group
      ref={modelRef}
      scale={[baseScale, baseScale, baseScale]}
      rotation={[0, 0, 0]}
      position={[0, 1.5, -5.25]}
    >
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/medias/bakedGallery.glb');
export default Model;
