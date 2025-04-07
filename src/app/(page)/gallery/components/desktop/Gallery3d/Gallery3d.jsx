import { useRef, useState } from "react";
import styles from "./Gallery3d.module.scss";
import dynamic from 'next/dynamic';
import GalleryPreloader from '@/app/(page)/gallery/components/desktop/GalleryLoader/GalleryLoader';

const Wall = dynamic(() => import('../../../media/Wall'), {
  ssr: false,
  loading: () => <p>Loading 3D...</p>,
});

const Gallery3d = ({ imageUrls }) => {
  const moveForwardFn = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const handleClick = () => {
    if (moveForwardFn.current) moveForwardFn.current();
  };

  const handleLoadingComplete = () => {
    setIsLoaded(true); // triggers preloader to finish\
    console.log("Loading Complete")
  };

  return (
    <div className={styles.canvasContainer}>
      <Wall 
        registerMoveForward={fn => (moveForwardFn.current = fn)} 
        onLoadingComplete={handleLoadingComplete}
      />

      {/* ⬇️ GalleryPreloader wraps the transition effect */}
      {showPreloader && (
        <GalleryPreloader
          onComplete={() => setShowPreloader(false)} // only hide after animation
        />
      )}

      {/* Button always available, optionally disable it until loaded */}
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
