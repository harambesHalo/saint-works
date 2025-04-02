"use client";

import { useDeviceContext } from "../../../lib/hooks/useDeviceContext";
import DesktopGallery from "./desktop/DesktopGallery";
import MobileGallery from "./mobile/MobileGallery";

const Gallery = () => {
  const { isMobile, isClient } = useDeviceContext();

  return <>{isMobile ? <MobileGallery /> : <DesktopGallery />}</>;
};

export default Gallery;
