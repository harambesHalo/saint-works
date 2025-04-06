import { useState, useEffect, useRef } from "react";
import styles from "./GalleryLoader.module.scss";
import Square from '@/common/SquareButton';
import dynamic from 'next/dynamic';
import DesktopGallery from '@/app/(page)/gallery/desktop/DesktopGallery';

const Wall = dynamic(() => import('../../../media/Wall'), {
  ssr: false,
  loading: () => <p>Loading 3D...</p>,
});

const GalleryLoader = ({ imageUrls }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const totalImages = imageUrls.length;
  const moveForwardFn = useRef(null);

  useEffect(() => {
    const imagePromises = imageUrls.map((src) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          setLoadedCount((prev) => prev + 1);
          resolve();
        };
        img.onerror = () => {
          setLoadedCount((prev) => prev + 1);
          resolve();
        };
      });
    });

    Promise.all(imagePromises).then(() => setIsLoading(false));
  }, [imageUrls]);

  const handleClick = () => {
    if (moveForwardFn.current) moveForwardFn.current();
  };

  return (
    <div className={styles.loaderWrapper}>
      {/* Canvas Container */}
      <div className={styles.canvasContainer}>
        <Wall registerMoveForward={fn => (moveForwardFn.current = fn)} onEnteredGallery={() => setShowOverlay(true) } />
      </div>

      {/* UI Loader */}
      {!showOverlay && (
        <div className={styles.loader}>
          <div className={styles.loaderContent}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading Gallery ({loadedCount}/{totalImages})</p>
              </div>
            ) : (
              <Square onClick={handleClick}>
                <p>Enter Gallery</p>
              </Square>
            )}
          </div>
        </div>
      )}

      {/* Overlay Art Images */}
      {showOverlay && (
        <div className={styles.galleryOverlay}>
        </div>
      )}
    </div>
  );
};

export default GalleryLoader;
