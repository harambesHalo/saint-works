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
  const [showControls, setShowControls] = useState(true);
  const buttonRef = useRef();

  const handleClick = () => {
    if (moveForwardFn.current) moveForwardFn.current();

    // Hide the button without re-rendering
    if (buttonRef.current) {
      buttonRef.current.style.opacity = 0;
      buttonRef.current.style.pointerEvents = "none";
    }
    
    // Show controls for a brief period
    setShowControls(true);
    setTimeout(() => {
      setShowControls(false);
    }, 5000); // Hide after 5 seconds
  };

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    console.log("Loading Complete");
  };
  
  // Show controls when pressing '?' key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '?') {
        setShowControls(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

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
      
      {showControls && !showPreloader && (
        <div className={styles.controlsOverlay}>
          <div className={styles.controlsPanel}>
            <h3>Gallery Controls</h3>
            <ul>
              <li>Arrow Keys / WASD: Move around</li>
              <li>Q/E: Rotate view</li>
              <li>Press '?' to toggle this help menu</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery3d;