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
          width={mediumWidth}
          height={mediumHeight}
          src={ 
            logoImg?`${BASE_URL}${logoImg}`
            :(mounted && (theme === "dark" || resolvedTheme === "dark"))
              ? logo_white
              : logo
          }
          // src={`${BASE_URL}${logoImg}`}
          fallback="/images/logo.png" // Fallback image (must be a supported format)

          // width={300}
          // height={300}

          alt={title}
          priority
          // Tailwind CSS for responsive width/height
          className="m-auto w-24 h-12 sm:w-32 sm:h-16 md:w-48 md:h-24 lg:w-56 lg:h-28 xl:w-64 xl:h-32"
          style={{
            maxHeight: "100%", // Ensure the logo fits within its container
            maxWidth: "100%",
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
