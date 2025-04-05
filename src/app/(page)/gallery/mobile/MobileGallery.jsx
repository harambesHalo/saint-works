'use client';
import Image from "next/image";
import './MobileGallery.scss';
import { useEffect } from 'react';

const MobileGallery = () => {
  // This effect ensures the gallery works with Lenis
  useEffect(() => {
    // Update Lenis to handle our gallery content if it exists
    if (typeof window !== 'undefined' && window.lenis) {
      // Reset any scroll position
      window.scrollTo(0, 0);
      // Update Lenis to recognize new content
      window.lenis.resize();
    }
    
    // Make sure body scrolling is enabled
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Add touch scroll indicator if needed
    const addScrollHint = () => {
      const gallery = document.querySelector('.gallery-page-mobile');
      if (gallery && !document.querySelector('.scroll-hint')) {
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.innerHTML = '↓ Scroll to see more ↓';
        hint.style.textAlign = 'center';
        hint.style.padding = '10px';
        hint.style.marginTop = '10px';
        hint.style.opacity = '0.7';
        gallery.appendChild(hint);
        
        // Fade out hint after user scrolls
        const removeHint = () => {
          if (window.scrollY > 50) {
            hint.style.opacity = '0';
            hint.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
              hint.remove();
            }, 500);
            window.removeEventListener('scroll', removeHint);
          }
        };
        
        window.addEventListener('scroll', removeHint);
      }
    };
    
    // Add scroll hint with a small delay
    setTimeout(addScrollHint, 1000);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className='gallery-page-mobile'>
      <div className="newsWrapperMobile">
        <Image
          src="/images/news.png"
          width={500}
          height={300}
          alt="background"
          priority
          className="news-painting-mobile"
        />
      </div>
      <div className="redlineWrapperMobile">
        <Image
          src="/images/redline2.png"
          width={500}
          height={300}
          alt="background"
          priority
          className="red-painting-mobile"
        />
      </div>
      <div className="boxImageWrapperMobile">
        <Image
          src="/images/header.png"
          width={500}
          height={300}
          alt="background"
          priority
          className="box-painting-mobile"
        />
      </div>
      <div className="squiggleWrapperMobile">
        <Image
          src="/images/squiggle2.png"
          width={500}
          height={300}
          alt="background"
          priority
          className="squiggle-painting-mobile"
        />
      </div>
      <div className="oceanImageWrapperMobile">
        <Image
          src="/images/blue-ocean.png"
          width={500}
          height={300}
          alt="background"
          priority
          className="ocean-painting-mobile"
        />
      </div>
      <div className="weatherImageWrapperMobile">
        <Image
          src="/images/weather.png"
          width={500}
          height={300}
          alt="background-mobile"
          priority
          className="weather-painting-mobile"
        />
      </div>
      {/* Add padding at the bottom to ensure last image has space below */}
      <div className="gallery-bottom-spacer" style={{ height: '50px', width: '100%' }}></div>
    </div>
  );
}

export default MobileGallery;