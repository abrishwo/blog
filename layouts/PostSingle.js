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
import ImageGallery from "./components/GalleryImages";

const PostSingle = ({
  content,
  relatedPost,
  tags
}) => {

  const { theme } = useTheme();
  const author = "Admin";
 
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    

    // const thumb = [
    //   content.attributes.Thumbnail.data.attributes.formats.large.url,
    // ];
    
    // Check if there are gallery images, and map them to an array of URLs
    // const gall = content.attributes?.Images?.data.map(
    //   (image) => image.attributes.formats.large.url
    // );
    
    const imageUrls = content.attributes?.gallery?.images?.data?.map(
      (img) => img?.attributes?.formats?.large?.url
    );
   
    // const imageList = [...thumb, ...(gall || [])]; // Use spread operator to combine arrays
    // const imageList = gall || [];
    // console.log(imageList); 
    

  return (
   <>

   
   {content.attributes && ( <Base title={content.attributes?.SEO?.metaTitle?content.attributes?.SEO?.metaTitle:content.attributes.Title} meta_title={content.attributes?.SEO?.metaTitle?content.attributes?.SEO?.metaTitle:content.attributes.Title} meta_keywords={content.attributes?.SEO?.metaKeywords?content.attributes?.SEO?.metaKeywords:content.attributes.Title} description={content.attributes?.SEO?.metaDescription?content.attributes?.SEO?.metaDescription:content.attributes.Content}>
      <section className="section single-blog md:mt-6">
        <div className="container">
        {markdownify(content.attributes.Title, "h1", "title-h2 lg:text-[42px] my-4")}
         
      
         
          <div className="row">

          {(content.attributes?.gallery && content.attributes?.gallery?.Position === 'below-title' && content.attributes?.gallery?.Layout === 'grid') && (
              <ImageGallery
                images={content.attributes?.gallery?.images?.data?.map((img) => ({
                  url: BASE_URL + img?.attributes?.formats?.large?.url,
                  alt: img.alt || "Gallery Image",
                }))}
                layout={content.attributes?.gallery?.Layout}
                position={content.attributes?.gallery?.Position}
                smallImagePosition={content.attributes?.gallery?.smallImagePosition}
              />
            )}




            <div className="lg:col-8">
              <article>
              {(content.attributes?.gallery && (content.attributes?.gallery?.Position === 'below-title' && content.attributes?.gallery?.Layout === 'carousel')) && (
                <div className="relative">
                    <GallerySlider 
                    images={imageUrls}
                    
                    position={content.attributes?.gallery?.Position}
                    smallImagePosition={content.attributes?.gallery?.smallImagePosition}
                  />
                  
                </div>
              )}
                {/* {markdownify(content.attributes.Title, "h1", "title-h2 lg:text-[42px] mt-4")} */}
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

                {markdownify(content.attributes.Content, "div", "enatsoft-post-content sm:mx-0 sm:p-0 sm:left-0 content text-left")}
                 
               


         {(content.attributes?.gallery && (content.attributes?.gallery?.Position === 'end-of-article' && content.attributes?.gallery?.Layout === 'grid')) && (
            <div className="relative">
              <ImageGallery
                images={content.attributes?.gallery?.images?.data?.map((img) => ({
                  url: BASE_URL + img?.attributes?.formats?.large?.url,
                  alt: img.alt || "Gallery Image",
                }))}
                layout={content.attributes?.gallery?.Layout}
                position={content.attributes?.gallery?.Position}
                smallImagePosition={content.attributes?.gallery?.smallImagePosition}
              />
             
             </div>
            )} 
{/* blogger/frontend/layouts/PostSingle.js */}
{(content.attributes?.gallery && (content.attributes?.gallery?.Position === 'end-of-article' && content.attributes?.gallery?.Layout === 'carousel')) && (
                <div className="relative">
                    <GallerySlider 
                    images={imageUrls}
                    
                    position={content.attributes?.gallery?.Position}
                    smallImagePosition={content.attributes?.gallery?.smallImagePosition}
                  />
                  
                </div>
              )}
              </article>
             
            </div>
            <Sidebar
              posts={relatedPost}
              tags={tags??[]}
              categories={content.attributes.tags }
            />
          </div>
        </div>
     



        {/* Related posts */}
        {relatedPost && (<div className="container mt-20">
          <h2 className="section-title">{relatedPost.attributes && "Related Posts"}</h2>
          <div className="row mt-16"> 
           
            {relatedPost.slice(0, 3).map((post, index) => (
              <div key={"post-" + index} className="mb-12 lg:col-4">
                <Post post={relatedPost} />
              </div>
            ))} 
           </div>
        </div>)}
      </section>
    </Base>)}
   </>

  );
};

export default PostSingle;
