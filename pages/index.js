import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/partials/Post";
import Sidebar from "@layouts/partials/Sidebar";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { FaRegCalendar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles, fetchFeaturedArticle, fetchTags, setPagination } from '../redux/slices/articlesSlice';
import React, { useEffect, useRef } from "react";
import Loader from "@layouts/components/Loader";
import { useRouter } from 'next/router';

const { blog_folder } = config.settings;

const Home = ({
  banner,
  categories,
  promotion,
}) => {
  const dispatch = useDispatch();
  const { items: articles, status, pagination, featuredArticle, tags } = useSelector((state) => state.articles);
  
  const containerRef = useRef(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  // Fetch featured article and paginated articles on initial load
  useEffect(() => {
    dispatch(fetchFeaturedArticle());
    dispatch(fetchArticles({ page: 1, pageSize: pagination.pageSize }));
    dispatch(fetchTags());
  }, [dispatch, pagination.pageSize]);

  // Handle route changes to refetch data if needed
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === '/') {
        dispatch(setPagination({ ...pagination, currentPage: 1 }));
        dispatch(fetchArticles({ page: 1, pageSize: pagination.pageSize }));
        dispatch(fetchTags());
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, dispatch, pagination]);

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const handleTagClick = (tag) => {
    dispatch(setSelectedTags([tag]));
  };
  const handlePageChange = (page) => {
    dispatch(setPagination({ ...pagination, currentPage: page }));
    dispatch(fetchArticles({ page: page, pageSize: pagination.pageSize }));
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  

  return (
    <Base>

      {/* {(status === 'loading' || status === 'idle' && !featuredArticle) && <Loader />} */}
      {/* Banner Section */}

      {featuredArticle && (
        <section className="section banner relative pb-0">
          <ImageFallback
            className="absolute bottom-0 left-0 z-[-1] w-full"
            src="/images/banner-bg-shape.svg"
            width={1905}
            height={295}
            alt="banner-shape"
            priority
          />
          <div className="container">
            <div className="row flex-wrap items-center justify-center lg:flex-row overflow-hidden">

              {/* <div className="sm:flex-wrap row md:flex-wrap-reverse items-center justify-center lg:flex-row overflow-hidden transition-transform transform hover:scale-95 duration-300 ease-in-out"> */}
              {/* {banner.image_enable && ( */}
              <div className="col-9 lg:col-6 relative w-full">
              <Link
                    href={`/${blog_folder}/${featuredArticle?.attributes.Slug}`}
                    className="block hover:text-primary"
                  >
                <ImageFallback
                  className="mx-auto object-contain w-full h-full md:h-96"
                  // className="rounded"
                  src={(BASE_URL + featuredArticle?.attributes.Thumbnail.data.attributes.formats.large.url) ?? '/images/placeholder_img.png'}

                  width={featuredArticle?.attributes.Thumbnail.data.attributes.formats.large.width}
                  height={featuredArticle?.attributes.Thumbnail.data.attributes.formats.large.height}

                  priority
                  alt="Banner Image"
                />
                </Link>
              </div>

              <div className="content-container md:mt-12 text-center lg:mt-0 lg:text-left lg:col-6 inset-0 flex flex-col justify-between items-start p-6 text-zinc-800 w-full">
                <h2 className="banner-title text-3xl font-bold mb-4">


                  <Link
                    href={`/${blog_folder}/${featuredArticle?.attributes.Slug}`}
                    className="block hover:text-primary"
                  >
                    {featuredArticle?.attributes.Title}
                  </Link>

                </h2>

                {
  featuredArticle?.attributes.tags.data.length>0 &&
        (<ul className="flex flex-wrap items-center mb-4">
          {featuredArticle?.attributes.tags.data.slice(0,3).map((tag, index) => (
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
        </ul>)
        
        }


                <p className="text-lg mb-4">
                  {featuredArticle?.attributes.Excerpt}
                </p>

                <Link
                  //  className="btn btn-primary mt-6" 
                  className="btn btn-outline-primary mt-4"
                  href={`/posts/${featuredArticle?.attributes.Slug}`}
                >
                  Read More
                </Link>

              </div>
            </div>
            {/* sidebar */}

          </div>
        </section>
      )}
      {/* {JSON.stringify(articles)} */}
      {/* Recent Posts Section */}
      {(status === 'loading' || status === 'idle' || !articles ) && <Loader />}
      {(status !== 'loading' && status !== 'idle' &&  articles?.data ) && (
      <section className="section" >
        <div className="container">
          <div className="row items-start">

            {/* <div className="mb-12 lg:mb-0 lg:col-8 flex items-center flex-col">
             */}
  <div className="mb-12 lg:mb-0 lg:col-8">
  <div ref={containerRef} className="section pt-0 mx-auto flex flex-col items-center">
    {markdownify("Recent Posts", "h2", "section-title")}
    <div className="row mx-auto">
      {articles?.data?.map((post) => (
        <div className="col-12 mb-8 md:col-6" key={post.attributes.Slug}>
          <Post post={post} />
        </div>
      ))}
    </div>
  </div>

  {/* Pagination */}
  {articles?.meta?.pagination && (
    <Pagination
      section={router.query.section || "page"}
      totalPages={Math.ceil(articles.meta.pagination.total / articles.meta.pagination.pageSize)}
      currentPage={pagination.currentPage}
      onPageChange={handlePageChange}
    />
  )}
</div>




            <Sidebar
              className={"lg:mt-[9.5rem]"}
              tags={tags ?? []}
            />
          </div>
        </div>
      </section>

    )}

    </Base>
  );
};


export default Home;


