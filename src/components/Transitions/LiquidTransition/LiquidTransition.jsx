'use client';
import { useEffect, useState } from 'react';
import styles from './LiquidTransition.module.scss';

// This component focuses only on the liquid drip effect
export default function LiquidTransition({ onMidpoint, onComplete }) {
  useEffect(() => {
    // Call midpoint callback during the liquid animation
    const midpointTimer = setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 500); // Midpoint of the liquid animation
    
    // Call complete callback after liquid animation finishes
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000); // Total liquid animation time
    
    return () => {
      clearTimeout(midpointTimer);
      clearTimeout(completeTimer);
    };
  }, [onMidpoint, onComplete]);

  return (
    <div className={styles.transitionContainer}>
      <div className={styles.liquidContainer}>
        <div className={styles.blobs}>
          <div className={styles.liquid}></div>
          {/* Create specific number of blobs to match the CSS */}
          {Array(22).fill().map((_, i) => (
            <div key={i} className={styles.blob}></div>
          ))}
        </div>
      </div>
      
      {/* SVG Filter for the goo effect */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}