import { useRef, useState, useEffect } from "react";
import styles from "./Gallery3d.module.scss";
import dynamic from 'next/dynamic';
import GalleryPreloader from '@/app/(page)/gallery/components/desktop/GalleryLoader/GalleryLoader';
import Square from '@/common/SquareButton';

const Wall = dynamic(() => import('../../../media/Wall'), {
  ssr: false,
  loading: () => <p>Loading 3D...</p>,
});

const Gallery3d = ({ imageUrls }) => {
  const moveForwardFn = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const buttonRef = useRef();

  const handleClick = () => {
    if (moveForwardFn.current) moveForwardFn.current();

    // Hide the button without re-rendering
    if (buttonRef.current) {
      buttonRef.current.style.opacity = 0;
      buttonRef.current.style.pointerEvents = "none";
    }
  };

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    console.log("Loading Complete");
  };

  return (
    <div className={styles.canvasContainer}>
      <Wall 
        registerMoveForward={fn => (moveForwardFn.current = fn)} 
        onLoadingComplete={handleLoadingComplete}
      />

      {showPreloader && (
        <div className={styles.visiblePreloader}>
          <div className={styles.preloaderText} ref={buttonRef}>
            <Square onClick={handleClick}>
              <p>Enter Gallery</p>
            </Square>
          </div>
          <GalleryPreloader
            onComplete={() => setShowPreloader(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery3d;
