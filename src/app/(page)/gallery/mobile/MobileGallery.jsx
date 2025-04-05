'use client';
import Image from "next/image";
import './MobileGallery.scss';

const MobileGallery = () => {

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
    </div>
  );
}

export default MobileGallery;