"use client";

import { useState } from "react";
import { useDeviceContext } from "../../../lib/hooks/useDeviceContext";
import DesktopGallery from "./desktop/DesktopGallery";
import MobileGallery from "./mobile/MobileGallery";
import GalleryLoader from "./components/GalleryLoader";

const Gallery = () => {
  const { isMobile, isClient } = useDeviceContext();
  const [showLoader, setShowLoader] = useState(true);
  
  // Collection of all image URLs from both galleries
  const imageUrls = [
    "/images/news.png",
    "/images/redline2.png",
    "/images/squiggle2.png",
    "/images/header.png",
    "/images/blue-ocean.png",
    "/images/weather.png",
    "/images/redline.png"
  ];

  const handleEnterGallery = () => {
    // When button is clicked, hide the loader and show the gallery
    setShowLoader(false);
  };

  return (
    <>
      {/* First show the gallery (it will appear when loader is gone) */}
      {!showLoader && (
        isMobile ? <MobileGallery /> : <DesktopGallery />
      )}
      
      {/* Show the loader overlay while loading/waiting for user action */}
      {showLoader && (
        <GalleryLoader 
          imageUrls={imageUrls} 
          onComplete={handleEnterGallery} 
        />
      )}
    </>
  );
};

export default Gallery;