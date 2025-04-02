// lib/hooks/useDevice.js
import { useDeviceContext } from './useDeviceContext';

export function useDevice() {
  const { isMobile, isClient } = useDeviceContext();
  
  // For backward compatibility with existing code
  return { 
    isMobile, 
    isClient,
    deviceType: isMobile ? 'mobile' : 'desktop' 
  };
}