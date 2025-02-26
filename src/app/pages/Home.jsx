"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import heroImage from "../../../public/next.svg"; // update path as needed
import Navbar from "../Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#E9FBB1]">
      <Navbar />
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#6A8D73] mb-4">
            Welcome to Kerygma
          </h1>
          <p className="text-xl text-[#F0A868] mb-6">
            Experience real-time Bible verse detection to elevate every sermon.
          </p>
          <Link href="/landing">
            <button className="bg-[#FFE8C2] hover:bg-[#F0A868] text-[#6A8D73] font-semibold py-3 px-8 rounded-full transition duration-300">
              Learn More
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 mt-8 md:mt-0"
        >
          <Image
            src={heroImage}
            alt="Kerygma Hero"
            width={500}
            height={500}
            className="w-full max-w-md mx-auto drop-shadow-lg"
          />
        </motion.div>
      </header>
      {/* Info Section */}
      <section className="px-6 md:px-20 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-[#6A8D73] mb-4">
            Real-Time Verse Detection
          </h2>
          <p className="text-lg text-[#F0A868] max-w-3xl mx-auto">
            Kerygma leverages advanced AI to capture every spoken word, ensuring your sermons shine with clarity and precision.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;