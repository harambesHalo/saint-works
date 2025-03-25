'use client';
import styles from './page.module.scss'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import Projects from '../components/Projects';
import Description from '../components/Description';
import SlidingImages from '../components/SlidingImages';
import Contact from '../components/Contact';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    (
      async () => {
        try {
          const LocomotiveScroll = (await import('locomotive-scroll')).default;
          
          // Only use smooth scrolling on desktop
          if (!isMobile) {
            const locomotiveScroll = new LocomotiveScroll();
          }

          setTimeout(() => {
            setIsLoading(false);
            document.body.style.cursor = 'default';
            document.body.style.overflowY = 'auto'; // Allow vertical scrolling
            document.body.style.overflowX = 'hidden'; // Prevent horizontal scrolling
            window.scrollTo(0,0);
          }, 2000);
        } catch (error) {
          console.error("Error initializing scroll:", error);
          setIsLoading(false);
          document.body.style.cursor = 'default';
          document.body.style.overflowY = 'auto';
          document.body.style.overflowX = 'hidden';
        }
      }
    )()
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
  )
}