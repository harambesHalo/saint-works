'use client'
import Image from 'next/image'
import styles from './style.module.scss'
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { slideUp } from './animation';
import { motion } from 'framer-motion';
import DecorativeSVG from './DecorativeSVG';

export default function Home() {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const svgRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  let xPercent = 0;
  let direction = -1;

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

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    let scrollAnimation;
    
    if (!isMobile) {
      // Desktop animation
      scrollAnimation = gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.25,
          start: 0,
          end: window.innerHeight,
          onUpdate: e => direction = e.direction * -1
        },
        x: "-600px",
      });
      
      // Add animation for the SVG
      if (svgRef.current) {
        gsap.from(svgRef.current, {
          scrollTrigger: {
            trigger: document.documentElement,
            scrub: 0.5,
            start: "top top",
            end: "bottom bottom",
          },
          rotate: -10,
          scale: 0.9,
          opacity: 0.7,
          duration: 1.5
        });
      }
      
      requestAnimationFrame(animate);
    } else {
      // Simpler mobile animation
      scrollAnimation = gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.25,
          start: 0,
          end: window.innerHeight/2,
        },
        x: "-100px",
      });
      
      // Mobile SVG animation
      if (svgRef.current) {
        gsap.from(svgRef.current, {
          scrollTrigger: {
            trigger: document.documentElement,
            scrub: 0.5,
            start: "top top",
            end: "center center",
          },
          rotate: -5,
          scale: 0.95,
          opacity: 0.8,
          duration: 1
        });
      }
    }
    
    return () => {
      if (scrollAnimation) scrollAnimation.kill();
    };
  }, [isMobile]);

  // Link ScrollTrigger with Lenis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.lenis) {
      const linkLenisToScrollTrigger = () => {
        ScrollTrigger.update();
      };
      
      window.lenis.on('scroll', linkLenisToScrollTrigger);
      
      return () => {
        if (window.lenis) {
          window.lenis.off('scroll', linkLenisToScrollTrigger);
        }
      };
    }
  }, []);

  const animate = () => {
    if (isMobile) return; // Skip for mobile

    if(xPercent < -100){
      xPercent = 0;
    }
    else if(xPercent > 0){
      xPercent = -100;
    }
    gsap.set(firstText.current, {xPercent: xPercent})
    gsap.set(secondText.current, {xPercent: xPercent})
    requestAnimationFrame(animate);
    xPercent += 0.08 * direction;
  }

  return (
    <motion.main variants={slideUp} initial="initial" animate="enter" className={styles.landing}>
        <div className={styles.backgroundImageContainer}>
          <Image
            src="/images/header.png"
            fill={true}
            alt="background"
            priority
            className={styles.backgroundImage}
          />
        </div>
      <div className={styles.sliderContainer}>
        <div ref={slider} className={styles.slider}>
          <p ref={firstText}>Artist - Developer - MBA - Consultant -</p>
          <p ref={secondText}>Artist - Developer - MBA - Consultant -</p>
        </div>
      </div>
      <div data-scroll data-scroll-speed={0.1} className={styles.description}>
        <div className={styles.photoContainer}>
          <Image
            src="/images/profile_picture.jpg"
            fill={true}
            alt="background"
            priority
            sizes="(max-width: 768px) 100vw, 33vw" 
            style={{objectFit: 'cover'}}
          />
          <div className={styles.svgOverlay}>
            <DecorativeSVG ref={svgRef} className={styles.decorativeSvg} />
          </div>
        </div>
      </div>
    </motion.main>
  )
}