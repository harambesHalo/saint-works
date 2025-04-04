'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './LiquidTransition.module.scss';

// This component combines liquid drip effect with your existing page transition
export default function LiquidTransition({ onComplete }) {
  const [liquidComplete, setLiquidComplete] = useState(false);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
    
    // Trigger the second phase of animation after liquid effect completes
    const timer = setTimeout(() => {
      setLiquidComplete(true);
      // Allow some time for the second animation to start before calling onComplete
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 1000); // Increased to match the slower liquid animation (4.5s)
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Second phase animation (your existing curve animation)
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curveVariant = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
    }
  };

  // Slide transition for phase 2
  const slideTransition = {
    initial: {
      top: 0
    },
    exit: {
      top: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
    }
  };

  return (
    <div className={styles.transitionContainer}>
      {/* First phase: Liquid drip effect */}
      {!liquidComplete && (
        <div className={styles.liquidContainer}>
          <div className={styles.blobs}>
            <div className={styles.liquid}></div>
            {/* Create specific number of blobs to match the CSS */}
            {Array(40).fill().map((_, i) => (
              <div key={i} className={styles.blob}></div>
            ))}
          </div>
        </div>
      )}
      
      {/* Second phase: Your original page transition */}
      {liquidComplete && dimension.width > 0 && (
        <motion.div
          variants={slideTransition}
          initial="initial"
          exit="exit"
          className={styles.pageTransition}
        >
          <svg>
            <motion.path variants={curveVariant} initial="initial" exit="exit"></motion.path>
          </svg>
        </motion.div>
      )}
    </div>
  );
}