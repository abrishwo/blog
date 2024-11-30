import React from "react";
import styles from "./ImageGallery.module.scss"; // SCSS module for styling
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ImageGallery = ({ images, layout }) => {
  if (!images || images.length === 0) return null;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    adaptiveHeight: true,
  };

  return (
    <div className={styles.gallery}>
      {layout === "grid" && (
        <div className={styles.grid}>
          {images.map((image, index) => (
            <div key={index} className={styles.gridItem}>
              <img src={image.url} alt={image.alt} loading="lazy" />
            </div>
          ))}
        </div>
      )}
      {layout === "carousel" && (
        <Slider {...carouselSettings}>
          {images.map((image, index) => (
            <div key={index} className={styles.carouselItem}>
              <img src={image.url} alt={image.alt} loading="lazy" />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ImageGallery;



import React, { useState } from "react";
import Slider from "react-slick";
import styles from "./ImageGallery.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageGallery = ({ images, layout, position, smallImagePosition }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    customPaging: (i) => (
      <img
        src={images[i].url}
        alt={images[i].alt}
        className={styles.carouselThumbnail}
      />
    ),
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
        <div className={styles.carouselContainer}>
          {smallImagePosition === "above-large-image" && (
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
          )}
          <Slider {...carouselSettings}>
            {images.map((image, index) => (
              <div key={index} className={styles.carouselItem}>
                <img src={image.url} alt={image.alt} loading="lazy" />
              </div>
            ))}
          </Slider>
          {smallImagePosition === "below-large-image" && (
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
          )}
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

