import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import { FaEnvelope, FaMapMarkerAlt, FaUserAlt, FaClock } from "react-icons/fa";
import ImageFallback from "./components/ImageFallback";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactUs, submitContactForm } from "../redux/slices/contactSlice";

import React, { useEffect, useState } from "react";
import Loader from "./components/Loader";

const Contact = ({ data }) => {
  const { frontmatter } = data;
  const { title, form_action, phone, mail, location } = frontmatter;

  const dispatch = useDispatch();
  const { items: contact, formStatus, formError, formSuccess, status } = useSelector((state) => state.contact);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchContactUs());
    }
  }, [dispatch, status]);

  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactForm(formData));
  };


  return (

    <section className="section lg:mt-16">
      {status === 'loading' && <Loader />}
      {status === 'failed' && (<p className="top-1/3 mx-auto">Error loading Contact us!.</p>)}
      {
        contact && (
          <div className="container">
            <div className="row relative pb-16">
              <ImageFallback
                className="-z-[1] object-cover object-top"
                src={"/images/map.svg"}
                fill="true"
                alt="map bg"
                priority={true}
              />

              <div className="lg:col-6">
                {markdownify(
                  contact?.attributes?.Title,
                  "h1",
                  "h1 my-10 lg:my-11 lg:pt-11 text-center lg:text-left lg:text-[64px]"
                )}

                {/* Animated Work Hours Section */}
                <motion.div
                  className="work-hours mt-8 bg-gray-100 dark:bg-darkmode-bg p-6 rounded-lg shadow-lg items-center"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <h3 className="text-xl font-bold mb-4 text-primary flex items-center">
                    <FaClock className="mr-2" /> Work Hours
                  </h3>
                  <hr className="w-full zinc-800 text-2xl mb-6" />
                  {/* <div className=" flex flex-row justify-between items-start sm:flex-col"> */}
                  <ul className="text-lg text-dark dark:text-darkmode-light space-y-2">
                    {contact?.attributes?.WorkingHours.map((wh, index) => {
                      return (
                        <li key={index} className="mb-2 ml-2">
                          <span className="text-zinc-900 font-bold">{wh.day} : </span> {wh.hours}
                        </li>
                      )
                    })}
                  </ul>

                  {/* </div> */}
                </motion.div>

                {/* address */}
                <motion.div
                  className="work-hours mt-8 bg-gray-100 dark:bg-darkmode-bg p-6 rounded-lg shadow-lg mt-8"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <h3 className="text-xl font-bold mb-4 text-primary flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Address
                  </h3>
                  <hr className="w-full zinc-800 text-2xl mb-6" />

                  <p className="ml-1.5 text-lg font-bold text-dark dark:text-darkmode-light">
                    {contact?.attributes?.Address}
                  </p>

                </motion.div>
              </div>

              <div className="contact-form-wrapper rounded border border-border p-6 dark:border-darkmode-border lg:col-6">
                <h2>
                  Send Us A
                  <span className="ml-1.5 inline-flex items-center text-primary">
                    Message
                    <BsArrowRightShort />
                  </span>
                </h2>
               
                <form
                  className="contact-form mt-12"
                  method="POST"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-6">
                    <label className="mb-2 block font-secondary" htmlFor="name">
                      Full name
                      <small className="font-secondary text-sm text-primary">*</small>
                    </label>
                    <input
                      className="form-input w-full"
                      name="fullName"
                      type="text"
                      placeholder="Thomas Milano"
                      value={formData.name} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="mb-2 block font-secondary" htmlFor="email">
                      Email Address
                      <small className="font-secondary text-sm text-primary">*</small>
                    </label>
                    <input
                      className="form-input w-full"
                      name="email"
                      type="email"
                      placeholder="enatsoft@gmail.com"
                      value={formData.email} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="mb-2 block font-secondary" htmlFor="subject">
                      Subject
                      <small className="font-secondary text-sm text-primary">*</small>
                    </label>
                    <input
                      className="form-input w-full"
                      name="subject"
                      type="text"
                      placeholder="Place Order"
                      value={formData.subject} 
                      onChange={handleChange} 
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="mb-2 block font-secondary" htmlFor="message">
                      Your Message Here
                      <small className="font-secondary text-sm text-primary">*</small>
                    </label>
                    <textarea
                      className="form-textarea w-full"
                      placeholder="Hello I’m Mr ‘x’ from………….."
                      rows="7"
                      name="message"
                      value={formData.message} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <button type="submit" disabled={formStatus === 'loading'} className="btn btn-primary">
                      Submit
                    </button>

                    {formStatus === 'loading' && <p>Sending message...</p>}
                    {formSuccess && <p>{formSuccess}</p>}
                    {formError && <p>Error: {formError}</p>}
                </form>
              
              </div>
            </div>

            <div className="row">
              {contact?.attributes?.PhoneNumber && (
                <div className="col-5">
                  <Link
                    href={`tel:${contact?.attributes?.PhoneNumber}`}
                    className="my-4 flex h-[100px] items-center justify-center
             rounded border border-border p-4 text-primary dark:border-darkmode-border"
                  >
                    <FaUserAlt />
                    <p className="text-lg font-bold text-dark dark:text-darkmode-light">
                      {contact?.attributes?.PhoneNumber}
                    </p>
                  </Link>
                </div>
              )}
              {contact?.attributes?.Email && (
                <div className="col-5">
                  <Link
                    href={`mailto:${contact?.attributes?.Email}`}
                    className="my-4 flex h-[100px] items-center justify-center
             rounded border border-border p-4 text-primary dark:border-darkmode-border"
                  >
                    <FaEnvelope />
                    <p className="text-lg font-bold text-dark dark:text-darkmode-light">
                      {contact?.attributes?.Email}
                    </p>
                  </Link>
                </div>
              )}

            </div>

            <iframe
              src={`https://www.google.com/maps?q=${contact?.attributes?.MapCoordinates?.latitude},${contact?.attributes?.MapCoordinates?.longitude}&z=15&output=embed`}
              width="100%"
              height="400"
              className="border-0 rounded-lg shadow-lg"
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        )}
    </section>

  );
};

export default Contact;
