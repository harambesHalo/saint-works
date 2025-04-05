'use client';

import { useState, useEffect } from "react";
import { useDeviceContext } from "../../../lib/hooks/useDeviceContext";
import DesktopGallery from "./desktop/DesktopGallery";
import MobileGallery from "./mobile/MobileGallery";
import GalleryLoader from "./components/desktop/GalleryLoader";
import MobileGalleryLoader from "./components/mobile/MobileGalleryLoder";
import InitialGalleryPreloader from "./components/desktop/InitialGalleryPreloader";

// Inline styles to prevent flash of white
const containerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#000000', // Black background
  overflow: 'hidden',
  zIndex: 1
};

const Gallery = () => {
  const { isMobile, isClient } = useDeviceContext();
  
  // Three possible states: "preloading", "loading3d", "gallery"
  const [loadingState, setLoadingState] = useState("preloading");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Assets and URLs
  const imageUrls = [
    "/images/header.png",
    "/images/news.png",
    "/images/redline2.png",
    "/images/squiggle2.png",
    "/images/blue-ocean.png",
    "/images/weather.png",
    "/images/redline2.png",
  ];
  
  const critical3dAssets = [
    // "/medias/3d_gallery_wall.glb",
    "/medias/room5.glb",
    ...imageUrls
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

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    
    // Set initial body background to black to prevent white flashes
    document.body.style.backgroundColor = "#000000";
    
    return () => {
      // Restore default background when component unmounts
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Handle completion of the initial preloading step
  const handlePreloadComplete = () => {
    setIsTransitioning(true);
    // Add a short delay to ensure smooth transition
    setTimeout(() => {
      setLoadingState("loading3d");
      setIsTransitioning(false);
    }, 100);
  };

  // Handle when the gallery loader completes
  const handleEnterGallery = () => {
    setIsTransitioning(true);
    // Add a short delay to ensure smooth transition
    setTimeout(() => {
      setLoadingState("gallery");
      setIsTransitioning(false);
    }, 100);
  };

  // Wrapper component to prevent flashes during transitions
  const renderWithTransitionPrevention = (ComponentToRender, props = {}) => {
    return (
      <div style={containerStyle}>
        {isTransitioning ? (
          // Show a black div during component transitions
          <div style={{width: '100%', height: '100%', backgroundColor: '#000000'}}></div>
        ) : (
          <ComponentToRender {...props} />
        )}
      </div>
    );
  };

  // If not yet hydrated, show a black screen
  if (!isHydrated) {
    return <div style={containerStyle}></div>;
  }

  // Mobile doesn't need the initial preloader
  if (isMobile) {
    if (loadingState === "preloading" || loadingState === "loading3d") {
      return renderWithTransitionPrevention(MobileGalleryLoader, {
        imageUrls: mobileImageUrls,
        onComplete: handleEnterGallery
      });
    } else {
      return renderWithTransitionPrevention(MobileGallery);
    }
  } 
  
  // Desktop flow with three distinct loading steps
  else {
    if (loadingState === "preloading") {
      return renderWithTransitionPrevention(InitialGalleryPreloader, {
        assets: critical3dAssets,
        onComplete: handlePreloadComplete
      });
    } else if (loadingState === "loading3d") {
      return renderWithTransitionPrevention(GalleryLoader, {
        imageUrls: imageUrls,
        onComplete: handleEnterGallery
      });
    } else {
      return renderWithTransitionPrevention(DesktopGallery);
    }
  }
};

export default Gallery;