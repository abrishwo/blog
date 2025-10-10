import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./ImageGallery.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaSyncAlt } from "react-icons/fa";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{ ...style, display: "block", background: "#1e293b" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{ ...style, display: "block", background: "#1e293b" }}
      onClick={onClick}
    />
  );
}

const ImageGallery = ({ images, setImages, layout }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    setIsBrowser(true);
    if (images && !images.every((img) => "orientation" in img)) {
      setImages(images.map((img) => ({ ...img, orientation: "portrait" })));
    }
  }, [images, setImages]);

  if (!images || images.length === 0 || !isBrowser) return null;
// stylescarouselContainer
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const handleImageClick = (url) => setSelectedImage(url);
  const handleZoomClose = () => setSelectedImage(null);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImages(items);
  };

  const handleOrientationToggle = (dndId) => {
    setImages(
      images.map((img) =>
        img.dndId === dndId
          ? {
              ...img,
              orientation:
                img.orientation === "portrait" ? "landscape" : "portrait",
            }
          : img
      )
    );
  };

  return (
    <div className={styles.gallery}>
      {layout === "grid" ? (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="galleryGrid" direction="vertical">
            {(provided) => (
              <div
                className={styles.galleryGrid}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.dndId}
                    draggableId={image.dndId}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${styles.imageCard} ${styles[image.orientation]}`}
                      >
                        <div className={styles.imageWrapper}>
                          <img src={`${BASE_URL}${image.attributes.formats.small.url}`} alt={image.attributes.alternativeText || `Image ${index + 1}`} />
                        </div>
                        <div className={styles.caption}>
                          {image.attributes.caption ? image.attributes.caption : "By Stars and Toques"}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>





            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="slider-container">
          <Slider {...carouselSettings}>
            {images.map((image, index) => (

<div className={styles.carouselItem}>
            
  <img src={`${BASE_URL}${image.attributes.formats.small.url}`} />

  <div className={styles.caption}>
    {image.attributes.caption ? image.attributes.caption : "By Stars and Toques"}
  </div>
   
</div>
            ))}
          </Slider>
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
