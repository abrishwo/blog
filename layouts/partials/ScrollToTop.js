import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { ArrowUpIcon } from "@heroicons/react/solid";
import { IoIosArrowRoundUp } from "react-icons/io";
export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-all duration-300 hover:scale-110`}
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.2 }}
    >
       <IoIosArrowRoundUp className="h-10 w-8" />
       
    </motion.button>
  );
}
