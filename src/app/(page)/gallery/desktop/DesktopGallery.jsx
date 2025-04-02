'use client';
import Image from "next/image";
import './DesktopGallery.scss';

const DesktopGallery = () => {

    return(
        
        <div className='gallery-page'>
           <div className='spotlight-1'></div>
           <div className='spotlight-2'></div> 
           <div className="newsImageWrapper">
            <Image
              src="/images/news.png"
              width={500}
              height={300}
              alt="background"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="news-painting"
            />
          </div>
          <div className="redlineImageWrapper">
            <Image
              src="/images/redline2.png"
              width={500}
              height={300}
              alt="background"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="redline-painting"
            />
          </div>
          <div className="squiggleImageWrapper">
            <Image
              src="/images/squiggle2.png"
              width={500}
              height={300}
              alt="background"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="squiggle-painting"
            />
          </div>
          <div className="boxImageWrapper">
            <Image
              src="/images/header.png"
              width={500}
              height={300}
              alt="background"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="box-painting"
            />
          </div>
          <div className="oceanImageWrapper">
            <Image
              src="/images/blue-ocean.png"
              width={500}
              height={300}
              alt="background"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="ocean-painting"
            />
          </div>
          <div className="weatherImageWrapper">
            <Image
              src="/images/weather.png"
              width={500}
              height={300}
              alt="background"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="weather-painting"
            />
          </div>
        </div>
    );
}

export default DesktopGallery;