import config from "@config/config.json";
import social from "@config/social.json";
import ImageFallback from "@layouts/components/ImageFallback";
import Logo from "@layouts/components/Logo";
import CustomForm from "@layouts/components/NewsLetterForm";
import Social from "@layouts/components/Social";
import dateFormat from "@lib/utils/dateFormat";
// import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";
import MailchimpSubscribe from "react-mailchimp-subscribe";

import AgendaWidget from "@layouts/components/AgendaWidget";
import axios from "axios";

const { blog_folder } = config.settings;
const { about, featured_posts, newsletter } = config.widgets;

import { useDispatch, useSelector } from "react-redux";
import { fetchSystemConfig, fetchSocialMedia } from "../../redux/slices/systemSlice";
const Sidebar = ({ posts, categories, className, tags }) => {


  const [showRecent, setShowRecent] = useState(true);
  const dispatch = useDispatch();
  const { items: systemConfig, social: socialMedia, status } = useSelector((state) => state.config);
  const { logo, logo_white, logo_width, logo_height, logo_text, title } = config.site;

  const [position, setPosition] = useState("Above News");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/agenda");
        setPosition(data.settings.position);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSystemConfig());
      dispatch(fetchSocialMedia());
    }
  }, [dispatch, status]);


  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


    return (
      <aside className={`${className} px-4 lg:px-6 lg:col-4`}>
        {about.enable && (
          <div className="relative rounded border border-border p-6 text-center dark:border-darkmode-border">
            <ImageFallback
              className="-z-[1]"
              src="/images/map.svg"
              fill={true}
              alt="bg-map"
            />
            <div className="container text-center">
              {/* Logo Section */}
              <Link
              href={'/'}
              className="mb-6 inline-flex items-center">
              {/* <div className="mb-6 inline-flex items-center"> */}
                <ImageFallback
                  src={
                    systemConfig?.attributes?.Logo?.data?.attributes?.formats?.thumbnail?.url
                      ? `${BASE_URL}${systemConfig.attributes.Logo.data.attributes.formats.thumbnail.url}`
                      : logo
                  }
                  alt={title}
                  fill={true}
                  priority
                  sizes="(max-width: 640px) 100vw, 
                         (max-width: 768px) 50vw, 
                         (max-width: 1024px) 33vw, 
                         25vw"
                          className="mx-auto mb-12"
                  // className="w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 lg:w-48 lg:h-24"
                  style={{
                    objectFit: "contain",
                    objectPosition: "topCenter",
                    maxHeight: "20%",
                    maxWidth: "40%",
                  }}
                />
              {/* </div> */}
              </Link>
              {/* Bio Section */}
              {/* AgendaPosition */}

              {systemConfig?.attributes?.ShowAgenda && systemConfig?.attributes?.AgendaPosition === "AboveNews" && 
              // <div className="mt-24 pt-12 w-full">
                 <AgendaWidget position="Above News" />
              // </div>
              }
              {/* <div className="mb-6"> */}
                {markdownify(systemConfig?.attributes?.bio, "p", " xl:text-center content-body-p pt-12 sm:pt-24")}
 {/* </div> */}
                {systemConfig?.attributes?.ShowAgenda && systemConfig?.attributes?.AgendaPosition === "BelowNews" && <AgendaWidget position="Below News" />}
              {/* </div> */}
              {/* Social Media Section */}
              <Social
                className="socials sidebar-socials mt-6 justify-center"
                source={social}
                social={socialMedia}
              />
            </div>
          </div>
        )}
  
        {/* Tags Section */}
        {tags && (
          <div className="mt-6 rounded border border-border p-6 text-center dark:border-darkmode-border">
            <div className="flex flex-wrap my-2">
              {markdownify('Filter By Tags', "h2", "title-h2")}
              <ul className="flex flex-wrap items-center justify-center">
                {tags?.data?.map((tag, index) => (
                  <li
                    className="mx-2 my-2 inline-flex h-7 rounded-[35px] bg-primary px-3 text-white"
                    key={"tag-" + index}
                  >
                    <Link
                      className="capitalize"
                      href={`/categories/${tag.attributes.Slug}`}
                    >
                      {tag.attributes.Name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
  
        {/* Newsletter Section */}
        {/* {newsletter.enable && (
         */}
         { 1<0 && (
          <div className="mt-6 rounded border border-border p-6 text-center dark:border-darkmode-border">
            <h4 className="section-title">{newsletter.title}</h4>
            <p className="mt-4 text-xs">{newsletter.content}</p>
            <MailchimpSubscribe
              url={newsletter.malichip_url}
              render={({ subscribe, status, message }) => (
                <CustomForm
                  onValidated={(formData) => subscribe(formData)}
                  status={status}
                  message={message}
                />
              )}
            />
            <p className="text-xs mt-4">
              By Signing Up, You Agree To
              <Link
                href="/privacy"
                className="ml-1 text-primary"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        )}
      </aside>
    );
  };
  
  export default Sidebar;
  