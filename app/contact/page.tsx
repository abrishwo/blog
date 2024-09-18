"use client";
import React, { useEffect, useState } from "react";
import { fetchContactUs } from "../../utils/api";
import { Contact } from "../../types";
import { motion } from "framer-motion";
import { CallOutline, MailOutline , LocationOutline} from 'react-ionicons'



const ContactPage = () => {
  const [contactData, setContactData] = useState<Contact[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchContactUs();
      setContactData(data.data);
    };
    fetchData();
  }, []);

  if (!contactData[0]) return <p>Loading...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      {contactData[0] && (
        <div className="container mx-auto px-4 py-10">
          {/* Contact Information */}
          <motion.feTile>
          <h1 className="text-4xl font-bold mb-6">
              {contactData[0].attributes.Title}
            </h1>
          </motion.feTile>

         <motion.div 
         initial={{ opacity: 0, y: 90 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 5 }}
         className=" mx-auto p-6 bg-white rounded-lg shadow-lg flex sm:flex-col md:flex-row lg:flex-row justify-evenly"
       >


          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Get in Touch</h2>
            <p className="text-center mb-4 text-gray-600">{contactData[0].attributes.FormInstructions}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
          >
            <h1 className="text-4xl font-bold mb-6">
              Or Contact Us Via
            </h1>
            <div className="max-w-2xl mx-auto">
            <motion.p
             
              className="text-2xl font-normal mx-auto mb-6"
              >
              <LocationOutline
              color={'#f0aef0'}
               height="30px"
              width="30px"
              />  <span>{contactData[0].attributes.Address}</span>
              </motion.p>
            
            <div className="flex flex-row justify-between items-center py-3">
            <motion.a
              href={`tel:${contactData[0].attributes.PhoneNumber}`}
              className="w-full mr-1 px-8 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 flex flex-row item-center justify-evenly"
              >
              {/* {contactData[0].attributes.PhoneNumber} */}
              
              <CallOutline
                  color={'#fffff'} 
                  title={'call'}
                  height="30px"
                  width="30px"
                />
               Call Us
              </motion.a>
              <motion.a
              href={`mailto:${contactData[0].attributes.Email}`}
              className="w-full px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 mx-auto flex flex-row item-center justify-evenly"
              >
                
                  <MailOutline
                    color={'#ffff'}
                    title={'mail'}
                    height="30px"
                    width="30px"
                  />
                   Mail
                
              </motion.a>

            </div>

             
            </div>
          </motion.div>

         </motion.div>


          {/* Map Section */}
          <motion.div
            className="mt-10"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              src={`https://www.google.com/maps?q=${contactData[0].attributes.MapCoordinates.lat},${contactData[0].attributes.MapCoordinates.lng}&z=15&output=embed`}
              width="100%"
              height="400"
              className="border-0 rounded-lg shadow-lg"
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </motion.div>


        </div>
      )}
    </>
  );
};

export default ContactPage;
