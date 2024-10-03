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
import { fetchArticles, setSearch, setSelectedTags, setPagination, fetchTags } from '../redux/slices/articlesSlice';
import React, { useEffect, useState } from "react";
import Loader from "@layouts/components/Loader";

const { blog_folder } = config.settings;

const Home = ({
  banner,
  categories,
  promotion,
}) => {
  const dispatch = useDispatch();
  const { items: articles, status, pagination, search, selectedTags, tags } = useSelector((state) => state.articles);

  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [filteredArticles, setFilteredArticles] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
 

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        tags: selectedTags,
        search,
      }));

      dispatch(fetchTags());
    }
  }, [status, pagination.currentPage, pagination.pageSize, dispatch]);

  // useEffect(() => {
  //   if (!articles) {
  //     dispatch(fetchArticles({
  //       page: pagination.currentPage,
  //       pageSize: pagination.pageSize,
  //       tags: selectedTags,
  //       search,
  //     }));

  //     dispatch(fetchTags());
  //   }
  // }, [status, pagination.currentPage, articles, pagination.pageSize, search, dispatch]);


  useEffect(() => {
    if (articles) {
      const featured = articles?.data?.find(article => article?.attributes?.Featured);
      const filteredArticlesData = articles?.data?.filter(article => !article?.attributes?.Featured);
      setFeaturedArticle(featured);
      setFilteredArticles(filteredArticlesData);
    }
    if(!tags){
      dispatch(fetchTags());
    }
    
  }, [articles]);

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const handleTagClick = (tag) => {
    dispatch(setSelectedTags([tag]));
  };

  useEffect(() => {
    // Only fetch articles if the items array is empty
    if (articles?.data?.length === 0 && status !== 'loading') {
      dispatch(fetchArticles({ page: pagination.currentPage, pageSize: pagination.pageSize }));
    }
  }, [dispatch, articles, pagination.currentPage, pagination.pageSize, status]);


  return (
    <Base>

    {status === 'loading' && <Loader />}
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
            {/* <div className="row flex-wrap-reverse items-center justify-center lg:flex-row overflow-hidden transition-transform transform hover:scale-95 duration-300 ease-in-out"> */}
             
             <div className="sm:flex-wrap row md:flex-wrap-reverse items-center justify-center lg:flex-row overflow-hidden transition-transform transform hover:scale-95 duration-300 ease-in-out">
              {/* {banner.image_enable && ( */}
                <div className="col-9 lg:col-6 relative w-full">
                  <ImageFallback
                    className="mx-auto object-contain w-full h-64 object-cover md:h-96"
                    src={`${BASE_URL}${featuredArticle.attributes.Thumbnail.data.attributes.formats.thumbnail.url}`}
                    width={548}
                    height={443}
                    priority
                    alt="Banner Image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white pointer-events-none" 
                      style={{
                        backdropFilter: 'blur(55px)',
                        maskImage: 'linear-gradient(to right, transparent, black)'
                      }}
                    ></div>
                </div>
              {/* // )}  */}

              {/* <div className={banner.image_enable ? "mt-12 text-center lg:mt-0 lg:text-left lg:col-6 inset-0 flex flex-col justify-between items-start p-6 text-zinc-800 w-full" : "mt-12 text-center lg:mt-0 lg:text-left lg:col-12"}> */}
                <div className="content-container md:mt-12 text-center lg:mt-0 lg:text-left lg:col-6 inset-0 flex flex-col justify-between items-start p-6 text-zinc-800 w-full">
                <h2 className="banner-title text-3xl font-bold mb-4">
                  {featuredArticle.attributes.Title}
                </h2>
                <p className="text-lg mb-4">
                  {featuredArticle.attributes.Excerpt}
                </p>
              
                  <Link className="btn btn-primary mt-6" href={`/posts/${featuredArticle.attributes.Slug}`}>
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
      <section className="section">
        <div className="container">
          <div className="row items-start">

            {/* <div className="mb-12 lg:mb-0 lg:col-8 flex items-center flex-col">
             */}
           <div className="mb-12 lg:mb-0 lg:col-8">
              {filteredArticles && (
                <div className="section pt-0 mx-auto flex flex-col items-center">
                  {markdownify('Recent Posts', "h2", "section-title")}
                  <div className="row mx-auto">
                    {filteredArticles?.slice(0, pagination.pageSize).map((post) => (
                      <div className="mb-8 md:col-6" key={post.attributes.Slug}>
                        <Post post={post} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Pagination
                totalPages={Math.ceil(articles?.meta?.pagination?.total / articles?.meta?.pagination?.pageSize)}
                currentPage={pagination.currentPage}
                onPageChange={(page) => dispatch(setPagination({ ...pagination, currentPage: page }))}
              />
            </div>

            
            <Sidebar
              className={"lg:mt-[9.5rem]"}
              tags={tags??[]}
            />
          </div>
        </div>
      </section>


      
    </Base>
  );
};


export default Home;


