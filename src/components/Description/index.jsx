import styles from './style.module.scss';
import { useInView, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { slideUp, hangingAnimation, finalPendulumSwing } from './animation';
import Image from 'next/image';

export default function index() {
    const phrase = "Art and oddities out of Boise.Idaho";
    const description = useRef(null);
    const imageRef = useRef(null);
    const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
    const [swingTriggered, setSwingTriggered] = useState(false);
    const [lightOn, setLightOn] = useState(false);
    
    // InView for initial animations
    const isInView = useInView(description, { once: true, amount: 0.2 });
    
    // InView for triggering the swing
    const isSwingTrigger = useInView(imageRef, { 
        once: true,
        amount: 0.95,
        margin: "0px 0px -300px 0px" // Trigger when scrolled further down
    });
    
    // Handle the initial animation completion
    useEffect(() => {
        if (isInView) {
            // Set a timer to mark when the initial hanging animation is complete
            const timer = setTimeout(() => {
                setInitialAnimationComplete(true);
            }, 2000);
            
            const lightTimer = setTimeout(() => {
              setLightOn(true); // Turn on the light after 2 seconds
            }, 2000);// Turn on the light when the animation is complete

            return () => {
              clearTimeout(timer)
              clearTimeout(lightTimer);
            };
        } else {
            setInitialAnimationComplete(false);
            setSwingTriggered(false);
            setLightOn(false);
        }
    }, [isInView, setLightOn]);
    
    // Handle the swing trigger separately
    useEffect(() => {
        if (isSwingTrigger && initialAnimationComplete && !swingTriggered) {
            setSwingTriggered(true);
        }
    }, [isSwingTrigger, initialAnimationComplete, swingTriggered]);
    
    // Lenis scroll integration
    useEffect(() => {
      if (description.current && typeof window !== 'undefined' && window.lenis) {
        const scrollElements = description.current.querySelectorAll('[data-scroll]');
        
        if (scrollElements.length) {
          window.lenis.on('scroll', () => {
            // This could be used to update any specific scroll animations
          });
        }
        
        return () => {
          if (window.lenis) {
            window.lenis.off('scroll');
          }
        };
      }
    }, []);

    return (
        <div ref={description} className={styles.description}>
          {/* Layered background elements */}
          <div className={styles.slatWallSegment}></div>
            <div 
              className={styles.spotlight} 
              style={{ 
                opacity: lightOn ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            ></div>
          <div className={styles.slatWallContainer}>
            <Image
              src="/images/slatWall.png"
              fill={true}
              alt="slat wall background"
              priority
              sizes="50vw"
              style={{objectFit: 'cover'}}
              />
            </div>
            <div className={styles.body}>
              <div className={styles.content}>
                <div className={styles.contentText}>
                  <div className={styles.rightContent}>
                    {/* Image as background */}
                    
                    <div className={styles.imageWrapper}>
                      <Image
                        src="/images/blankCanvas3.png"
                        width={500}
                        height={300}
                        alt="background"
                        priority
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className={styles.backgroundImage}
                      />
                    </div>
                    {/* Text container that overlays the image */}
                    <div className={styles.textOverlay}>
                      {/* Title text */}
                      <div className={styles.titleText}>
                        {/* non animated text */}
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  className={styles.imageContainer} 
                  data-scroll 
                  data-scroll-speed={0.1}
                  ref={imageRef}
                >
                  {/* First motion div for the initial animation */}
                  <motion.div 
                    className={styles.painting}
                    variants={hangingAnimation}
                    initial="initial"
                    animate={isInView ? "open" : "closed"}
                  >
                    {/* Nested motion div for the swing animation */}
                    <motion.div
                      className={styles.paintingInner}
                      variants={finalPendulumSwing}
                      animate={swingTriggered ? "swing" : undefined}
                      style={{
                        transformOrigin: 'top right',
                        originX: 1,
                        originY: 0
                      }}
                    >
                      <Image
                        src="/images/squiggle2.png"
                        fill={true}
                        alt="background"
                        priority
                        sizes="100vw"
                        style={{
                          objectFit: 'contain',
                          objectPosition: 'right top'
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
        </div>
    )
}