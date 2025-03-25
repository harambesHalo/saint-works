'use client';
import React from 'react'
import styles from './style.module.scss';

export default function index({index, title, manageModal, isMobile}) {
    const handleInteraction = (isEntering, e) => {
        // On mobile use tap/click instead of hover
        if (isMobile) {
            if (isEntering) {
                manageModal(true, index, window.innerWidth/2, window.innerHeight/2);
            }
        } else {
            manageModal(isEntering, index, e.clientX, e.clientY);
        }
    };

    return (
        <div 
            onMouseEnter={(e) => handleInteraction(true, e)} 
            onMouseLeave={(e) => handleInteraction(false, e)}
            onClick={(e) => isMobile && handleInteraction(true, e)}
            className={styles.project}
        >
            <h2>{title}</h2>
            <p>Design & Development</p>
        </div>
    )
}