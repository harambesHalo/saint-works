"use client";
import { useDeviceContext } from '../lib/hooks/useDeviceContext';
import { useDevice } from '../lib/hooks/useDevice';
import { DeviceProvider } from '../providers/DeviceProvider';
import NavigationProvider from '../providers/NavigationProvider';
import Header from '../components/Header';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

// Create a context for Lenis if needed
import { createContext } from 'react';
export const LenisContext = createContext(null);

function LayoutContent({ children }) {
  const { isMobile, isClient } = useDeviceContext();
  const { deviceType } = useDevice();
  const lenisRef = useRef(null);
  const pathname = usePathname();
  
  // Log device type (you can remove this if not needed)
  deviceType ? console.log("User is Mobile", deviceType) : console.log("User not Mobile", deviceType);

  // Initialize Lenis with better cleanup
  useEffect(() => {
    if (!isClient) return;
    
    // Clean up any existing Lenis instance first
    if (window.lenis) {
      window.lenis.destroy();
      window.lenis = null;
    }
    
    // Configure body for scrolling
    document.body.style.cursor = 'default';
    
    // Determine if this page should use scrolling
    const shouldEnableScroll = true; // You can add logic here to disable on specific pages
    
    if (shouldEnableScroll) {
      // Remove overflow hidden to allow scrolling
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
      
      // Initialize Lenis
      const lenisOptions = {
        duration: isMobile ? 1.2 : 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
      };
      
      const lenisInstance = new Lenis(lenisOptions);
      
      // Store reference
      lenisRef.current = lenisInstance;
      window.lenis = lenisInstance; // For global access
      
      // Setup RAF
      let rafId;
      function raf(time) {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      
      rafId = requestAnimationFrame(raf);
      
      // Return cleanup function
      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        if (lenisInstance) {
          lenisInstance.destroy();
        }
        lenisRef.current = null;
      };
    } else {
      // If scrolling is disabled for this page
      document.body.style.overflowY = 'hidden';
    }
  }, [isMobile, isClient, pathname]); // Add pathname dependency to reinitialize on route changes

  return (
    <div className="flex flex-col h-screen min-h-screen w-full">
      <Header />
      <main className="main">{children}</main>
    </div>
  );
}

const ClientLayout = ({ children }) => {
  return (
    <DeviceProvider>
      <NavigationProvider>
        <LayoutContent>{children}</LayoutContent>
      </NavigationProvider>
    </DeviceProvider>
  );
}

export default ClientLayout;