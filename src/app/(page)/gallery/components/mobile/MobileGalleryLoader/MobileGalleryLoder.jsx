"use client";
import { useState, useEffect } from "react";
import styles from "./MobileGalleryLoader.module.scss";
import Square from '@/common/SquareButton';
import Image from 'next/image';

const MobileGalleryLoader = ({ onComplete, imageUrls }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = imageUrls.length;

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
    // Just directly call onComplete without any animations
    onComplete();
  };

  return (
    <div>
      <div className={styles.backgroundContainer}>
        <Image
            src="/images/gallery-wall.png"
            fill={true}
            alt="background"
            priority
            className={styles.backgroundImage}
          />
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

export default MobileGalleryLoader;