'use client';

import { useState, useRef } from "react";
import { useDeviceContext } from "../../../lib/hooks/useDeviceContext";
import DesktopGallery from "./desktop/DesktopGallery";
import MobileGallery from "./mobile/MobileGallery";
import GalleryLoader from "./components/desktop/GalleryLoader";
import MobileGalleryLoader from "./components/mobile/MobileGalleryLoder"

const Gallery = () => {
  const { isMobile } = useDeviceContext();
  const [showLoader, setShowLoader] = useState(true);
  const wallRef = useRef(); // Move wallRef here

  const imageUrls = [
    "/images/header.png",
    "/images/news.png",
    "/images/redline2.png",
    "/images/squiggle2.png",
    "/images/blue-ocean.png",
    "/images/weather.png",
    "/images/redline2.png",
    "/medias/3d_gallery_wall.glb"
  ];

  const mobileImageUrls = [
    "/images/header.png",
    "/images/news.png",
    "/images/redline2.png",
    "/images/squiggle2.png",
    "/images/blue-ocean.png",
    "/images/weather.png",
    "/images/redline2.png",
  ];

  const handleEnterGallery = () => {
    // Trigger animation first
    if (wallRef.current) {
      wallRef.current.moveForward();
    }

    // Wait a sec for the animation to play before hiding loader
    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
  };

  const handleMobileEnterGallery = () => {
    // Mobile doesn't need animation, so just hide the loader directly
    setShowLoader(false);
  };

  return (
    <>
      {!showLoader && (
        isMobile ? <MobileGallery /> : <DesktopGallery />
      )}

      {showLoader && (
         isMobile ? 
         <MobileGalleryLoader 
            imageUrls={mobileImageUrls}
            onComplete={handleMobileEnterGallery}
         /> : 
         <GalleryLoader
            imageUrls={imageUrls}
            onComplete={handleEnterGallery}
        />
      )}
    </>
  );
};

export default Gallery;
