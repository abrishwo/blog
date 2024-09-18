"use client"
import React, { useEffect, useState } from 'react';
import { fetchContactUs } from '../../utils/api';
import { Contact } from '../../types'
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [contactData, setContactData] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchContactUs();
      setContactData(data.data);
    };
    fetchData();
  }, []);

  if (!contactData[0]) return <p>Loading...</p>;

  return (
    <>
    {contactData[0] && (<div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-6">{contactData[0].attributes.Title}</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg leading-8 mb-4">{contactData[0].attributes.Address}</p>
          <p className="text-lg leading-8 mb-4">Phone: {contactData[0].attributes.PhoneNumber}</p>
          <p className="text-lg leading-8 mb-4">Email: {contactData[0].attributes.Email}</p>
        </div>
      </motion.div>
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
    </div>)}

    </>
  );
};

export default ContactPage;
