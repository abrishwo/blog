import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchAboutUs } from "../redux/slices/aboutSlice";


import React, {useEffect, useState} from "react";

const About = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title, image, education, experience } = frontmatter;
  const [abt, setAbt] = useState()

  const dispatch = useDispatch();
  const { items: about, status } = useSelector((state) => state.about);


  const BASE_URL = 'http://localhost:1337';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAboutUs());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error loading About us!.</p>;
  }


  return (
    // <>
    // {about && <p>{JSON.stringify(about)}</p>}
    // </>
    <section className="section mt-16">
      
      <div className="container text-center">
        {about.attributes.Image && (
          <div className="mb-8">
            <Image
              src={`${BASE_URL}${about.attributes.Image.data.attributes.formats.thumbnail.url}`}
              width={1298}
              height={616}
              alt={title}
              className="rounded-lg"
              priority={true}
            />
          </div>
        )}
        {markdownify(about.attributes.Title, "h1", "h1 text-left lg:text-[55px] mt-12")}

        <div className="content text-left">
           {markdownify(about.attributes.Content, "div")}
        </div>

        <div className="row mt-24 text-left lg:flex-nowrap">
          <div className="lg:col-6 ">
            <div className="rounded border border-border p-6 dark:border-darkmode-border ">
              {markdownify(education.title, "h2", "section-title mb-12")}
              <div className="row">
                {education.degrees.map((degree, index) => (
                  <div className="mb-7 md:col-6" key={"degree-" + index}>
                    <h4 className="text-base lg:text-[25px]">
                      {degree.university}
                    </h4>
                    <p className="mt-2">{degree.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="experience mt-10 lg:mt-0 lg:col-6">
            <div className="rounded border border-border p-6 dark:border-darkmode-border ">
              {markdownify(experience.title, "h2", "section-title mb-12")}
              <ul className="row">
                {experience?.list?.map((item, index) => (
                  <li
                    className="mb-5 text-lg font-bold text-dark dark:text-darkmode-light lg:col-6"
                    key={"experience-" + index}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
