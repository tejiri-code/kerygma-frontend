"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";

const Display = () => {
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    const dummyVerses = [
      "John 3:16 - For God so loved the world...",
      "Psalm 23:1 - The Lord is my shepherd...",
    ];
    setVerses(dummyVerses);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          Live Bible Verse Display
        </motion.h2>
        <div className="space-y-6">
          {verses.map((verse, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              className="p-6 border border-gray-200 rounded bg-gray-50 shadow-sm"
            >
              <p className="text-xl text-gray-700">{verse}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Display;
