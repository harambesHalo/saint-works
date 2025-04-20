// Model.js with in-place rotation controls

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
  const modelRef = useRef();
  const mixerRef = useRef();
  
  // Keep track of key states
  const keyStates = useRef({
    forward: false,  // Up arrow or W
    backward: false, // Down arrow or S
    left: false,     // Left arrow or A
    right: false,    // Right arrow or D
    rotateLeft: false,  // Q
    rotateRight: false, // E
  });
  
  // Movement parameters
  const moveSpeed = 0.05;
  const rotateSpeed = 0.02;

  // ─── enable shadows & tweak material maps ─────────────────────────────────
  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();

    scene.traverse(child => {
      if (child.isMesh) {
        // shadows
        child.castShadow = true;
        child.receiveShadow = true;

        const mat = child.material;
        if (mat) {
          // 1) soften normal strength
          if (mat.normalScale) {
            mat.normalScale.set(0.40, 0.40);
          }

          // 2) fix filtering + anisotropy on the normal map
          if (mat.normalMap) {
            mat.normalMap.wrapS = mat.normalMap.wrapT = RepeatWrapping;
            mat.normalMap.minFilter = LinearMipMapLinearFilter;
            mat.normalMap.magFilter = LinearFilter;
            mat.normalMap.anisotropy = maxAniso;
          }

          // 3) same for roughness map if you baked one
          if (mat.roughnessMap) {
            mat.roughnessMap.wrapS = mat.roughnessMap.wrapT = RepeatWrapping;
            mat.roughnessMap.minFilter = LinearMipMapLinearFilter;
            mat.roughnessMap.magFilter = LinearFilter;
            mat.roughnessMap.anisotropy = maxAniso;
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
        keyStates.current.forward = true;
        
        // Auto-disable after a short time
        setTimeout(() => {
          keyStates.current.forward = false;
        }, 500);
      });
    }
  }, [registerMoveForward]);


  // ─── setup mixer & center model ───────────────────────────────
  useEffect(() => {
    if (animations.length) {
      mixerRef.current = new AnimationMixer(scene);
    }

    const box = new Box3().setFromObject(scene);
    const center = new Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    console.log('[Model] Scene box size:', box.getSize(new Vector3()));
    console.log('[Model] Scene center offset:', center);
  }, [animations, scene]);

  
  // ─── Set up keyboard controls ────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for arrow keys to stop page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          keyStates.current.forward = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keyStates.current.backward = true;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keyStates.current.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keyStates.current.right = true;
          break;
        case 'q':
        case 'Q':
          keyStates.current.rotateLeft = true;
          break;
        case 'e':
        case 'E':
          keyStates.current.rotateRight = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      // Prevent default behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          keyStates.current.forward = false;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keyStates.current.backward = false;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keyStates.current.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keyStates.current.right = false;
          break;
        case 'q':
        case 'Q':
          keyStates.current.rotateLeft = false;
          break;
        case 'e':
        case 'E':
          keyStates.current.rotateRight = false;
          break;
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  // ─── animate mixer & handle movement ──────────────────────────────────────
  useFrame(() => {
    if (mixerRef.current) {
      mixerRef.current.update(clock.getDelta());
    }

    if (modelRef.current) {
      // Handle rotation and movement separately to ensure rotation happens without movement
      
      // Handle rotation first - pure rotation in place, no movement
      if (keyStates.current.rotateRight) {
        modelRef.current.rotation.y += rotateSpeed;
      }
      if (keyStates.current.rotateLeft) {
        modelRef.current.rotation.y -= rotateSpeed;
      }

      // Only handle movement if we're not rotating
      // This ensures no accidental movement during rotation
      if (!keyStates.current.rotateLeft && !keyStates.current.rotateRight) {
        // Get current rotation angle
        const angle = modelRef.current.rotation.y;
        
        // Create a movement vector
        const movement = new Vector3(0, 0, 0);
        
        // Forward/backward movement
        if (keyStates.current.forward) {
          movement.z += moveSpeed * Math.cos(angle);
          movement.x += moveSpeed * Math.sin(angle);
        }
        if (keyStates.current.backward) {
          movement.z -= moveSpeed * Math.cos(angle);
          movement.x -= moveSpeed * Math.sin(angle);
        }
        
        // Left/right movement
        if (keyStates.current.left) {
          movement.x += moveSpeed * Math.cos(angle);
          movement.z -= moveSpeed * Math.sin(angle);
        }
        if (keyStates.current.right) {
          movement.x -= moveSpeed * Math.cos(angle);
          movement.z += moveSpeed * Math.sin(angle);
        }
        
        // Apply the movement only if there is movement to apply
        if (movement.length() > 0) {
          modelRef.current.position.add(movement);
          console.log('Movement vector:', movement);
          console.log('New position:', modelRef.current.position);
        }
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