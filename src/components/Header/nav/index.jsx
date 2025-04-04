'use client';
import { useState } from 'react';
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '../animation';
import Link from './Link';
import Curve from './Curve';
import Footer from './Footer';
import { useNavigation } from '../../../providers/NavigationProvider';

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Gallery",
    href: "/gallery",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
  {
    title: "Alters",
    href: "/gallery",
  }
];

export default function Nav() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const { navigateTo } = useNavigation();

  // Update Link component to use our custom navigation
  const handleNavigation = (path) => {
    navigateTo(path);
  };

  return (
    <motion.div 
      variants={menuSlide} 
      initial="initial" 
      animate="enter" 
      exit="exit" 
      className={styles.menu}
    >
      <div className={styles.body}>
        <div 
          onMouseLeave={() => {setSelectedIndicator(pathname)}} 
          className={styles.nav}
        >
          <div className={styles.header}>
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => {
            return (
              <Link 
                key={index}
                data={{...data, index}} 
                isActive={selectedIndicator === data.href} 
                setSelectedIndicator={setSelectedIndicator}
                onNavigate={handleNavigation}
              />
            );
          })}
        </div>
        <Footer />
      </div>
      <Curve />
    </motion.div>
  );
}