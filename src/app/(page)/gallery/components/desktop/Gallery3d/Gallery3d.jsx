import { useRef, useState, useEffect } from "react";
import styles from "./Gallery3d.module.scss";
import dynamic from 'next/dynamic';
import GalleryPreloader from '@/app/(page)/gallery/components/desktop/GalleryLoader/GalleryLoader';

const Wall = dynamic(() => import('../../../media/Wall'), {
  ssr: false,
  loading: () => <p>Loading 3D...</p>,
});

const Gallery3d = () => {
  const moveForwardFn = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startExit, setStartExit] = useState(false);

  const handleClick = () => {
    if (moveForwardFn.current) moveForwardFn.current();
  };

  const handleLoadingComplete = () => {
    console.log("✅ 3D Model Loaded");

    // Wait for canvas remount before triggering animation
    requestAnimationFrame(() => {
      setStartExit(true); // this starts the animation after canvas mount
    });

    setIsLoaded(true);
  };

  return (
    <div className={styles.canvasContainer}>
      <Wall 
        registerMoveForward={fn => (moveForwardFn.current = fn)} 
        onLoadingComplete={handleLoadingComplete}
      />

      {/* ⬇️ Preloader stays mounted, exits when `startExit` is true */}
      <GalleryPreloader
        startExit={startExit}
        onComplete={() => console.log("🧹 Preloader exit complete")}
      />

      <button 
        onClick={handleClick}
        disabled={!isLoaded}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          background: isLoaded ? '#fff' : '#888',
          color: isLoaded ? '#000' : '#ccc',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoaded ? 'pointer' : 'not-allowed',
          zIndex: 10
        }}
      >
        Enter Gallery
      </button>
    </div>
  );
};

export default Gallery3d;
