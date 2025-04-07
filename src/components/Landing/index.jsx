'use client'
import Image from 'next/image'
import styles from './style.module.scss'
import { useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { slideUp } from './animation';
import { motion } from 'framer-motion';
import DecorativeSVG from './DecorativeSVG';
import { useDeviceContext } from '../../lib/hooks/useDeviceContext';

export default function Home() {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const svgRef = useRef(null);
  const { isMobile, isClient } = useDeviceContext();

  useLayoutEffect(() => { 
    if (!isClient) return; 
    
    gsap.registerPlugin(ScrollTrigger); 
    
    let scrollAnimation; 
    let xPercent = 0; 
    let direction = -1; 
    
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
      
      // Use GSAP ticker instead of requestAnimationFrame 
      const tickerFunction = () => { 
        if (!firstText.current || !secondText.current) return; 
        
        if(xPercent < -100){ 
          xPercent = 0; 
        } 
        else if(xPercent > 0){ 
          xPercent = -100; 
        } 
        gsap.set(firstText.current, {xPercent: xPercent}); 
        gsap.set(secondText.current, {xPercent: xPercent}); 
        xPercent += 0.08 * direction; 
      }; 
      
      gsap.ticker.add(tickerFunction); 
      
      return () => { 
        if (scrollAnimation) scrollAnimation.kill(); 
        gsap.ticker.remove(tickerFunction); 
      }; 
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

      const mobileTickerFunction = () => {
        if (!firstText.current || !secondText.current) return;
        
        if(xPercent < -100) {
          xPercent = 0;
        }
        else if(xPercent > 0) {
          xPercent = -100;
        }
        
        gsap.set(firstText.current, {xPercent: xPercent});
        gsap.set(secondText.current, {xPercent: xPercent});
        // Use a smaller increment for mobile for smoother animation
        xPercent += 0.04 * direction;
      };
      
      gsap.ticker.add(mobileTickerFunction);
      
      return () => { 
        if (scrollAnimation) scrollAnimation.kill();
        gsap.ticker.remove(mobileTickerFunction);
      }; 
    } 
  }, [isMobile, isClient]);

  // Link ScrollTrigger with Lenis
  useEffect(() => {
    if (!isClient || !window.lenis) return;

    const linkLenisToScrollTrigger = () => {
      ScrollTrigger.update();
    };
    
    window.lenis.on('scroll', linkLenisToScrollTrigger);
    
    return () => {
      if (window.lenis) {
        window.lenis.off('scroll', linkLenisToScrollTrigger);
      }
    };
  }, [isClient]);

  return (
    <motion.main variants={slideUp} initial="initial" animate="enter" className={styles.landing}>
        <div className={styles.backgroundImageContainer}>
          <Image
            src="/images/piece-3.jpg"
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