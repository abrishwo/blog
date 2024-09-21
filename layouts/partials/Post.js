import config from "@config/config.json";
import ImageFallback from "@layouts/components/ImageFallback";
import dateFormat from "@lib/utils/dateFormat";
import Link from "next/link";
import { FaRegCalendar, FaUserAlt } from "react-icons/fa";
import { markdownify } from "@lib/utils/textConverter";

const Post = ({ post }) => {
  const { summary_length, blog_folder } = config.settings;
  const { meta_author } = config.metadata;
  // const author = post.frontmatter.author ? post.frontmatter.author : meta_author;
  const author = "Admin";
  const BASE_URL = 'http://localhost:1337';
  return (
    <>
    { post.attributes &&(<div className="post">
      <div className="relative">
        {post.attributes && (
          <ImageFallback
            className="rounded"
            src={`${BASE_URL}${post.attributes.Thumbnail.data.attributes.formats.thumbnail.url}`}
            alt={post.attributes.Title}
            width={405}
            height={208}
          />
        )}
{
  post.attributes.tags.data.length>0 &&
        (<ul className="absolute top-3 left-2 flex flex-wrap items-center">
          {post.attributes.tags.data.map((tag, index) => (
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
      </div>
      <h3 className="h5 mb-2 mt-4">
        <Link
          href={`/${blog_folder}/${post.attributes.Slug}`}
          className="block hover:text-primary"
        >
          {post.attributes.Title}
        </Link>
      </h3>
      <ul className="flex items-center space-x-4">
        <li>
          <Link
            className="inline-flex items-center font-secondary text-xs leading-3"
            href="/about"
          >
            <FaUserAlt className="mr-1.5" />
            {author}
          </Link>
        </li>
        <li className="inline-flex items-center font-secondary text-xs leading-3">
          <FaRegCalendar className="mr-1.5" />
          {dateFormat(post.attributes.Date)}
        </li>
      </ul>
      {/* <p>{post.attributes.Excerpt}</p> */}
      {markdownify(post.attributes.Content.slice(0, Number(summary_length)), "p")}
      {/* <p>{post.attributes.Content.slice(0, Number(summary_length))}</p> */}
      <Link
        className="btn btn-outline-primary mt-4"
        href={`/${blog_folder}/${post.attributes.Slug}`}
      >
        Read More
      </Link>
    </div>)}

    </>
  );
};

export default Post;
