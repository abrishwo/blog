/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import { useEffect, useState } from "react";

// Helper function to check if the image format is supported
const isSupportedFormat = (src) => {
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.svg', '.webp']; // Add more formats if necessary
  return supportedFormats.some(format => src.endsWith(format));
};

const ImageFallback = (props) => {
  const { src, fallback, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    // Handle conversion for .ai files or unsupported formats
    if (!isSupportedFormat(src)) {
      // Try to load a fallback if the source is not in a supported format
      setImgSrc(fallback);
    } else {
      setImgSrc(src);
    }
  }, [src, fallback]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      // fill={fill}
      onError={() => {
        setImgSrc(fallback); // Use fallback if the image fails to load
      }}
    />
  );
};

export default ImageFallback;
