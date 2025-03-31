'use client';
import styles from './page.module.scss'
import { useEffect, useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis'
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import Projects from '../components/Projects';
import Description from '../components/Description';
import SlidingImages from '../components/SlidingImages';
import Contact from '../components/Contact';

// Create a context for Lenis if needed
import { createContext } from 'react';
export const LenisContext = createContext(null);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize(); // Check initially
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Initialize Lenis with better cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let timeoutId;
    
    // Setup loading timeout
    timeoutId = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
      window.scrollTo(0, 0);
      
      // Initialize Lenis after loading
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
        window.lenis = null;
        lenisRef.current = null;
      };
    }, 2000);
    
    // Cleanup timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMobile]);

  return (
    <main className={styles.main}>
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Landing />
      <Description />
      <Projects />
      <SlidingImages />
      <Contact />
    </main>
  );
}