"use client";

import React from 'react';
import { motion } from 'framer-motion';

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 10, delay: 0.2 } },
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="bg-zinc-50 text-zinc-950 py-6 mt-16 flex flex-col items-center"
      initial="hidden"
      animate="visible"
      variants={footerVariants}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo or Title */}
        <motion.div
          className="text-lg font-bold text-zinc-950 mb-4 md:mb-0"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          MyWebsite
        </motion.div>

        {/* Footer Links */}
        <motion.ul className="flex space-x-4 mb-4 md:mb-0">
          <motion.li whileHover={{ scale: 1.1 }}>
            <a href="#" className="hover:text-white transition-colors">
              Home
            </a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <a href="#" className="hover:text-white transition-colors">
              About
            </a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <a href="#" className="hover:text-white transition-colors">
              Services
            </a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </motion.li>
        </motion.ul>


      </div>
        <hr className='text-zinc-800 w-full bg-zinc-800 mt-10 mb-6'/>
              {/* Copyright */}
     <motion.p
          className="text-sm text-gray-800"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          &copy; {currentYear} Fine Dining. All Rights Reserved.
        </motion.p>
    </motion.footer>
  );
};

export default Footer;
