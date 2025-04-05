'use client';
import styles from './page.module.scss'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
import { useDeviceContext } from '../lib/hooks/useDeviceContext'
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import Projects from '../components/Projects';
import Description from '../components/Description';
import SlidingImages from '../components/SlidingImages';
import Contact from '../components/Contact';

export default function Home() {
  const { isClient } = useDeviceContext();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize loading state and cleanup without Lenis
  useEffect(() => {
    if (!isClient) return;
    
    let timeoutId;
    
    // Setup loading timeout
    timeoutId = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      // Note: we're no longer handling scrolling here, just cursor and loading state
      window.scrollTo(0, 0);
    }, 2000);
    
    // Cleanup timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isClient]);

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