'use client';
import { useState, useEffect } from 'react';
import AboutPreloader from './components/preloader/AboutPreloader';
import './about.scss';

const About = () => {
    const [loading, setLoading] = useState(true);
    
    // Simulate content loading
    // In a real scenario, you'd check if all components/images are loaded
    useEffect(() => {
        // Simulate loading time - replace with actual content loading checks
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);
        
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <>
            {loading && <AboutPreloader />}
            <div className='about-page'>
                <h1>About Page</h1>
                <p>Some Shit</p>
            </div>
        </>
    );
}

export default About;