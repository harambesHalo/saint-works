'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './WipeTransition.module.scss';
import { slideUp } from './anim';

export default function WipeTransition({ onMidpoint, onComplete }) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
    
    // Call midpoint callback during the wipe animation
    const midpointTimer = setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 300); // Midpoint of the wipe animation
    
    // Call complete callback after animation finishes
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 800); // Total animation time
    
    return () => {
      clearTimeout(midpointTimer);
      clearTimeout(completeTimer);
    };
  }, [onMidpoint, onComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: {duration: 0.7, ease: [0.76, 0, 0.24, 1]}
    },
    exit: {
      d: targetPath,
      transition: {duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3}
    }
  };

  return (
    dimension.width > 0 ? (
      <motion.div 
        variants={slideUp} 
        initial="initial" 
        exit="exit" 
        className={styles.pageTransition}
      >
        <svg>
          <motion.path 
            variants={curve} 
            initial="initial" 
            exit="exit"
          ></motion.path>
        </svg>
      </motion.div>
    ) : null
  );
}