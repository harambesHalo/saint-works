'use client';
import { useState, useEffect } from 'react';
import ContactPreloader from './components/preloader/ContactPreloader';
import './contact.scss';

const Contact = () => {
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
            {loading && <ContactPreloader />}
            <div className='contact-page'>
                <h1>Contact Page</h1>
                <p>Your contact content here</p>
            </div>
        </>
    );
}

export default Contact;