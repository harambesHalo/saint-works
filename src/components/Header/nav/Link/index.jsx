'use client';
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { slide, scale } from '../../animation';

export default function LinkComponent({data, isActive, setSelectedIndicator, onNavigate}) {
  const { title, href, index } = data;
  
  const handleClick = (e) => {
    e.preventDefault();
    setSelectedIndicator(href);
    onNavigate(href);
  };
  
  return (
    <motion.div 
      className={styles.link} 
      onMouseEnter={() => {setSelectedIndicator(href)}} 
      custom={index} 
      variants={slide} 
      initial="initial" 
      animate="enter" 
      exit="exit"
    >
      <motion.div 
        variants={scale} 
        animate={isActive ? "open" : "closed"} 
        className={styles.indicator}
      />
      <a href={href} onClick={handleClick}>{title}</a>
    </motion.div>
  );
}