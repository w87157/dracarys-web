import React from 'react';
import Slider from 'react-slick';
import styles from './Carousel.module.css';

interface Slide {
  image: string;
  text: string;
}

interface VerticalCarouselProps {
  slides: Slide[];
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ slides }) => {
  const settings = {
    vertical: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dots: false,
    autoplay: true,
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className={styles.slide}>
            <img src={slide.image} className={styles.image} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.prevArrow}`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      {/* <img src="./up.svg" alt="" /> */}
    </div>
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.nextArrow}`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
};

export default VerticalCarousel;