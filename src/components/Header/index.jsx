'use client';
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Nav from "./nav";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "../../common/RoundedButton";
import Magnetic from "../../common/Magnetic";
import { useNavigation } from "../../providers/NavigationProvider";

export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);
  const { navigateTo } = useNavigation();

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          });
        },
        onEnterBack: () => {
          gsap.to(
            button.current,
            { scale: 0, duration: 0.25, ease: "power1.out" },
            setIsActive(false)
          );
        },
      },
    });
  }, []);

  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (path !== pathname) {
      navigateTo(path);
    }
  };

  return (
    <>
      <div ref={header} className={styles.header}>
        <div className={styles.logo}>
          <p className={styles.copyright}>©</p>
          <a 
            href="/" 
            onClick={(e) => handleNavigation(e, "/")} 
            className={styles.name}
          >
            <p className={styles.codeBy}>SaintWorks</p>
            <p className={styles.joe}></p>
            <p className={styles.stromain}>Home</p>
          </a>
        </div>
        <div className={styles.nav}>
          <Magnetic>
            <div className={styles.el}>
              <a 
                href="/contact" 
                onClick={(e) => handleNavigation(e, "/contact")}
                className={styles.customLink}
              >
                Contact
              </a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a 
                href="/about" 
                onClick={(e) => handleNavigation(e, "/about")}
                className={styles.customLink}
              >
                About
              </a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a 
                href="/gallery" 
                onClick={(e) => handleNavigation(e, "/gallery")}
                className={styles.customLink}
              >
                Work
              </a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
        </div>
      </div>
      <div ref={button} className={styles.headerButtonContainer}>
        <Rounded
          onClick={() => {
            setIsActive(!isActive);
          }}
          className={`${styles.button}`}
        >
          <div
            className={`${styles.burger} ${
              isActive ? styles.burgerActive : ""
            }`}
          ></div>
        </Rounded>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </>
  );
}