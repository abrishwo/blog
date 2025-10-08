import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ImageFallback from '@layouts/components/ImageFallback';
import {
  FaChevronLeft,
  FaChevronRight,
  FaRandom,
  FaSyncAlt,
  FaSortAlphaDown,
  FaThLarge,
  FaImages,
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './ImageGallery.module.scss';

const GalleryView = ({
  images: initialImages = [],
  smallImagePosition = 'below-large-image',
}) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);
  const [layoutMode, setLayoutMode] = useState('carousel'); // ✅ carousel | grid
  const thumbnailRef = useRef(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  /** Initialize images */
  useEffect(() => {
    setIsBrowser(true);
    if (initialImages.length > 0) {
      const formatted = initialImages.map((img, index) => ({
        ...img,
        dndId: `image-${index}`,
        orientation: 'portrait',
        src: img.attributes?.formats?.small?.url
          ? `${BASE_URL}${img.attributes.formats.small.url}`
          : `${BASE_URL}${img}`,
      }));
      setImages(formatted);
      setSelectedImage(formatted[0]);
    }
  }, [initialImages, BASE_URL]);

  /** Scroll and Chevron logic */
  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const updateChevronVisibility = () => {
    if (thumbnailRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = thumbnailRef.current;
      setShowLeftChevron(scrollLeft > 0);
      setShowRightChevron(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    updateChevronVisibility();
    window.addEventListener('resize', updateChevronVisibility);
    return () => window.removeEventListener('resize', updateChevronVisibility);
  }, [images]);

  /** Drag-and-drop reorder */
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setImages(reordered);
  };

  /** Shuffle / Sort / Orientation */
  const handleShuffle = () => setImages([...images].sort(() => 0.5 - Math.random()));
  const handleSort = () =>
    setImages([...images].sort((a, b) => (a.attributes?.name || '').localeCompare(b.attributes?.name || '')));
  const handleOrientationToggle = (dndId) =>
    setImages(
      images.map((img) =>
        img.dndId === dndId
          ? {
              ...img,
              orientation: img.orientation === 'portrait' ? 'landscape' : 'portrait',
            }
          : img
      )
    );

  if (!isBrowser) return null;

  /** Large Image */
  const renderLargeImage = () =>
    selectedImage ? (
      <div className="slide-container relative w-full max-w-3xl h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <ImageFallback
          src={selectedImage.src}
          alt={selectedImage.attributes?.alternativeText || 'Selected image'}
          className="rounded-lg"
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            transition: 'transform 0.3s ease',
          }}
        />
        {selectedImage.attributes?.caption && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-md">
            {selectedImage.attributes.caption}
          </div>
        )}
      </div>
    ) : null;

  /** Thumbnail carousel (scrollable) */
  const renderCarousel = () => (
    <div className="relative w-full max-w-3xl mt-3">
      {showLeftChevron && (
        <button
          onClick={() => scrollThumbnails('left')}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 p-3 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 z-10"
        >
          <FaChevronLeft size={20} />
        </button>
      )}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <div
              className="thumbnail-slider flex overflow-x-auto space-x-2 scrollbar-custom"
              ref={(el) => {
                thumbnailRef.current = el;
                provided.innerRef(el);
              }}
              onScroll={updateChevronVisibility}
              {...provided.droppableProps}
            >
              <div className="grid grid-flow-col auto-cols-[minmax(100px,_1fr)] sm:auto-cols-[minmax(150px,_1fr)] gap-2">
                {images.map((image, index) => (
                  <Draggable key={image.dndId} draggableId={image.dndId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setSelectedImage(image)}
                        className={`relative flex items-center justify-center rounded-md cursor-pointer transition-all ${
                          selectedImage?.dndId === image.dndId
                            ? 'border-2 border-green-500'
                            : 'border border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <ImageFallback
                          src={image.src}
                          alt={image.attributes?.alternativeText || `Thumbnail ${index}`}
                          width={120}
                          height={100}
                          style={{
                            objectFit: 'contain',
                            objectPosition: 'center',
                          }}
                          className="rounded-md"
                        />
                        <button
                          className={`${styles.orientationButton} absolute top-1 right-1 bg-white p-1 rounded-full shadow-md`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrientationToggle(image.dndId);
                          }}
                        >
                          <FaSyncAlt size={12} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showRightChevron && (
        <button
          onClick={() => scrollThumbnails('right')}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 p-3 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 z-10"
        >
          <FaChevronRight size={20} />
        </button>
      )}
    </div>
  );

  /** Grid layout */
  const renderGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 w-full max-w-4xl">
      {images.map((image, index) => (
        <div
          key={index}
          onClick={() => setSelectedImage(image)}
          className={`relative rounded-md overflow-hidden cursor-pointer ${
            selectedImage?.dndId === image.dndId ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-green-300'
          }`}
        >
          <ImageFallback
            src={image.src}
            alt={image.attributes?.alternativeText || `Grid ${index}`}
            width={300}
            height={200}
            className="w-full h-auto object-contain rounded-md"
          />
          {image.attributes?.caption && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-2 rounded">
              {image.attributes.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  /** Layout switcher */
  const renderLayoutSwitch = () => (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => setLayoutMode('carousel')}
        className={`p-2 rounded-md flex items-center gap-1 ${
          layoutMode === 'carousel' ? 'bg-green-500 text-white' : 'bg-gray-100'
        }`}
      >
        <FaImages /> Carousel
      </button>
      <button
        onClick={() => setLayoutMode('grid')}
        className={`p-2 rounded-md flex items-center gap-1 ${
          layoutMode === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-100'
        }`}
      >
        <FaThLarge /> Grid
      </button>
    </div>
  );

  return (
    <div className={`${styles.galleryContainer} flex flex-col items-center`}>
      {/* Controls */}
      <div className={`${styles.controls} flex gap-3 mb-4`}>
        <button onClick={handleShuffle} className={styles.controlButton}>
          <FaRandom /> Shuffle
        </button>
        <button onClick={handleSort} className={styles.controlButton}>
          <FaSortAlphaDown /> Sort A–Z
        </button>
      </div>

      {/* Layout Switch */}
      {renderLayoutSwitch()}

      {/* Layout Logic with smallImagePosition */}
      {layoutMode === 'carousel' ? (
        <>
          {smallImagePosition === 'above-large-image' && (
            <>
              {renderCarousel()}
              <div className="mt-4">{renderLargeImage()}</div>
            </>
          )}
          {smallImagePosition === 'below-large-image' && (
            <>
              {renderLargeImage()}
              {renderCarousel()}
            </>
          )}
        </>
      ) : (
        renderGrid()
      )}
    </div>
  );
};

export default GalleryView;
