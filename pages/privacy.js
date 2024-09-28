import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrivacy } from "../redux/slices/PrivacySlice";


import React, {useEffect, useState} from "react";
import Loader from "../layouts/components/Loader";
import Base from "@layouts/Baseof";

const Privacy = ({ data }) => {
  // const { frontmatter, mdxContent } = data;
  // const { title, image, education, experience } = frontmatter;
  const [abt, setAbt] = useState()

  const dispatch = useDispatch();
  const { privacy, status } = useSelector((state) => state.privacy);


  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPrivacy());
    }
  }, [status, dispatch]);




  return (
  
    <Base title={privacy?.attributes?.Title??"Privacy"}>
      <section className="section md:mt-12 md:px-6">
        {status === 'success' && <Loader />}
        {status === 'failed' && (<p className="top-1/3 mx-auto">Error loading Privacy us!.</p>)}
      
      { privacy && (
                
        <div className="container md:w-3/4 flex flex-col items-start">
       {markdownify(privacy?.attributes?.Title, "h1", "title-h2 text-left lg:text-[55px] mt-12")}
           {markdownify(privacy?.attributes?.Content, "div", "enatsoft-post-content")}

      </div>
        )
      }
  
      </section>

    </Base>

  );
};

export default Privacy;
