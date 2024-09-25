import config from "@config/config.json";
import Base from "@layouts/Baseof";
import InnerPagination from "@layouts/components/InnerPagination";
import dateFormat from "@lib/utils/dateFormat";
import { markdownify } from "@lib/utils/textConverter";
import { DiscussionEmbed } from "disqus-react";
import { MDXRemote } from "next-mdx-remote";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { FaRegCalendar, FaUserAlt } from "react-icons/fa";
import Post from "./partials/Post";
import Sidebar from "./partials/Sidebar";
import shortcodes from "./shortcodes/all";
const { disqus } = config;
const { meta_author } = config.metadata;
import GallerySlider from "./components/GalleryView";

const PostSingle = ({
  content,
  relatedPost,
}) => {

  const { theme } = useTheme();
  const author = "Admin";
 
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    

    const thumb = [
      content.attributes.Thumbnail.data.attributes.formats.thumbnail.url,
    ];
    
    // Check if there are gallery images, and map them to an array of URLs
    const gall = content.attributes?.Images?.data.map(
      (image) => image.attributes.formats.thumbnail.url
    );
    
    // Combine thumbnail and gallery images into a single array (no need to join with commas)
    const imageList = [...thumb, ...(gall || [])]; // Use spread operator to combine arrays
    
    console.log(imageList); // You can access images by index now
    
    // }else{
    //   imageList = [...thumb,];
    // }
    // for(var i in gall) {
    //   imageList.push(i);
    // }

  return (
   <>

   
   {content.attributes && ( <Base title={content.attributes.Title} description={content.attributes.Content}>
      <section className="section single-blog mt-6">
        <div className="container">
          <div className="row">
            <div className="lg:col-8">
              <article>
                <div className="relative">
                  {/* {content.attributes.Thumbnail.data && ( */}
                    {/* <Image
                      src={`${BASE_URL}${content.attributes.Thumbnail.data.attributes.formats.thumbnail.url}`}
                      height="500"
                      width="1000"
                      alt={content.attributes.Title}
                      className="rounded-lg"
                    /> */}
                  {/* )} */}

                    {/* <h1>Gallery Slider</h1> */}
                    <GallerySlider images={imageList} />

                  {/* <ul className="absolute top-3 left-2 flex flex-wrap items-center">
                    {content.attributes.tags.data.map((tag, index) => (
                      <li
                        className="mx-2 inline-flex h-7 rounded-[35px] bg-primary px-3 text-white"
                        key={"tag-" + index}
                      >
                        <Link
                          className="capitalize"
                          href={`/categories/${tag.attributes.Slug.replace(" ", "-")}`}
                        >
                          {tag.attributes.Name}
                        </Link>
                      </li>
                    ))}
                  </ul> */}
                </div>
                {/* {config.settings.InnerPaginationOptions.enableTop && (
                  <div className="mt-4">
                    <InnerPagination posts={posts} date={date} />
                  </div>
                )} */}
                {markdownify(content.attributes.Title, "h1", "lg:text-[42px] mt-4")}
                <ul className="flex items-center space-x-4">
                  <li>
                    <Link
                      className="inline-flex items-center font-secondary text-xs leading-3"
                      href="/about"
                    >
                      <FaUserAlt className="mr-1.5" />
                      {author}
                    </Link>
                  </li>
                  <li className="inline-flex items-center font-secondary text-xs leading-3">
                    <FaRegCalendar className="mr-1.5" />
                    {dateFormat(content.attributes.Date)}
                  </li>
                </ul>

                <div className="flex flex-wrap my-2">
                    <ul className="flex flex-wrap items-center">
                              {content.attributes.tags.data.map((tag, index) => (
                                <li
                                  className="mx-2 inline-flex h-7 rounded-[35px] bg-primary px-3 text-white"
                                  key={"tag-" + index}
                                >
                                  <Link
                                    className="capitalize"
                                    href={`/categories/${tag.attributes.Slug.replace(" ", "-")}`}
                                  >
                                    {tag.attributes.Name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                  </div>


                {/* <div className="content mb-16"> */}
                {markdownify(content.attributes.Content, "div", "sm:mx-0 sm:p-0 sm:left-0")}
                  {/* <MDXRemote {...content.attributes.Content} components={shortcodes} /> */}
                {/* </div>  */}
                {/* {config.settings.InnerPaginationOptions.enableBottom && (
                  <InnerPagination posts={posts} date={date} />
                )} */}
              </article>
              {/* <div className="mt-16">
                {disqus.enable && (
                  <DiscussionEmbed
                    key={theme}
                    shortname={disqus.shortname}
                    config={disqusConfig}
                  />
                )}
              </div> */}
            </div>
            <Sidebar
              posts={relatedPost}
              // categories={allCategories}
              categories={content.attributes.tags }
            />
          </div>
        </div>
     

        {/* Related posts */}
        <div className="container mt-20">
          <h2 className="section-title">Related Posts</h2>
          <div className="row mt-16"> 
            {relatedPost.slice(0, 3).map((post, index) => (
              <div key={"post-" + index} className="mb-12 lg:col-4">
                <Post post={post} />
              </div>
            ))} 
           </div>
        </div>
      </section>
    </Base>)}
   </>

  );
};

export default PostSingle;
