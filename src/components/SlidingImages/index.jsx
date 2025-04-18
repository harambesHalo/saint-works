import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import styles from "./style.module.scss";
import Image from "next/image";

const slider1 = [
  {
    color: "#e3e5e7",
    src: "piece-1.jpg",
  },
  {
    color: "#d6d7dc",
    src: "piece-2.jpg",
  },
  {
    color: "#e3e3e3",
    src: "piece-3.jpg",
  },
  {
    color: "#21242b",
    src: "piece-4.jpg",
  },
];

const slider2 = [
  {
    color: "#d4e3ec",
    src: "news.png",
  },
  {
    color: "#e5e0e1",
    src: "piece-6.jpg",
  },
  {
    color: "#d7d4cf",
    src: "piece-7.jpg",
  },
  {
    color: "#e1dad6",
    src: "piece-8.jpg",
  },
];

export default function SlidingImages() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    // Update ScrollTrigger when Lenis updates
    if (container.current && typeof window !== "undefined" && window.lenis) {
      window.lenis.on("scroll", () => {
        // This would be used to manually update scroll animations if needed
      });

      return () => {
        if (window.lenis) {
          window.lenis.off("scroll");
        }
      };
    }
  }, []);

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <div ref={container} className={styles.slidingImages}>
      <motion.div style={{ x: x1 }} className={styles.slider}>
        {slider1.map((project, index) => {
          return (
            <div
              key={index}
              className={styles.project}
              style={{ backgroundColor: project.color }}
            >
              <div className={styles.imageContainer}>
                <Image
                  fill={true}
                  alt={"image"}
                  src={`/images/${project.src}`}
                />
              </div>
            </div>
          );
        })}
      </motion.div>
      <motion.div style={{ x: x2 }} className={styles.slider}>
        {slider2.map((project, index) => {
          return (
            <div
              key={index}
              className={styles.project}
              style={{ backgroundColor: project.color }}
            >
              <div key={index} className={styles.imageContainer}>
                <Image
                  fill={true}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt={"image"}
                  src={`/images/${project.src}`}
                />
              </div>
            </div>
          );
        })}
      </motion.div>
      <motion.div style={{ height }} className={styles.circleContainer}>
        <div className={styles.circle}></div>
      </motion.div>
    </div>
  );
}
