import Base from "@layouts/Baseof";
import Post from "@partials/Post";
import { fetchPostsByTags } from "../../redux/slices/articlesSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@layouts/components/Loader";
import Pagination from "@layouts/components/Pagination";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// category page
const Category = ({ slug }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { postsByTag, pagination, byTagStatus } = useSelector((state) => state.articles);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPostsByTags({ tag: slug, page: currentPage }));
  }, [slug, currentPage, dispatch]);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
                {byTagStatus === 'loading' ? (
                  <Loader />
                ) : postsByTag && postsByTag.length > 0 ? (
                  postsByTag.map((post, i) => (
                    <div key={`key-${i}`} className="col-12 mb-8 md:col-6">
                      <Post post={post} />
                    </div>
                  ))
                ) : (
                  <p className="w-full text-center">No posts found for this category.</p>
                )}
              </div>
              <div className="mt-8">
                {pagination.totalPages > 1 && (
                  <Pagination
                    section={router.query.section || ""}
                    totalPages={pagination.totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
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
