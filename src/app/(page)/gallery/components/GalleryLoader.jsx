"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./GalleryLoader.module.scss";
import Square from '@/common/SquareButton';
import dynamic from 'next/dynamic';

const Wall = dynamic(() => import('../media/Wall'), {
  ssr: false,
  loading: () => <p>Loading 3D...</p>,
});

const GalleryLoader = ({ onComplete, imageUrls }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = imageUrls.length;
  const moveForwardFn = useRef(null);

  useEffect(() => {
    const imagePromises = imageUrls.map((src) => {
      return new Promise((resolve) => {
        const img = typeof window !== 'undefined' ? new window.Image() : null;
        if (!img) return resolve();
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

    Promise.all(imagePromises)
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error("Error loading images:", err);
        setIsLoading(false);
      });
  }, [imageUrls]);

  const handleClick = () => {
    if (moveForwardFn.current) {
      moveForwardFn.current();
    }
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div>
      <div className={styles.backgroundContainer}>
        <div className={styles.galleryMedia}>
          <Wall registerMoveForward={fn => (moveForwardFn.current = fn)} />
        </div>
      </div>
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
    </div>
  );
};

export default GalleryLoader;
