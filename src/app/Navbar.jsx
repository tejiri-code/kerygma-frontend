"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "./logo.png"; // update path as needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className="bg-[#6A8D73] px-4 py-1 md:px-20 md:py-2 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-[#E4FFE1]">
          <Image src={logo} alt="Kerygma Logo" width={120} height={120} className="mr-2" />
         
            
          </Link>
        </div>
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-lg text-[#E4FFE1]">
          <li>
            <Link href="/" className="hover:text-[#FFE8C2]">
              Home
            </Link>
          </li>
          {/* <li>
            <Link href="/landing" className="hover:text-[#FFE8C2]">
              Landing
            </Link>
          </li> */}
          <li>
            <Link href="/transcription" className="hover:text-[#FFE8C2]">
              Transcription
            </Link>
          </li>
        </ul>
        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? (
              <svg
                className="w-8 h-8 text-[#E4FFE1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-[#E4FFE1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="mt-4 flex flex-col space-y-4 text-[#E4FFE1] md:hidden"
          >
            <li>
              <Link href="/" onClick={() => setIsOpen(false)} className="hover:underline">
                Home
              </Link>
            </li>
            {/* <li>
              <Link href="/landing" onClick={() => setIsOpen(false)} className="hover:underline">
                Landing
              </Link>
            </li> */}
            <li>
              <Link href="/transcription" onClick={() => setIsOpen(false)} className="hover:underline">
                Transcription
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
