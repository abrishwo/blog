import React, { useEffect } from "react";
import PostSingle from "@layouts/PostSingle";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticleDetails, fetchRelatedPosts } from "../../redux/slices/articlesSlice";

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
      // const tagList = details.attributes.tags.data.map(tag => tag.attributes.Name);
      dispatch(fetchRelatedPosts(["belgium"]));
    }
  }, [details, dispatch]);

  // Handle loading and error states
  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error loading article</p>;

  
  return (
    <>
{/* <p>{JSON.stringify(relatedPosts)}</p> */}
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
  const response = await fetch("https://vivid-flowers-9f3564b8da.strapiapp.com/api/articles?populate=*");
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
