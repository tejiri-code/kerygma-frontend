"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";

const Admin = () => {
  // Dummy logs for demonstration
  const [logs] = useState([
    "ASR started at 10:00 AM",
    "NLP detected verse: John 3:16",
    "Verse displayed on screen",
  ]);

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
          Admin Dashboard
        </motion.h2>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            System Logs
          </h3>
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li
                key={index}
                className="p-3 border border-gray-200 rounded bg-gray-50"
              >
                {log}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Settings
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Admin;
