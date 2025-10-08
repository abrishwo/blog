import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './ImageGallery.module.scss';
import ImageFallback from '@layouts/components/ImageFallback';
import { FaRandom, FaSyncAlt, FaSortAlphaDown } from 'react-icons/fa';

const GalleryView = ({ images: initialImages }) => {
  const [images, setImages] = useState([]);
  const [isBrowser, setIsBrowser] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    setIsBrowser(true);
    if (initialImages) {
      setImages(
        initialImages.map((img, index) => ({
          ...img,
          dndId: `image-${index}`,
          orientation: 'portrait', // Default orientation
        }))
      );
    }
  }, [initialImages]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImages(items);
  };

  const handleShuffle = () => {
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    setImages(shuffled);
  };

  const handleSort = () => {
    const sorted = [...images].sort((a, b) =>
      a.attributes.name.localeCompare(b.attributes.name)
    );
    setImages(sorted);
  };

  const handleOrientationToggle = (dndId) => {
    setImages(
      images.map((img) =>
        img.dndId === dndId
          ? { ...img, orientation: img.orientation === 'portrait' ? 'landscape' : 'portrait' }
          : img
      )
    );
  };

  if (!isBrowser) {
    return null;
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.controls}>
        <button onClick={handleShuffle} className={styles.controlButton}>
          <FaRandom /> Shuffle
        </button>
        <button onClick={handleSort} className={styles.controlButton}>
          <FaSortAlphaDown /> Sort A-Z
        </button>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <div
              className={styles.galleryGrid}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {images.map((image, index) => (
                <Draggable key={image.dndId} draggableId={image.dndId} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${styles.imageCard} ${styles[image.orientation]}`}
                    >
                      <div className={styles.imageWrapper}>
                        <ImageFallback
                          src={`${BASE_URL}${image.attributes.formats.small.url}`}
                          alt={image.attributes.alternativeText || 'Gallery image'}
                          width={150}
                          height={150}
                          className={styles.image}
                        />
                        <button
                          className={styles.orientationButton}
                          onClick={() => handleOrientationToggle(image.dndId)}
                        >
                          <FaSyncAlt />
                        </button>
                      </div>
                      {image.attributes.caption && (
                        <div className={styles.caption}>
                          {image.attributes.caption}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default GalleryView;
