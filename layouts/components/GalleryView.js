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
        <div className="w-full max-w-3xl">
        {selectedImage?.attributes?.caption && (
            <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
              {selectedImage.attributes.caption}
            </p>
          )}
          <div className="slide-container relative h-[60vh] w-full md:h-[70vh] lg:h-[80vh]">
            {selectedImage && (
              <Image
                src={`${BASE_URL}${selectedImage.attributes.formats.large.url}`}
                alt={selectedImage.attributes.alternativeText || 'Selected'}
                className="slide-image rounded-lg"
                fill
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transition: 'transform 0.3s ease',
                }}
                priority
              />
            )}
          </div>
        
        </div>
      )}
      {/* blogger/frontend/layouts/components/GalleryView.js */}

      <div className="relative mt-3 w-full max-w-3xl">
        {showLeftChevron && (
          <button
            onClick={() => scrollThumbnails('left')}
            className="chevron left absolute top-1/2 left-0 z-10 -translate-y-1/2 transform rounded-full bg-white bg-opacity-75 p-4 shadow-md hover:bg-opacity-100"
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        {/* Thumbnail slider with custom scrollbar */}
        <div
          className="thumbnail-slider scrollbar-custom flex space-x-2 overflow-x-auto"
          ref={thumbnailRef}
          onScroll={updateChevronVisibility} // Update visibility on scroll
        >
          <div className="grid auto-cols-[minmax(100px,_1fr)] grid-flow-col gap-2 sm:auto-cols-[minmax(150px,_1fr)]">
            {images.map((image, index) => (
              <div
                key={image.dndId || index}
                className={`thumbnail-wrapper flex cursor-pointer items-center justify-center rounded-md ${
                  selectedImage?.dndId === image.dndId
                    ? 'border-2 border-green-500'
                    : ''
                }`}
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={`${BASE_URL}${image.attributes.formats.thumbnail.url}`}
                  width={120}
                  height={100}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                  alt={
                    image.attributes.alternativeText || `Thumbnail ${index}`
                  }
                  className="mx-auto my-auto rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Chevron */}
        {showRightChevron && (
          <button
            onClick={() => scrollThumbnails('right')}
            className="chevron right absolute top-1/2 right-0 z-10 -translate-y-1/2 transform rounded-full bg-white bg-opacity-75 p-4 shadow-md hover:bg-opacity-100"
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>

      {smallImagePosition === 'above-large-image' && (
        <div className="w-full max-w-3xl">
          <div className="slide-container relative h-[60vh] w-full md:h-[70vh] lg:h-[80vh]">
            {selectedImage && (
              <Image
                src={`${BASE_URL}${selectedImage.attributes.formats.large.url}`}
                alt={selectedImage.attributes.alternativeText || 'Selected'}
                className="slide-image rounded-lg"
                fill
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transition: 'transform 0.3s ease',
                }}
                priority
              />
            )}
          </div>
          {selectedImage?.attributes?.caption && (
            <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
              {selectedImage.attributes.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GallerySlider;
