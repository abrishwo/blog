import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const GallerySlider = ({ images, smallImagePosition }) => {
  const [selectedImage, setSelectedImage] = useState();
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const thumbnailRef = useRef(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      thumbnailRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Update chevron visibility based on scroll position
  const updateChevronVisibility = () => {
    if (thumbnailRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = thumbnailRef.current;
      setShowLeftChevron(scrollLeft > 0);
      setShowRightChevron(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);
  useEffect(() => {
    
    updateChevronVisibility(); // Initial visibility check
    window.addEventListener('resize', updateChevronVisibility); // Check on resize
    return () => {
      window.removeEventListener('resize', updateChevronVisibility); // Cleanup
    };
  }, [images]); // Re-check visibility whenever images change

  return (
    <div className="gallery-container flex flex-col items-center">
     {smallImagePosition === 'below-large-image' && (
      <div className="slide-container relative w-full max-w-3xl h-[60vh] md:h-[70vh] lg:h-[80vh]">
        { selectedImage && (<Image
          src={`${BASE_URL}${selectedImage}`}
          alt="Selected"
          className="rounded-lg slide-image"
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
            transition: 'transform 0.3s ease',
          }}
          priority
        />)}
      </div>
     )}
      {/* blogger/frontend/layouts/components/GalleryView.js */}
      
      <div className="relative w-full max-w-3xl mt-3">
      {showLeftChevron && (
          <button
            onClick={() => scrollThumbnails('left')}
            className="chevron left absolute top-1/2 left-0 transform -translate-y-1/2 p-4 bg-white bg-opacity-75 rounded-full shadow-md hover:bg-opacity-100 z-10"
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        {/* Thumbnail slider with custom scrollbar */}
        <div
          className="thumbnail-slider flex overflow-x-auto space-x-2 scrollbar-custom"
          ref={thumbnailRef}
          onScroll={updateChevronVisibility} // Update visibility on scroll
        >
          <div className="grid grid-flow-col auto-cols-[minmax(100px,_1fr)] sm:auto-cols-[minmax(150px,_1fr)] gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail-wrapper flex items-center justify-center ${
                  selectedImage === image ? 'border-2 border-green-500' : ''
                } rounded-md cursor-pointer`}
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={`${BASE_URL}${image}`}
                  width={120}
                  height={100}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                  alt={`Thumbnail ${index}`}
                  className="rounded-md mx-auto my-auto"
                />
              </div>
            ))}
          </div>
        </div>

       {/* Right Chevron */}
          {showRightChevron && (
            <button
              onClick={() => scrollThumbnails('right')}
              className="chevron right absolute top-1/2 right-0 transform -translate-y-1/2 p-4 bg-white bg-opacity-75 rounded-full shadow-md hover:bg-opacity-100 z-10"
            >
              <FaChevronRight size={20} />
            </button>
          )}
      </div>

      {smallImagePosition === 'above-large-image' && (
      <div className="slide-container relative w-full max-w-3xl h-[60vh] md:h-[70vh] lg:h-[80vh]">
        { selectedImage && (<Image
          src={`${BASE_URL}${selectedImage}`}
          alt="Selected"
          className="rounded-lg slide-image"
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
            transition: 'transform 0.3s ease',
          }}
          priority
        />)}
      </div>
     )}

    </div>
  );
};

export default GallerySlider;
