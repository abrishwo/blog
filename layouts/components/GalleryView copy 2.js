import Image from 'next/image';
import React, { useState } from 'react';
// import styles from './DynamicImage.module.css';
const GallerySlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[4]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <div className="slide-container position-center">
      <Image
        src={`${BASE_URL}${selectedImage}`}
        alt={"alt"}
        fill={true}
        objectFit="cover" // Maintains image quality and covers the container
        className="slide-image"
        quality={100} // Set to max for professional quality
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust for different viewports
      />
    </div>
  );
};

export default GallerySlider;
