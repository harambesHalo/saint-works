'use client';
import React, { useState, useRef } from 'react';
import styles from './style.module.scss';

export default function Project({index, title, manageModal, isMobile}) {
  // Track touch start position to differentiate between taps and scrolls
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isScrolling = useRef(false);
  
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    isScrolling.current = false;
  };
  
  const handleTouchMove = (e) => {
    // If the user moves more than 10px, consider it scrolling, not tapping
    if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10 ||
        Math.abs(e.touches[0].clientX - touchStartX.current) > 10) {
      isScrolling.current = true;
    }
  };
  
  const handleTouchEnd = (e) => {
    // Only open modal if user wasn't scrolling
    if (!isScrolling.current) {
      if (isMobile) {
        // Always center the modal on mobile
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        manageModal(true, index, x, y);
      }
    }
  };

  const handleInteraction = (isEntering, e) => {
    // For desktop hover/click only
    if (!isMobile) {
      manageModal(isEntering, index, e.clientX, e.clientY);
    }
  };
  
  // Handle keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Center the modal for keyboard users
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      manageModal(true, index, x, y);
    }
  };

  return (
    <div 
      onMouseEnter={(e) => !isMobile && handleInteraction(true, e)} 
      onMouseLeave={(e) => !isMobile && handleInteraction(false, e)}
      onClick={(e) => !isMobile && handleInteraction(true, e)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      className={`${styles.project} ${isMobile ? styles.projectMobile : ''}`}
      aria-label={`View ${title} project`}
      tabIndex={0}
      role="button"
    >
      <h2>{title}</h2>
      <p>Design & Development</p>
      {isMobile && <span className={styles.tapHint}>Tap to view</span>}
    </div>
  );
}