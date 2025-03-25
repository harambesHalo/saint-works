import styles from './style.module.scss';
import { useInView, motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { slideUp, opacity } from './animation';
import Rounded from '../../common/RoundedButton';

export default function index() {
    const phrase = "Art and oddities out of Boise.Idaho";
    const description = useRef(null);
    const isInView = useInView(description);
    
    useEffect(() => {
      // Update ScrollTrigger when Lenis updates
      if (description.current && typeof window !== 'undefined' && window.lenis) {
        const scrollElements = description.current.querySelectorAll('[data-scroll]');
        
        if (scrollElements.length) {
          // Listen for scroll events if you have elements with data-scroll attribute
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
            <div className={styles.body}>
                <p>
                {
                    phrase.split(" ").map((word, index) => {
                        return <span key={index} className={styles.mask}><motion.span variants={slideUp} custom={index} animate={isInView ? "open" : "closed"} key={index}>{word}</motion.span></span>
                    })
                }
                </p>
                <motion.p variants={opacity} animate={isInView ? "open" : "closed"}>The combination of my passion for design, code & interaction positions me in a unique place in the web design world.</motion.p>
                <div data-scroll data-scroll-speed={0.1}>
                    <Rounded className={styles.button}>
                        <p>About me</p>
                    </Rounded>
                </div>
            </div>
        </div>
    )
}