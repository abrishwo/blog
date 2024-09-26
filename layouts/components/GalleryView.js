import React, { useState } from 'react';
import Image from 'next/image';

const GallerySlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[2]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <div className="gallery-container flex justify-evenly flex-col">


        <Image 
            
               src={`${BASE_URL}${selectedImage}`}
                height="500"
                width="1000"
                alt="Selected"
                className="rounded-lg selected-image full-image-view"
            />
    
      
      <div className="thumbnail-slider sm:flex sm:flex-row sm:items-center">
        {images.map((image, index) => (
          <img
            key={index}
            src={`${BASE_URL}${image}`}
            alt={`Thumbnail ${index}`}
            className={`thumbnail ${
              selectedImage === image ? 'active' : ''
            }`}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>


    </div>
  );
};

export default GallerySlider;
