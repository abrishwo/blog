import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import { FaEnvelope, FaMapMarkerAlt, FaUserAlt, FaClock } from "react-icons/fa";
import ImageFallback from "./components/ImageFallback";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactUs, submitContactForm , setMailConfig} from "../redux/slices/contactSlice";

import React, { useEffect, useState } from "react";
import Loader from "./components/Loader";

import dynamic from 'next/dynamic'; // To prevent SSR issues with React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'react-quill/dist/quill.bubble.css'; // For a different theme
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import ToastNotification, { showSuccessToast, showErrorToast } from './components/ToastNotification';


// const modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { font: [] }],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     ['bold', 'italic', 'underline'],
//     [{ align: [] }],
//     ['blockquote', 'code-block'],
//     ['link', 'image', 'video'], // Adding image and video options
//     [{ color: [] }, { background: [] }],
//     ['clean'], // Remove formatting button
//   ],
// };
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    [{ color: [] }, { background: [] }],
    ['clean'], // Remove formatting button
  ],
};
// Editor formats to be used for content
// const formats = [
//   'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
//   'align', 'blockquote', 'code-block', 'link', 'image', 'video', 'color', 'background',
// ];
const formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
  'align', 'blockquote', 'code-block', 'link', 'color', 'background',
];
const editorStyle = {
  height: '250px',  // Custom height for the text editor
};

const Contact = ({ data }) => {
  const { frontmatter } = data;
  const { title, form_action, phone, mail, location } = frontmatter;

  const dispatch = useDispatch();
  const { items: contact, formStatus, formError, formSuccess, status, mailConfig } = useSelector((state) => state.contact);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchContactUs());
    }
  }, [dispatch, status]);

  useEffect(() => {

    if(status === 'complete' || contact){
         dispatch(setMailConfig(contact?.attributes?.Email_config) ); 
    }
  }, [contact, dispatch]);

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
  const handleRichTextChange = (content) => {
    setFormData({ ...formData, message: content });
  };
const resetFormData = () => {
  setFormData({
    fullName: '',
    subject: '',
    email: '',
    message: '',
  });
}
  if (formSuccess) {
    resetFormData();
    showSuccessToast('Your message is submitted successfully!');
  }

  if (formError) {
    resetFormData();
    showErrorToast('Failed to submit the form. Please try again.');
  }

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
               {contact?.attributes?.FormInstructions && ( <motion.div
                  className="work-hours mt-8 bg-gray-100 dark:bg-darkmode-bg p-6 rounded-lg shadow-lg items-center"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  
                  <hr className="w-full zinc-800 text-2xl mb-6" />
                  {/* <div className=" flex flex-row justify-between items-start sm:flex-col"> */}
                  {markdownify(
                  contact?.attributes?.FormInstructions,
                  "p",
                  "p my-10 lg:my-11 lg:pt-11 text-center lg:text-left lg:text-[34px]"
                )}

                  {/* </div> */}
                </motion.div>)}



                {/* Animated Work Hours Section */}
               {contact?.attributes?.WorkingHours.length>0 && ( <motion.div
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
                </motion.div>)}

                {/* address */}
                {contact?.attributes?.Address && (<motion.div
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

                </motion.div>)}
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
                      placeholder="Abreham Shiferaw"
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
                      placeholder="info@enatsoft.com"
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
                    <ReactQuill
                      theme="snow"
                      value={formData.message}
                      onChange={handleRichTextChange}
                      modules={modules}       // Custom toolbar
                      formats={formats}       // Custom formats
                      style={editorStyle}     // Set height
                      
                   />

                  
                  </div>
                  <div className="mt-16 mx-auto flex justify-evenly">
                  <button type="submit" disabled={formStatus === 'loading'} className="mt-12 px-5 w-1/3 btn btn-primary">
                      {formStatus === 'loading' ? 'Submitting...' : 'Submit'}
                    </button>

                    {(formData.fullName!=='' || formData.email!=='' || formData.subject!=='' || formData.message!==''  )&& (<button type="button"  onClick = {resetFormData} className="mt-12 px-5 w-1/3 btn btn-primary bg-red-700">
                      {formStatus === 'idle' && 'Reset'}
                    </button>)}
                  </div>
                </form>
                
                  <ToastNotification />
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

          {contact?.attributes?.MapCoordinates?.length>0 && ( <iframe
              src={`https://www.google.com/maps?q=${contact?.attributes?.MapCoordinates?.latitude},${contact?.attributes?.MapCoordinates?.longitude}&z=15&output=embed`}
              width="100%"
              height="400"
              className="border-0 rounded-lg shadow-lg"
              allowFullScreen={true}
              loading="lazy"
            ></iframe>)}
          </div>
        )}
    </section>

  );
};

export default Contact;
