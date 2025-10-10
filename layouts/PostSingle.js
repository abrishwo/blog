import config from "@config/config.json";
import Base from "@layouts/Baseof";
import dateFormat from "@lib/utils/dateFormat";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { FaRegCalendar, FaUserAlt } from "react-icons/fa";
import Sidebar from "./partials/Sidebar";
import React, { useState, useEffect } from "react";
import { FaRandom, FaSortAlphaDown } from 'react-icons/fa';
import styles from "./components/ImageGallery.module.scss";
import ImageGallery from "./components/GalleryImages";
import GallerySlider from "./components/GalleryView";

const PostSingle = ({ content, relatedPost, tags }) => {
  const author = "Admin";
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const galleryData = content.attributes?.gallery;
  const initialImages = galleryData?.images?.data;

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    if (initialImages) {
      setGalleryImages(initialImages.map((img, index) => ({ ...img, dndId: `image-${index}` })));
    }
  }, [initialImages]);

  const handleShuffle = () => {
    setGalleryImages(prevImages => [...prevImages].sort(() => 0.5 - Math.random()));
  };

  const handleSort = () => {
    setGalleryImages(prevImages =>
      [...prevImages].sort((a, b) =>
        a.attributes.name.localeCompare(b.attributes.name)
      )
    );
  };

  const galleryComponent = galleryData && (
    <div className={styles.galleryContainer}>
  { /* <div className={styles.controls}>
        <button onClick={handleShuffle} className={styles.controlButton}>
          <FaRandom /> Shuffle
        </button>
        <button onClick={handleSort} className={styles.controlButton}>
          <FaSortAlphaDown /> Sort A-Z
        </button>
      </div> */}
      {galleryData.Layout === 'grid' ? (
        <ImageGallery
          images={galleryImages}
          setImages={setGalleryImages}
          layout={galleryData.Layout}
        />
      ) : (
        <GallerySlider
          images={galleryImages}
          smallImagePosition={galleryData.smallImagePosition}
        />
      )}
    </div>
  );

  return (
    <>
      {content.attributes &&  ( <Base title={content.attributes?.SEO?.metaTitle?content.attributes?.SEO?.metaTitle:content.attributes.Title} meta_title={content.attributes?.SEO?.metaTitle?content.attributes?.SEO?.metaTitle:content.attributes.Title} meta_keywords={content.attributes?.SEO?.metaKeywords?content.attributes?.SEO?.metaKeywords:content.attributes.Title} description={content.attributes?.SEO?.metaDescription?content.attributes?.SEO?.metaDescription:content.attributes.Content}>
      <section className="section single-blog md:mt-6">
            <div className="container">
              {markdownify(content.attributes.Title, "h1", "title-h2 lg:text-[42px] my-4")}
              <div className="row">
                {galleryData?.Position === 'below-title' && galleryComponent}
                <div className="lg:col-8">
                  <article>
                    <ul className="flex items-center space-x-4">
                      <li>
                        <Link className="inline-flex items-center font-secondary text-xs leading-3" href="/about">
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
                          <li className="mx-2 inline-flex h-7 rounded-[35px] bg-primary px-3 text-white" key={"tag-" + index}>
                            <Link className="capitalize" href={`/categories/${tag.attributes.Slug.replace(" ", "-")}`}>
                              {tag.attributes.Name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {markdownify(content.attributes.Content, "div", "enatsoft-post-content sm:mx-0 sm:p-0 sm:left-0 content text-left")}
                    {galleryData?.Position === 'end-of-article' && galleryComponent}
                  </article>
                </div>
                <Sidebar posts={relatedPost} tags={tags ?? []} categories={content.attributes.tags} />
              </div>
            </div>
          </section>
        </Base>
      )}
    </>
  );
};

export default PostSingle;
