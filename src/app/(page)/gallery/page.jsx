'use client';

import { useDeviceContext } from "../../../lib/hooks/useDeviceContext";
import MobileGallery from "./components/mobile/MobileGallery/MobileGallery";
import styles from './style.module.scss';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GalleryPreloader from './components/desktop/GalleryLoader/GalleryLoader';
import Square from '@/common/SquareButton';

// Dynamically import the new GalleryScene component
const GalleryScene = dynamic(() => import('./components/desktop/GalleryScene/GalleryScene'), {
  ssr: false,
  loading: () => <p>Loading 3D...</p>,
});

const Gallery = () => {
  const { isMobile } = useDeviceContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [moveForwardFn, setMoveForwardFn] = useState(null);
  
  // Image URLs
  const imageUrls = [
    "/images/header.png",
    "/images/news.png",
    "/images/redline2.png",
    "/images/squiggle2.png",
    "/images/blue-ocean.png",
    "/images/weather.png",
    "/images/redline2.png",
  ];

  const handleClick = () => {
    if (moveForwardFn) moveForwardFn();
    setShowControls(true);
    
    // Hide controls after a delay
    setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    console.log("Loading Complete");
  };
  
  // Set up keyboard listener for the '?' key to toggle controls
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

  // Simplified rendering logic
  if (isMobile) {
    return <MobileGallery imageUrls={imageUrls} />;
  } else {
    return (
      <div className={styles.desktopGallery}>
        <GalleryScene 
          registerMoveForward={fn => setMoveForwardFn(() => fn)}
          onLoadingComplete={handleLoadingComplete}
        />

        {showPreloader && (
          <div className={styles.visiblePreloader}>
            <div className={styles.preloaderText}>
              <Square onClick={handleClick}>
                <p>Enter Gallery</p>
              </Square>
            </div>
            <GalleryPreloader
              onComplete={() => setShowPreloader(false)}
            />
          </div>
        )}
        
        {isLoaded && showControls && !showPreloader && (
          <div className={styles.controlsOverlay}>
            <div className={styles.controlsPanel}>
              <h3>Gallery Controls</h3>
              <ul>
                <li>W/Up Arrow: Move forward</li>
                <li>S/Down Arrow: Move backward</li>
                <li>A/Left Arrow: Move left</li>
                <li>D/Right Arrow: Move right</li>
                <li>Q: Rotate view left</li>
                <li>E: Rotate view right</li>
                <li>Press '?' to toggle this help menu</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Gallery;