import React, { useEffect } from "react";
import PostSingle from "@layouts/PostSingle";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticleDetails, fetchRelatedPosts } from "../../redux/slices/articlesSlice";
import Loader from "@layouts/components/Loader";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// Article component
const Article = ({ slug }) => {
  const dispatch = useDispatch();
  const { details, relatedPosts, status } = useSelector((state) => state.articles);

  // Fetch article details and related posts on mount
  useEffect(() => {
    if (slug) {
      dispatch(fetchArticleDetails(slug));
    }
  }, [slug, dispatch]);

  // Fetch related posts based on tags if article details are loaded
  useEffect(() => {
    if (details) {
      // const tagList = details?.attributes?.tags?.data.map(tag => tag?.attributes?.Name);
      // dispatch(fetchRelatedPosts({currentPostId: details.id, tags: tagList}));
      dispatch(fetchRelatedPosts("Belgium"));
    }
  }, [details, dispatch]);


  
  return (
    <>
        {status === "loading"  && <Loader />}
        {status === "failed" && (<div className="h-full w-full text-2xl text-zinc-700 top-h/3 mx-auto">Error loading article</div>)}


      {

        details && (
          <PostSingle
  
          content={details.data[0]}
      
          relatedPost={relatedPosts}
         
        />
        )
      }
    </>

  );
};

// getStaticPaths to generate article pages
export const getStaticPaths = async () => {
  const response = await fetch(`${BASE_URL}/api/articles?populate=*`);
  const articles = await response.json();

  const paths = articles.data.map((article) => ({
    params: {
      single: article.attributes.Slug, // Use slug from your CMS (Strapi)
    },
  }));

  return {
    paths,
    fallback: true, // Enables ISR
  };
};

// getStaticProps to fetch article data for static generation
export const getStaticProps = async ({ params }) => {
  const { single: slug } = params;

  return {
    props: {
      slug, // Pass slug to the component
    },
    revalidate: 60, // Revalidate page every 60 seconds (ISR)
  };
};

export default Article;
