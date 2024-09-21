import config from "@config/config.json";
import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import parseMDX from "@lib/utils/mdxParser";
const { blog_folder } = config.settings;
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticleDetails, fetchRelatedPosts } from '../../redux/slices/articlesSlice';

const Article = ({

  slug

}) => {
  const { frontmatter, content } = post;

  const dispatch = useDispatch();
  const { details, relatedPosts, status } = useSelector((state) => state.articles);

  
  useEffect(() => {
    if (details?.attributes?.tags) {
      const tags = details.attributes.tags.data.map(tag => tag.attributes.name);
      dispatch(fetchRelatedPosts(tags));
    }
  }, [details, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error loading article</p>;



  return (
    <PostSingle
      frontmatter={frontmatter}
      content={details}
      mdxContent={mdxContent}
      slug={slug}
      allCategories={allCategories}
      relatedPost={relatedPosts}
      posts={posts}
    />
  );
};

// get post single slug
export const getStaticPaths = () => {
  const allSlug = getSinglePage(`content/${blog_folder}`);
  const paths = allSlug.map((item) => ({
    params: {
      single: item.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};




// get post single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const posts = getSinglePage(`content/${blog_folder}`);
  const post = posts.find((p) => p.slug == single);
  const mdxContent = await parseMDX(post.content);
  // related posts
  const relatedPosts = posts.filter((p) =>
    post.frontmatter.categories.some((cate) =>
      p.frontmatter.categories.includes(cate)
    )
  );

  //all categories
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
      post: post,
      mdxContent: mdxContent,
      slug: single,
      allCategories: categoriesWithPostsCount,
      relatedPosts: relatedPosts,
      posts: posts,
    },
  };
};


export default Article;
