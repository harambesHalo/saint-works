'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './GalleryLoader.module.scss';
import WipeTransition from '@/components/Transitions/WipeTransition/WipeTranstion';

export default function GalleryPreloader({ startExit, onComplete }) {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    if (startExit) {
      const timer = setTimeout(() => {
        setShouldShow(false); // Trigger exit animation
      }, 50); // small delay if needed

      return () => clearTimeout(timer);
    }
  }, [startExit]);

  return (
    <div className={styles.AboutPreloaderContainer}>
      <AnimatePresence mode="wait" onExitComplete={onComplete}>
        {shouldShow && (
          <WipeTransition 
            key="wipe-transition"
            onMidpoint={() => {}}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
