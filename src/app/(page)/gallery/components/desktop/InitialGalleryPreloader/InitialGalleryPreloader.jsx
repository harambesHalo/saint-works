"use client";
import { useState, useEffect } from "react";
import styles from "./InitialGalleryPreloader.module.scss";

const InitialGalleryPreloader = ({ onComplete, assets }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    let loaded = 0;
    const total = assets.length;
    
    // Preload all critical assets including the 3D model
    const preloadPromises = assets.map(url => {
      return new Promise((resolve) => {
        if (url.endsWith('.glb')) {
          // For 3D models, use fetch
          fetch(url)
            .then(() => {
              loaded++;
              setProgress(Math.floor((loaded / total) * 100));
              resolve();
            })
            .catch(error => {
              console.error(`Error preloading ${url}:`, error);
              loaded++;
              setProgress(Math.floor((loaded / total) * 100));
              resolve();
            });
        } else {
          // For images, use Image object
          const img = new Image();
          img.src = url;
          img.onload = () => {
            loaded++;
            setProgress(Math.floor((loaded / total) * 100));
            resolve();
          };
          img.onerror = () => {
            console.error(`Error preloading ${url}`);
            loaded++;
            setProgress(Math.floor((loaded / total) * 100));
            resolve();
          };
        }
      });
    });
    
    // When all assets are loaded, complete
    Promise.all(preloadPromises)
      .then(() => {
        // Set ready state first
        setIsReady(true);
        
        // Add small delay to ensure everything is ready
        // This prevents flashes during component transitions
        setTimeout(() => {
          onComplete();
        }, 500);
      })
      .catch(error => {
        console.error("Error during preloading:", error);
        setIsReady(true);
        // Still complete even if there are errors
        setTimeout(() => {
          onComplete();
        }, 500);
      });
  }, [assets, onComplete]);

  return (
    <div className={styles.preloader}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <h2>Loading Gallery</h2>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>{progress}%</p>
      </div>
    </div>
  );
};

export default InitialGalleryPreloader;