'use client';

import { useDeviceContext } from "../../../lib/hooks/useDeviceContext";
import MobileGallery from "./components/mobile/MobileGallery/MobileGallery";
import Gallery3d from "./components/desktop/Gallery3d/Gallery3d";
import styles from './style.module.scss';

const Gallery = () => {
  const { isMobile } = useDeviceContext();
  
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

  // Simplified rendering logic
  if (isMobile) {
    return <MobileGallery imageUrls={imageUrls} />;
  } else {
    return (
        <div className={styles.desktopGallery}>
            <Gallery3d />
        </div>
    );
  }
};

export default Gallery;