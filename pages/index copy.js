import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/partials/Post";
import Sidebar from "@layouts/partials/Sidebar";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import dateFormat from "@lib/utils/dateFormat";
import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { FaRegCalendar } from "react-icons/fa";
const { blog_folder, pagination } = config.settings;
import { useDispatch, useSelector } from "react-redux";
// import { fetchArticles } from "../redux/slices/articlesSlice";
import { fetchArticles, setSearch, setSelectedTags, setPagination } from '../redux/slices/articlesSlice';
import React, {useEffect, useState} from "react";

const Home = ({
  banner,
  posts,
  featured_posts,
  recent_posts,
  categories,
  promotion,
}) => {
  // define state
  const sortPostByDate = sortByDate(posts);
  const [featuredArticle, setFeaturedArticle]= useState(null);

  const featuredPosts = sortPostByDate.filter(
    (post) => post.frontmatter.featured
  );
  const showPosts = pagination;
  const BASE_URL = 'http://localhost:1337';
  
  const dispatch = useDispatch();
  // const {items: articles, status, error} = useSelector((state)=>state.articles);
  const { items, status, pagination, search, selectedTags } = useSelector((state) => state.articles);

  useEffect(() => {
    if (status === 'idle') {
    dispatch(fetchArticles({ page: pagination.currentPage, pageSize: pagination.pageSize, tags: selectedTags, search }));
    }
  }, [status, pagination.currentPage, pagination.pageSize, selectedTags, search, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const handleTagClick = (tag) => {
    dispatch(setSelectedTags([tag])); // Example: setting a single tag
  };

  // useEffect(() => {
  //   if (status === 'idle') {
  //     dispatch(fetchArticles());
  //   }
  // }, [status, dispatch]);

  useEffect(() => {
    articles.data && setFeaturedArticle(articles.data.find(article => article.attributes.Featured));
  },
  [status, articles.data]);
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  
  return (
    <Base>
      {/* Banner */}
{ featuredArticle &&
    ( 
       <section className="section banner relative pb-0">
        <ImageFallback
          className="absolute bottom-0 left-0 z-[-1] w-full"
          src={"/images/banner-bg-shape.svg"}
          width={1905}
          height={295}
          alt="banner-shape"
          priority
        />

        <div className="container">
          <div className="row flex-wrap-reverse items-center justify-center lg:flex-row overflow-hidden transition-transform transform hover:scale-95 duration-300 ease-in-out">
          
          {banner.image_enable && (
                <div className="col-9 lg:col-6 relative w-full">
                  <ImageFallback
                    className="mx-auto object-contain w-full h-64 object-cover md:h-96"
                    src={`${BASE_URL}${featuredArticle.attributes.Thumbnail.data.attributes.formats.thumbnail.url}`}
                    width={548}
                    height={443}
                    priority={true}
                    alt="Banner Image"
                    style={{ filter: 'blur(0px)', transition: 'filter 0.3s ease' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white pointer-events-none" 
                      style={{
                        backdropFilter: 'blur(55px)',
                        maskImage: 'linear-gradient(to right, transparent, black)'
                      }}
                    ></div>
                </div>
            )}

           
            <div className={banner.image_enable ? "mt-12 text-center lg:mt-0 lg:text-left lg:col-6 inset-0 flex flex-col justify-between items-start p-6 text-zinc-800 w-full" : "mt-12 text-center lg:mt-0 lg:text-left lg:col-12"}>
              <h2 className="banner-title text-3xl font-bold mb-4">
                {
            
                  featuredArticle.attributes.Title
                
                  }
                
              </h2>
              <p className="text-lg mb-4">
              {
                featuredArticle.attributes.Excerpt
                }
                </p>
              {banner.button.enable && (
                  <Link
                    className="btn btn-primary mt-6"
                    href={`/posts/${featuredArticle.attributes.Slug}`}
                  
                  >
                    Read More
                   
                  </Link>
              )}
            </div>

          </div>
        </div>
      </section>
      ) 
} 
      {/* Home main */}
      <section className="section">
        <div className="container">
          <div className="row items-center">
            <div className="mb-12 lg:mb-0 lg:col-12 flex items-center flex-col">
              {/* Featured posts */}
              {/* {featured_posts.enable && (
                <div className="section">
                  {markdownify(featured_posts.title, "h2", "section-title")}
                  <div className="rounded border border-border p-6 dark:border-darkmode-border">
                    <div className="row">
                      <div className="md:col-6">
                        <Post post={featuredPosts[0]} />
                      </div>
                      <div className="scrollbar-w-[10px] mt-8 max-h-[480px] scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-border dark:scrollbar-track-gray-800 dark:scrollbar-thumb-darkmode-theme-dark md:mt-0 md:col-6">
                        {featuredPosts
                          .slice(1, featuredPosts.length)
                          .map((post, i, arr) => (
                            <div
                              className={`mb-6 flex items-center pb-6 ${
                                i !== arr.length - 1 &&
                                "border-b border-border dark:border-darkmode-border"
                              }`}
                              key={`key-${i}`}
                            >
                              {post.frontmatter.image && (
                                <ImageFallback
                                  className="mr-3 h-[85px] rounded object-cover"
                                  src={post.frontmatter.image}
                                  alt={post.frontmatter.title}
                                  width={105}
                                  height={85}
                                />
                              )}
                              <div>
                                <h3 className="h5 mb-2">
                                  <Link
                                    href={`/${blog_folder}/${post.slug}`}
                                    className="block hover:text-primary"
                                  >
                                    {post.frontmatter.title}
                                  </Link>
                                </h3>
                                <p className="inline-flex items-center font-bold">
                                  <FaRegCalendar className="mr-1.5" />
                                  {dateFormat(post.frontmatter.date)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Promotion */}
              {promotion.enable && (
                <Link href={promotion.link} className="section block pt-0">
                  <ImageFallback
                    className="h-full w-full"
                    height="115"
                    width="800"
                    src={promotion.image}
                    alt="promotion"
                  />
                </Link>
              )}

              {/* Recent Posts */}
              {articles.data && (
                <div className="section pt-0 mx-auto flex flex-col items-center">
                  {markdownify(recent_posts.title, "h2", "section-title")}
                  {/* <div className="rounded border border-border px-6 pt-6 dark:border-darkmode-border"> */}
                    <div className="row mx-auto">
                      {articles.data.slice(0, showPosts).map((post) => (
                        <div className="mb-8 md:col-6" key={post.attributes.Slug}>
                          <Post post={post} />
                        </div>
                      ))}
                    </div>
                  {/* </div> */}
                </div>
              )}

              <Pagination
                totalPages={Math.ceil(posts.length / showPosts)}
                currentPage={1}
              />
            </div>
            {/* sidebar */}
            {/* <Sidebar
              className={"lg:mt-[9.5rem]"}
              posts={posts}
              categories={categories}
            /> */}
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Home;

// for homepage data
export const getStaticProps = async () => {
  const homepage = await getListPage("content/_index.md");
  const { frontmatter } = homepage;
  const { banner, featured_posts, recent_posts, promotion } = frontmatter;
  const posts = getSinglePage(`content/${blog_folder}`);
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  const categoriesWithPostsCount = categories.map((category) => {
    const filteredPosts = posts.filter((post) =>
      post.frontmatter.categories.includes(category)
    );
    return {
      name: category,
      posts: filteredPosts.length,
    };
  });

  return {
    props: {
      banner: banner,
      posts: posts,
      featured_posts,
      recent_posts,
      promotion,
      categories: categoriesWithPostsCount,
    },
  };
};
