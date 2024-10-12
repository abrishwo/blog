import Social from "@components/Social";
import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";
import ImageFallback from "@layouts/components/ImageFallback";
import Logo from "@layouts/components/Logo";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";

const Footer = ({configData, socialMedia}) => {
  const { copyright, footer_content } = config.params;
    const { logo, logo_white, logo_width, logo_height, logo_text, title } = config.site;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <footer className="section relative mt-12 pt-[70px] pb-[50px]">
      <ImageFallback
        className="-z-[1] object-cover object-left  md:object-top"
        src="/images/footer-bg-shape.svg"
        alt="footer background"
        fill={true}
      />
      <div className="container text-center">
        <div className="mb-6 inline-flex">
          {/* <Logo  /> */}
              <ImageFallback
   
              src={ 
                (configData?.attributes?.Logo?.data?.attributes?.formats?.thumbnail?.url)?(`${BASE_URL}${configData?.attributes?.Logo?.data?.attributes?.formats?.thumbnail?.url}`):logo
              }
              alt={title}
              fill={true} // Ensures the image fills the container
              priority // Ensures the image loads quickly
              sizes="(max-width: 640px) 100vw, 
                    (max-width: 768px) 50vw, 
                    (max-width: 1024px) 33vw, 
                    25vw" // Responsive size adjustments
              className="mx-auto mb-12"
              style={{
                objectFit: "contain",
                objectPosition: "topCenter",
                maxHeight: "20%",
                maxWidth: "60%",
              }}
            />
        </div>
        {markdownify(configData?.Title, "h6", "max-w-[638px] mx-auto mt-4 ")}
        {markdownify(configData?.Tagline, "p", "max-w-[638px] mx-auto")}
        {/* footer menu */}
        <ul className="mb-12 mt-6 flex-wrap space-x-2 lg:space-x-4">
          {menu.footer.map((menu) => (
            <li className="inline-block" key={menu.name}>
              <Link
                href={menu.url}
                className="p-2 font-bold text-dark hover:text-primary dark:text-darkmode-light lg:p-4"
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* social icons */}
        <div className="inline-flex">
          <Social source={social} social={socialMedia} fromFooter={true} className="socials mb-12 justify-center" />
        </div>
        {/* copyright */}
        {markdownify('©'+configData?.copyright??copyright, "p")}
      </div>
    </footer>
  );
};

export default Footer;
