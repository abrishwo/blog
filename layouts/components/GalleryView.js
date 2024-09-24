import React, { useState } from 'react';
import Image from 'next/image';

const GallerySlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="gallery-container flex justify-evenly">


        <Image 
            
               src={selectedImage}
                height="500"
                width="1000"
                alt="Selected"
                className="rounded-lg selected-image full-image-view"
            />
    
      {/* <div className="thumbnail-slider">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
        
            alt={`Thumbnail ${index}`}
            
            className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div> */}
      <div className="thumbnail-slider">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
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
