import ImageFallback from "@components/ImageFallback";
import config from "@config/config.json";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Logo = ({ src , logoImg}) => {
  // Destructuring items from the config object
  const { logo, logo_white, logo_width, logo_height, logo_text, title } = config.site;
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  // Logo dimensions for responsiveness (smaller for mobile, larger for desktop)
  const smallWidth = logo_width.replace("px", "") * 1.5;  // Adjust as needed
  const smallHeight = logo_height.replace("px", "") * 1.5;
  const mediumWidth = logo_width.replace("px", "") * 2;
  const mediumHeight = logo_height.replace("px", "") * 2;

  return (
    <Link href="/" className="navbar-brand">
      {src || logo ? (
        <ImageFallback
          fallback="/images/logo.png"
          src={ 
            logoImg? `${BASE_URL}${logoImg}`:(mounted && (theme === "dark" || resolvedTheme === "dark"))
              ? logo_white
              : logo
          }
          alt={title}
          fill={true} // Ensures the image fills the container
          priority // Ensures the image loads quickly
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 768px) 50vw, 
                 (max-width: 1024px) 33vw, 
                 25vw" 
                 // Responsive size adjustments
          className="mx-auto"
          style={{
            objectFit: "contain",
            objectPosition: "left",
            maxHeight: "100%",
            maxWidth: "100%",
            // aspectRatio: "1/1",
          }}
        />
      ) : logo_text ? (
        <span className="text-lg font-bold">{logo_text}</span>
      ) : (
        <span className="text-lg font-bold">{title}</span>
      )}
    </Link>
  );
};

export default Logo;
