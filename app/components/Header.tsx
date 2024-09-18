// "use client"
import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { openModal } from '../../store/slices/modalSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <>
    <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          {/* <img src="/logo.png" alt="Stars and Toques Logo" className="h-12 w-12" /> Adjust height and width as needed */}
          <img src="/logo.png" alt="Stars and Toques Logo" className="h-32 w-32" /> 

        </Link>

        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">STARS and TOQUES</h1>
          <h6 className="text-sm text-gray-600">Mostly Fine Dining Restaurant reviews</h6>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-4 flex-col items-end justify-evenly">
          <button onClick={() => dispatch(openModal())}>
            <span className="text-black hover:text-gray-600">SEARCH</span>
          </button>
          <Link href="/contact">
            <span className="text-black hover:text-gray-600">CONTACT</span>
          </Link>
          <Link href="/about">
            <span className="text-black hover:text-gray-600">ABOUT</span>
          </Link>
        </nav>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex items-center">
          <button className="text-black focus:outline-none">
            {/* Hamburger icon: you can replace it with any icon library like Heroicons */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

    </>
  );
};

export default Header;
