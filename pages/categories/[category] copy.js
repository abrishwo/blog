import Base from "@layouts/Baseof";
import Post from "@partials/Post";
import { fetchPostsByTags, fetchRelatedPosts } from "../../redux/slices/articlesSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@layouts/components/Loader";
import React, { useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// category page
const Category = ({ slug }) => {
  const dispatch = useDispatch();
  const { postsByTag, relatedPosts, status } = useSelector((state) => state.articles);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostsByTags(slug));
    }
  }, [slug, dispatch,status]);

  // useEffect(() => {
  //   if (postsByTag && postsByTag.length > 0) {
  //     dispatch(fetchRelatedPosts("Belgium")); // Adjust this if needed
  //   }
  // }, [postsByTag, dispatch]);

  if (status === 'loading') return <Loader />;

  return (
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
                {postsByTag && postsByTag.length > 0 ? (
                  postsByTag.map((post, i) => (
                    <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                      <Post post={post} />
                    </div>
                  ))
                ) : (
                  JSON.stringify(postsByTag),
                  <p>No posts found for this category.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Category;

// getStaticPaths to generate article pages
export const getStaticPaths = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/tags?populate=*`);
    const tags = await response.json();

    // Check if tags.data is an array and not null
    const paths = Array.isArray(tags.data) ? tags.data.map((tag) => ({
      params: {
        category: tag.attributes.Slug,
      },
    })) : [];

    return {
      paths,
      fallback: 'blocking', // Use 'blocking' to handle not found routes properly
    };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { paths: [], fallback: 'blocking' };
  }
};

// getStaticProps to fetch article data for static generation
export const getStaticProps = async ({ params }) => {
  const { category: slug } = params;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};
