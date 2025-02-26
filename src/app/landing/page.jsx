"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../Navbar";
import feature1 from "./translate.png"; // update path as needed
import feature2 from "./verse.png"; // update path as needed
import feature3 from "./ui.png"; // update path as needed
import collaborationImage from "./collaboration.png"; // update path as needed

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 md:px-16 py-12 space-y-16">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Discover Kerygma
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-md">
              A minimalistic solution integrating real-time transcription with intelligent Bible verse detection.
            </p>
            <Link href="/transcription">
              <button className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
                Try Transcription
              </button>
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            <Image
              src={collaborationImage}
              alt="Kerygma Collaboration"
              width={400}
              height={400}
              className="max-w-md rounded-lg"
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800">Features</h2>
            <p className="text-md text-gray-500">
              Explore Kerygma's key functionalities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center p-4"
            >
              <Image
                src={feature1}
                alt="Real-Time Transcription"
                width={60}
                height={60}
                className="mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800">Real-Time Transcription</h3>
              <p className="text-gray-500 mt-2">Capture every spoken word as it happens.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center p-4"
            >
              <Image
                src={feature2}
                alt="Accurate Verse Matching"
                width={60}
                height={60}
                className="mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800">Accurate Verse Matching</h3>
              <p className="text-gray-500 mt-2">Detect Bible verses with precision.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center text-center p-4"
            >
              <Image
                src={feature3}
                alt="User-Friendly Interface"
                width={60}
                height={60}
                className="mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800">User-Friendly Interface</h3>
              <p className="text-gray-500 mt-2">Effortless control with an intuitive design.</p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-gray-800">Testimonials</h2>
                <p className="text-md text-gray-500">
                    Hear from our satisfied users.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md"
                >
                    <p className="text-gray-600 mb-4">
                        "Kerygma has revolutionized the way we transcribe and detect Bible verses during our sermons. It's incredibly accurate and user-friendly."
                    </p>
                    <h3 className="text-xl font-medium text-gray-800">- John Doe</h3>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md"
                >
                    <p className="text-gray-600 mb-4">
                        "The real-time transcription feature is a game-changer. It has made our services more engaging and accessible."
                    </p>
                    <h3 className="text-xl font-medium text-gray-800">- Jane Smith</h3>
                </motion.div>
            </div>
        </section>
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            Ready to Transform Your Sermons?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Join Kerygma and experience the ease of real-time Bible verse detection.
          </p>
          <Link href="/transcription">
            <button className="px-8 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
              Get Started
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Landing;
