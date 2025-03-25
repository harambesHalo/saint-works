'use client';
import styles from './page.module.scss'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
// Import fix - check if Lenis provides different exports
import Lenis from 'lenis'
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import Projects from '../components/Projects';
import Description from '../components/Description';
import SlidingImages from '../components/SlidingImages';
import Contact from '../components/Contact';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [lenis, setLenis] = useState(null);

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

  // Initialize Lenis manually instead of using ReactLenis component
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Simple loading without locomotive-scroll
    setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      document.body.style.overflowY = 'auto'; // Allow vertical scrolling
      document.body.style.overflowX = 'hidden'; // Prevent horizontal scrolling
      window.scrollTo(0, 0);
      
      // Initialize Lenis after loading
      const lenisOptions = {
        duration: isMobile ? 1.2 : 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false, // Usually better to disable smooth scrolling on touch devices
        touchMultiplier: 2,
      };
      
      const lenisInstance = new Lenis(lenisOptions);
      
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      
      requestAnimationFrame(raf);
      setLenis(lenisInstance);
      
      return () => {
        lenisInstance.destroy();
      };
    }, 2000);
  }, [isMobile]);

  // Provide Lenis instance to child components via context
  useEffect(() => {
    if (lenis) {
      window.lenis = lenis;
    }
  }, [lenis]);

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
