'use client';

import { useState, useRef } from "react";
import { useDeviceContext } from "../../../lib/hooks/useDeviceContext";
import DesktopGallery from "./desktop/DesktopGallery";
import MobileGallery from "./mobile/MobileGallery";
import GalleryLoader from "./components/GalleryLoader";

const Gallery = () => {
  const { isMobile } = useDeviceContext();
  const [showLoader, setShowLoader] = useState(true);
  const wallRef = useRef(); // 🔥 Move wallRef here

  const imageUrls = [
    "/images/news.png",
    "/images/redline2.png",
    "/images/squiggle2.png",
    "/images/header.png",
    "/images/blue-ocean.png",
    "/images/weather.png",
    "/images/redline2.png",
    "/medias/3d_gallery_wall.glb"
  ];

  const handleEnterGallery = () => {
    // 👇 Trigger animation first
    if (wallRef.current) {
      wallRef.current.moveForward();
    }

    // 👇 Wait a sec for the animation to play before hiding loader
    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
  };

  return (
    <>
      {!showLoader && (
        isMobile ? <MobileGallery /> : <DesktopGallery />
      )}

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
