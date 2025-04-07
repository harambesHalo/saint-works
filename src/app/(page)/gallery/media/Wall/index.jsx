import { Canvas } from '@react-three/fiber';
import { Environment, useProgress } from '@react-three/drei';
import Model from './Model';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';


// Component to track loading progress
const LoadingTracker = ({ onLoaded }) => {
  const { progress, loaded, total, active } = useProgress();

  useEffect(() => {
    console.log(`[LoadingTracker] Progress: ${progress}% | Loaded: ${loaded}/${total} | Active: ${active}`);
    
    if (progress === 100 && loaded === total && active === false) {
      console.log("[LoadingTracker] Everything loaded, calling onLoaded()");
      onLoaded();
    }
  }, [progress, loaded, total, active, onLoaded]);

  return null;
};

const Wall = ({ registerMoveForward, onLoadingComplete }) => {
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    if (onLoadingComplete) {
      // This will trigger a Canvas remount when loading completes
      setCanvasKey(prev => prev + 1);
    }
  }, [onLoadingComplete]);

  return (
    <Canvas
      key={canvasKey} // 🔁 Force remount
      className={styles.wallParent}
      style={{ background: '#222' }}
    >
      <LoadingTracker onLoaded={onLoadingComplete} />
      <Model registerMoveForward={registerMoveForward} />
      <directionalLight intensity={0.75} position={[0, 2, 3]} />
      <Environment preset="city" />
    </Canvas>
  );
};
export default Wall;