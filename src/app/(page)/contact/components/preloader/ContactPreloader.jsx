'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './ContactPreloader.module.scss';
import WipeTransition from '@/components/Transitions/WipeTransition/WipeTranstion';

export default function ContactPreloader() {
    const [showPreloader, setShowPreloader] = useState(true);
    
    useEffect(() => {
        // After a brief delay, start the exit animation
        const timer = setTimeout(() => {
            setShowPreloader(false);
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);
    
    // Handle wipe transition callbacks
    const handleWipeMidpoint = () => {
        // Can trigger any midpoint actions here
    };
    
    const handleWipeComplete = () => {
        // Can trigger any completion actions here
    };
    
    return (
        <div className={styles.ContactPreloaderContainer}>
            <AnimatePresence mode="wait">
                {showPreloader && (
                    <WipeTransition 
                        key="wipe-transition"
                        onMidpoint={handleWipeMidpoint}
                        onComplete={handleWipeComplete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}