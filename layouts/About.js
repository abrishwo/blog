import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchAboutUs } from "../redux/slices/aboutSlice";
import parse from "html-react-parser";

import React, {useEffect, useState} from "react";
import Loader from "./components/Loader";

const About = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title, image, education, experience } = frontmatter;
  const [abt, setAbt] = useState()

  const dispatch = useDispatch();
  const { items: about, status } = useSelector((state) => state.about);


  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAboutUs());
    }
  }, [status, dispatch]);

  // if (status === 'loading') {
  //   return <p>Loading...</p>;
  // }

  // if (status === 'failed') {
  //   return ;
  // }


  return (
  
     
      <section className="section md:mt-16 md:px-12">
        {status === 'success' && <Loader />}
        {status === 'failed' && (<p className="top-1/3 mx-auto">Error loading About us!.</p>)}
      
      { about && (
                
        <div className="container md:w-3/4 flex flex-col items-start">
        {about?.attributes?.Image && (
          <div className="mb-8 ">
            <Image
              src={`${BASE_URL}${about.attributes.Image.data.attributes.formats.large.url}`}
              width={1298}
              height={616}
              alt={about.attributes.Title}
              className="rounded-lg thumbnail-images"
              priority={true}
            />
          </div>
         )} 
        {markdownify(about?.attributes?.Title, "h1", "title-h2 text-left lg:text-[55px] mt-12")}

        {/* <div className="content text-left"> */}
        {/* <div dangerouslySetInnerHTML={{ __html: about?.attributes?.Content }} /> */}
           {markdownify(about?.attributes?.Content, "div", "content text-left enatsoft-post-content")}
           {/* {parse(about?.attributes?.Content)} */}
           {/* {about?.attributes?.Content} */}
        {/* </div> */}
      </div>
        )
      }
  
      </section>

  );
};

export default About;
