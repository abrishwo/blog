import React, { useState } from "react";
import Slider from "react-slick";
import styles from "./ImageGallery.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-white rounded-full p-5`}
        style={{ ...style, display: "block", background: "#1e293b", color: "#fff !important" }}
        onClick={onClick}
      />
    );
  }
  
  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
      className={`${className} text-white rounded-full p-5`}
        style={{ ...style, display: "block", background: "#1e293b", color: "#fff !important" }}
        onClick={onClick}
      />
    );
  }
const ImageGallery = ({ images, layout, position, smallImagePosition }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  // Carousel settings
  const carouselSettings = {

    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
   
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleZoomClose = () => {
    setSelectedImage(null);
  };

  return (
    <div
      className={`${styles.gallery} ${
        position === "below-title" ? styles.belowTitle : styles.endOfArticle
      }`}
    >
      {layout === "grid" && (
        <div className={styles.grid}>
          {images.map((image, index) => (
            <div
              key={index}
              className={styles.gridItem}
              onClick={() => handleImageClick(image.url)}
            >
              <img src={image.url} alt={image.alt} loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {layout === "carousel" && (
       
        <div className={`slider-container ${styles.carouselContainer}`}> 
          {/* {smallImagePosition === "above-large-image" && ( */}
            {/* <div className={styles.smallImages}> */}
            {/* // <div className="slider-container"> */}
            <Slider {...carouselSettings}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className={`${styles.smallImage}`}
                  onClick={() => handleImageClick(image.url)}
                />
              ))}
              </Slider>
            {/* </div> */}
        {/* //   )} */}
          {/* <Slider {...carouselSettings}>
            {images.map((image, index) => (
              <div key={index} className={styles.carouselItem}>
                <img src={image.url} alt={image.alt} loading="lazy" />
              </div>
            ))}
          </Slider> */}
          {/* {smallImagePosition === "below-large-image" && (
            <div className={styles.smallImages}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className={styles.smallImage}
                  onClick={() => handleImageClick(image.url)}
                />
              ))}
            </div>
          )} */}
        </div>
      )}

      {selectedImage && (
        <div className={styles.zoomOverlay} onClick={handleZoomClose}>
          <img src={selectedImage} alt="Zoomed" className={styles.zoomImage} />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
