// import config from "@config/config.json";
import Base from "@layouts/Baseof";
// import Sidebar from "@layouts/partials/Sidebar";
// import { getSinglePage } from "@lib/contentParser";
// import { getTaxonomy } from "@lib/taxonomyParser";
// import { slugify } from "@lib/utils/textConverter";
import Post from "@partials/Post";
// const { blog_folder } = config.settings;

import { fetchPostsByTags, fetchRelatedPosts } from "../../redux/slices/articlesSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@layouts/components/Loader";
import React, {useEffect, useState} from "react";
// category page
const Category = ({slug}) => {


  const dispatch = useDispatch();
  const { postsByTag, relatedPosts, status } = useSelector((state) => state.articles);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostsByTags(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (postsByTag) {
      // const tagList = details?.attributes?.tags?.data.map(tag => tag?.attributes?.Name);
      // dispatch(fetchRelatedPosts({currentPostId: details.id, tags: tagList}));
      dispatch(fetchRelatedPosts("Belgium"));
    }
  }, [postsByTag, dispatch]);


  return (
    <>
{/* <br/>
<br/>
<br/> */}
    {/* {postsByTag && (JSON.stringify(postsByTag))} */}
    
    {status === 'loading' && <Loader />}
    <Base title={slug}>
      <div className="section mt-16">
        <div className="container">
          <h1 className="h2 mb-12">
            Showing posts from
            <span className="section-title ml-1 inline-block capitalize">
              {slug.replace("-", " ")}
            </span>
          </h1>
          <div className="row">
            <div className="lg:col-12">
              <div className="row rounded border border-border p-4 px-3 dark:border-darkmode-border lg:p-6">
                {postsByTag.map((post, i) => (
                  <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                    <Post post={post} />
                  </div>
                ))}
              </div>
            </div>
            {/* <Sidebar posts={posts} categories={categories} /> */}
          </div>
        </div>
      </div>
    </Base>
    </>
  );
};

export default Category;



// getStaticPaths to generate article pages
export const getStaticPaths = async () => {
  const response = await fetch("https://vivid-flowers-9f3564b8da.strapiapp.com/api/tags?populate=*");
  const tags = await response.json();

  const paths = tags.data.map((tag) => ({
    params: {
      category: tag.attributes.Slug, // Use slug from your CMS (Strapi)
    },
  }));

  return {
    paths,
    fallback: true, // Enables ISR
  };
};

// getStaticProps to fetch article data for static generation
export const getStaticProps = async ({ params }) => {
  const { category: slug } = params;

  return {
    props: {
      slug, // Pass slug to the component
    },
    revalidate: 60, // Revalidate page every 60 seconds (ISR)
  };
};