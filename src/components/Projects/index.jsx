'use client';
import styles from './style.module.scss'
import { useState, useEffect, useRef } from 'react';
import Project from './components/project';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import Rounded from '../../common/RoundedButton';
import { useDeviceContext } from '../../lib/hooks/useDeviceContext';

const projects = [
  {
    title: "Studio Work",
    src: "piece-8.jpg",
    color: "#000000"
  },
  {
    title: "Ariel Photography",
    src: "ariel_image.jpg",
    color: "#8C8C8C"
  },
  {
    title: "MTG Alters",
    src: "wb-2.png",
    color: "#EFE8D3"
  },
  {
    title: "Your Accounting Friend",
    src: "yaf.png",
    color: "#706D63"
  }
]

const scaleAnimation = {
    initial: {scale: 0, x:"-20%", y:"-20%"},
    enter: {scale: 1, x:"-20%", y:"-20%", transition: {duration: 0.4, ease: [0.76, 0, 0.24, 1]}},
    closed: {scale: 0, x:"-20%", y:"-20%", transition: {duration: 0.4, ease: [0.32, 0, 0.67, 0]}}
}

export default function Home() {
  const { isMobile, isClient } = useDeviceContext();
  const [modal, setModal] = useState({active: false, index: 0})
  const { active, index } = modal;
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  let xMoveContainer = useRef(null);
  let yMoveContainer = useRef(null);
  let xMoveCursor = useRef(null);
  let yMoveCursor = useRef(null);
  let xMoveCursorLabel = useRef(null);
  let yMoveCursorLabel = useRef(null);

  useEffect(() => {
    // Initialize GSAP animations only if client-side and not mobile
    if (!isClient || isMobile) {
      return;
    }
    
    // Move Container
    xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", {duration: 0.8, ease: "power3"});
    yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", {duration: 0.8, ease: "power3"});
    
    // Move cursor
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", {duration: 0.5, ease: "power3"});
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", {duration: 0.5, ease: "power3"});
    
    // Move cursor label
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", {duration: 0.45, ease: "power3"});
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", {duration: 0.45, ease: "power3"});
  }, [isMobile, isClient]);

  // Handle mobile touch events to close modal when tapping outside
  useEffect(() => {
    if (!isClient || !isMobile) return;
    
    const handleTouchOutside = (e) => {
      if (active && modalContainer.current && !modalContainer.current.contains(e.target)) {
        setModal({active: false, index: 0});
      }
    };
    
    document.addEventListener('touchend', handleTouchOutside);
    return () => {
      document.removeEventListener('touchend', handleTouchOutside);
    };
  }, [active, isMobile, isClient]);

  const moveItems = (x, y) => {
    if (!isClient || isMobile || 
        !xMoveContainer.current || !yMoveContainer.current || 
        !xMoveCursor.current || !yMoveCursor.current ||
        !xMoveCursorLabel.current || !yMoveCursorLabel.current) {
      return; // Guard clause if animations aren't initialized or on mobile
    }
    
    xMoveContainer.current(x);
    yMoveContainer.current(y);
    xMoveCursor.current(x);
    yMoveCursor.current(y);
    xMoveCursorLabel.current(x);
    yMoveCursorLabel.current(y);
  }
  
  const manageModal = (active, index, x, y) => {
    
    if (isMobile) {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }

    moveItems(x, y);
    setModal({active, index});
  }

  useEffect(() => {
    if (!isClient || !active) return;
    
    const handleClickOutside = (e) => {
      // Check if click is outside the modal
      if (modalContainer.current && !modalContainer.current.contains(e.target)) {
        setModal({active: false, index: 0});
      }
    };
    
    // Use the right event for mobile vs desktop
    const eventType = isMobile ? 'touchend' : 'mousedown';
    document.addEventListener(eventType, handleClickOutside);
    
    return () => {
      document.removeEventListener(eventType, handleClickOutside);
    };
  }, [active, isMobile, isClient]);
  
  return (
    <main 
      onMouseMove={(e) => !isMobile && moveItems(e.clientX, e.clientY)} 
      className={styles.projects}
      id="work"
    >
      <div className={styles.body}>
        {
          projects.map((project, index) => {
            return <Project 
              index={index} 
              title={project.title} 
              manageModal={manageModal} 
              isMobile={isMobile}
              key={index}
            />
          })
        }
      </div>
      <Rounded>
        <p>More work</p>
      </Rounded>
      <>
        <motion.div 
          ref={modalContainer} 
          variants={scaleAnimation} 
          initial="initial" 
          animate={active ? "enter" : "closed"} 
          className={styles.modalContainer}
        >
          <div style={{top: index * -100 + "%"}} className={styles.modalSlider}>
            {
              projects.map((project, index) => {
                const { src, color } = project;
                return (
                  <div 
                    className={styles.modal} 
                    style={{backgroundColor: color}} 
                    key={`modal_${index}`}
                  >
                    <Image 
                      src={`/images/${src}`}
                      width={350}
                      height={350}
                      sizes="(max-width: 768px) 100vw, 33vw" 
                      style={{ height: 'auto', objectFit: 'contain' }}
                      alt={`${project.title} project image`}
                    />
                  </div>
                )
              })
            }
          </div>
        </motion.div>
        <motion.div 
          ref={cursor} 
          className={styles.cursor} 
          variants={scaleAnimation} 
          initial="initial" 
          animate={active ? "enter" : "closed"}
        ></motion.div>
        <motion.div 
          ref={cursorLabel} 
          className={styles.cursorLabel} 
          variants={scaleAnimation} 
          initial="initial" 
          animate={active ? "enter" : "closed"}
        >
          View
        </motion.div>
      </>
    </main>
  )
}