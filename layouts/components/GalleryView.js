import React, { useState } from 'react';
import Image from 'next/image';

const GallerySlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <div className="gallery-container flex flex-col items-center">
      {/* <div className="selected-image-container w-full max-w-3xl h-[60vh] md:h-[70vh] lg:h-[80vh] relative"> */}
      {/* import Image from 'next/image'; */}

{/* const YourComponent = ({ selectedImage }) => ( */}
  <div className="slide-container position-center">
    <Image
      src={`${BASE_URL}${selectedImage}`}
      alt="Selected"
      className="rounded-lg slide-image"
      fill={true}
     
      style={{
        objectFit: 'fill',      // Ensures the image fits within the div boundaries
        objectPosition: 'center',  // Centers the image if aspect ratios differ
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: 'auto scale !important',
        transition: 'transform 0.3s ease',
      }}
      priority
    />
  </div>

      <div className="thumbnail-slider mt-4 flex overflow-x-auto space-x-2 w-full max-w-3xl">
        <div className="grid grid-flow-col auto-cols-[minmax(100px,_1fr)] sm:auto-cols-[minmax(150px,_1fr)] gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail-wrapper ${
                selectedImage === image ? 'border-2 border-green-500' : ''
              } rounded-md cursor-pointer`}
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={`${BASE_URL}${image}`}
                width={100}
                height={100}
                objectFit="cover"
                style={{
                  minHeight: "100%",
                  minWidth: "100%",
                  aspectRatio: "scale auto",
                }}
                alt={`Thumbnail ${index}`}
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySlider;
