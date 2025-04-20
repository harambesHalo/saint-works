// components/desktop/GalleryScene/GalleryScene.jsx
// Camera-based navigation with original lighting and scene settings

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import styles from './GalleryScene.module.scss';

// Inner component that sets up the scene and controls
const GalleryWorld = ({ registerMoveForward }) => {
  const { scene, animations } = useGLTF('/medias/bakedGallery.glb', {
    onLoad: () => console.log('[Gallery] GLB model loaded successfully'),
    onError: err => console.error('[Gallery] Error loading GLB:', err)
  });
  const { camera, gl } = useThree();
  
  // Reference for animation mixer
  const mixerRef = useRef(null);
  const sceneRef = useRef();
  
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
  
  // Setup initial camera position
  useEffect(() => {
    camera.position.set(0, -0.5, 3.5); // Adjusted eye height
    camera.lookAt(0, -0.5, -6); // Look forward
  }, [camera]);

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
            mat.normalScale.set(0.25, 0.25);
          }

          // 2) fix filtering + anisotropy on the normal map
          if (mat.normalMap) {
            mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
            mat.normalMap.minFilter = THREE.LinearMipMapLinearFilter;
            mat.normalMap.magFilter = THREE.LinearFilter;
            mat.normalMap.anisotropy = maxAniso;
          }

          // 3) same for roughness map if you baked one
          if (mat.roughnessMap) {
            mat.roughnessMap.wrapS = mat.roughnessMap.wrapT = THREE.RepeatWrapping;
            mat.roughnessMap.minFilter = THREE.LinearMipMapLinearFilter;
            mat.roughnessMap.magFilter = THREE.LinearFilter;
            mat.roughnessMap.anisotropy = maxAniso;
          }

          mat.needsUpdate = true;
        }
      }

      if (child.isLight) {
        child.castShadow = true;
        child.shadow.mapSize.set(4096, 4096);
        child.shadow.bias = -0.00008;
      }
    });
  }, [scene, gl]);
  
  // Setup key controls
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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // ─── setup mixer & center model ───────────────────────────────
  useEffect(() => {
    if (animations.length) {
      mixerRef.current = new THREE.AnimationMixer(scene);
    }

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    console.log('[Model] Scene box size:', box.getSize(new THREE.Vector3()));
    console.log('[Model] Scene center offset:', center);
  }, [animations, scene]);
  
  // Register moveForward callback
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
  
  // Main animation loop
  useFrame((state, delta) => {
    // Update animation mixer if exists
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    // Handle rotation - pure in-place rotation
    if (keyStates.current.rotateLeft) {
      camera.rotateY(rotateSpeed);
    }
    if (keyStates.current.rotateRight) {
      camera.rotateY(-rotateSpeed);
    }
    
    // Create a movement vector
    const movement = new THREE.Vector3();
    
    // Get camera's local directional vectors
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    
    // Remove any vertical (Y) component to keep movement horizontal
    forward.y = 0;
    forward.normalize();
    right.y = 0;
    right.normalize();
    
    // Apply movement according to key states
    if (keyStates.current.forward) {
      movement.add(forward.multiplyScalar(moveSpeed));
    }
    if (keyStates.current.backward) {
      const backDir = forward.clone().negate();
      movement.add(backDir.multiplyScalar(moveSpeed));
    }
    if (keyStates.current.right) {
      movement.add(right.multiplyScalar(moveSpeed));
    }
    if (keyStates.current.left) {
      const leftDir = right.clone().negate();
      movement.add(leftDir.multiplyScalar(moveSpeed));
    }
    
    // Apply movement if any
    if (movement.length() > 0) {
      camera.position.add(movement);
    }
  });
  
  return (
    <>
      {/* Scene */}
      <group ref={sceneRef}>
        <primitive object={scene} />
      </group>
      
      {/* Original lighting setup */}
      <Environment preset="warehouse" />
    </>
  );
};

// Main component wrapper that creates the Canvas
const GalleryScene = ({ registerMoveForward, onLoadingComplete }) => {
  return (
    <div className={styles.canvasContainer}>
      <Canvas 
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        onCreated={() => {
          if (onLoadingComplete) onLoadingComplete();
        }}
        gl={{ 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: .08 // Same as original for less intense lighting
        }}
        style={{ background: '#222' }} // Original background color
      >
        <GalleryWorld registerMoveForward={registerMoveForward} />
      </Canvas>
    </div>
  );
};

export default GalleryScene;