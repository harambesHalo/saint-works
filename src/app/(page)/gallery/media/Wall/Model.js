import React, { useRef, useEffect } from 'react'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { AnimationMixer, Box3, Vector3 } from 'three'

export default function Model() {
  const { scene, animations } = useGLTF('/medias/3d_gallery_wall.glb')
  const { viewport, clock } = useThree()
  const modelRef = useRef(null)
  const mixerRef = useRef(null)
  const actionsRef = useRef([]) // Store animation actions here
  
  // Set up the AnimationMixer and store actions, but don't auto-play
  useEffect(() => {
    if (animations.length) {
      mixerRef.current = new AnimationMixer(scene)
      animations.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip)
        // Pause the action so it doesn't play automatically
        action.paused = true
        actionsRef.current.push(action)
        console.log("stored Animations", actionsRef)
      })
    }
  }, [animations, scene])

  // Center the model so it's not off-screen
  useEffect(() => {
    const box = new Box3().setFromObject(scene)
    const center = new Vector3()
    box.getCenter(center)
    scene.position.sub(center)
  }, [scene])

  // Update animations each frame
  useFrame(() => {
    if (mixerRef.current) {
      mixerRef.current.update(clock.getDelta())
    }
  })

  // Trigger animation on click
  const handleClick = () => {
    actionsRef.current.forEach((action) => {
      // Restart the animation from the beginning and play it
      action.reset()
      action.paused = false
      action.play()
    })
  }

  return (
    <>
      <group
        ref={modelRef}
        scale={viewport.width / 3.65}
        rotation={[0, 4.72, 0]}
        onClick={handleClick}
      >
        <primitive object={scene} />
      </group>
      {/* <OrbitControls /> */}
    </>
  )
}

// Preload the GLB
useGLTF.preload('/medias/test.glb')
