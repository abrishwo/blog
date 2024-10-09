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
const { blog_folder } = config.settings;
const { about, featured_posts, newsletter } = config.widgets;

import { useDispatch, useSelector } from "react-redux";
import { fetchSystemConfig, fetchSocialMedia } from "../../redux/slices/systemSlice";
const Sidebar = ({ posts, categories, className, tags }) => {


  const [showRecent, setShowRecent] = useState(true);
  const dispatch = useDispatch();
  const { items: systemConfig, social: socialMedia, status } = useSelector((state) => state.config);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSystemConfig());
      dispatch(fetchSocialMedia());
    }
  }, [dispatch, status]);




  return (
    <aside className={`${className} px-0 lg:px-6 lg:col-4`}>
      {about.enable && (
        <div className="relative rounded border border-border p-6 text-center dark:border-darkmode-border">
          <ImageFallback
            className="-z-[1]"
            src="/images/map.svg"
            fill={true}
            alt="bg-map"
          />
          {/* <Logo logoImg={systemConfig?.attributes?.Logo?.data?.attributes?.formats?.thumbnail?.url} /> */}
          <Logo />
          {markdownify(systemConfig?.attributes?.bio, "p", "mt-8")}


          <Social
            className="socials sidebar-socials mt-6 justify-center"
            source={social}
            social={socialMedia}
          />


        </div>
      )}

      {tags && (<div className="mt-6 relative rounded border border-border p-6 text-center dark:border-darkmode-border">
        <div className="flex flex-wrap my-2">

          {markdownify('Filter By Tags', "h2", "title-h2")}
          <ul className="flex flex-wrap items-center">
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

      </div>)}



      {/* newsletter */}
      {(newsletter.enable && 1<0) && (
        <div className="mt-6  rounded border border-border p-6 text-center dark:border-darkmode-border">
          <h4 className="section-title">{newsletter.title}</h4>
          <p className="mt-10 text-xs">{newsletter.content}</p>
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
          <p className="text-xs">
            By Singing Up, You Agree To
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
