"use client";
import { useState, useEffect } from "react";
import styles from "./GalleryLoader.module.scss";
import Square from '../../../../common/SquareButton';
import Image from "next/image";

const GalleryLoader = ({ onComplete, imageUrls }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = imageUrls.length;

  useEffect(() => {
    // Create an array to track loaded images
    const imagePromises = imageUrls.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setLoadedCount((prev) => prev + 1);
          resolve();
        };
        img.onerror = () => {
          // Still count errors as "loaded" to prevent getting stuck
          setLoadedCount((prev) => prev + 1);
          resolve();
        };
      });
    });

    // When all images are loaded, set loading to false
    Promise.all(imagePromises)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading images:", err);
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, [imageUrls]);

  return (
    <div>
      <div className={styles.backgroundContainer}>
        <Image
          src="/images/gallery-wall.png"
          fill={true}
          alt="background"
          priority
          className={styles.galleryWallImg}
        />
      </div>
      <div className={styles.loader}>
        <div className={styles.loaderContent}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>
                Loading Gallery ({loadedCount}/{totalImages})
              </p>
            </div>
          ) : (
            <Square onClick={onComplete}>
                <p>Enter Gallery</p>
            </Square>
            // <button className={styles.enterButton} onClick={onComplete}>
            //   Enter Gallery
            // </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryLoader;
