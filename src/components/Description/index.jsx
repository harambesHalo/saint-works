import styles from "./style.module.scss";
import { useInView, motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { slideUp, hangingAnimation, finalPendulumSwing } from "./animation";
import { useDeviceContext } from '../../lib/hooks/useDeviceContext';
import Image from "next/image";

export default function index() {
  const { isMobile, isClient } = useDeviceContext();
  const description = useRef(null);
  const imageRef = useRef(null);
  const paintingRef = useRef(null);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);
  const [swingTriggered, setSwingTriggered] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  // InView for initial animations
  const isInView = useInView(description, { once: true, amount: 0.02 });

  // Handle the initial animation completion
  useEffect(() => {
    if (!isClient) return;
    if (isInView) {
      // Set a timer to mark when the initial hanging animation is complete
      const timer = setTimeout(() => {
        setInitialAnimationComplete(true);
      }, 1000);

      const lightTimer = setTimeout(() => {
        setLightOn(true); // Turn on the light after 2 seconds
      }, 2000); // Turn on the light when the animation is complete

      return () => {
        clearTimeout(timer);
        clearTimeout(lightTimer);
      };
    } else {
      setInitialAnimationComplete(false);
      setSwingTriggered(false);
      setLightOn(false);
    }
  }, [isInView, setLightOn, isClient]);

  // Add precise scroll position tracking to trigger only when the element is almost off the screen
  useEffect(() => {
    if (!isClient) return;
    const handleScroll = () => {
      if (!swingTriggered && initialAnimationComplete && paintingRef.current) {
        const rect = paintingRef.current.getBoundingClientRect();

        // This is the key change: trigger when the top of the image is NEGATIVE (scrolled past top)
        // -100 means it's 100px past the top of the screen (adjust as needed)
        if (rect.top <= -1000) {
          setSwingTriggered(true);
          console.log("Swing triggered at position:", rect.top);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [swingTriggered, initialAnimationComplete, isClient]);

  // Lenis scroll integration
  useEffect(() => {
    if (!isClient) return;
    if (description.current && typeof window !== "undefined" && window.lenis) {
      const scrollElements =
        description.current.querySelectorAll("[data-scroll]");

      if (scrollElements.length) {
        window.lenis.on("scroll", () => {
          // We can also add a late trigger here if needed
          if (
            !swingTriggered &&
            initialAnimationComplete &&
            paintingRef.current
          ) {
            const rect = paintingRef.current.getBoundingClientRect();
            if (rect.top <= -100) {
              setSwingTriggered(true);
            }
          }
        });
      }

      return () => {
        if (window.lenis) {
          window.lenis.off("scroll");
        }
      };
    }
  }, [swingTriggered, initialAnimationComplete, isClient]);

  return (
    <div className={styles.sectionContainer}>
      <div ref={description} className={styles.description}>
        <div
          className={styles.spotlight}
          style={{
            opacity: lightOn ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        ></div>
        <div className={styles.galleryBody}>

          <div className={styles.contextImageWrapper}>
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

          <div className={styles.slatWallSegment}>
            <div className={styles.slatWallContainer}>
              <Image
                src="/images/lgSlatWall.png"
                fill={true}
                alt="slat wall background"
                priority
                sizes="50vw"
                style={styles.slatWall}
              />
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
                  ref={paintingRef}
                >
                  {/* Nested motion div for the swing animation */}
                  <motion.div
                    className={styles.paintingInner}
                    variants={finalPendulumSwing}
                    animate={swingTriggered ? "swing" : undefined}
                    style={{
                      transformOrigin: "top right",
                      originX: 1,
                      originY: 0,
                    }}
                  >
                    <Image
                      src="/images/squiggle2.png"
                      fill={true}
                      alt="background"
                      priority
                      sizes="100vw"
                      style={{
                        objectFit: "contain",
                        objectPosition: "right top",
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
