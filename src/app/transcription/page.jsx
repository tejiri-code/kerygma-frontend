"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../Navbar";

const Transcription = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  const handleTranscription = async () => {
    if (!audioUrl) {
      setError("Please enter a valid audio URL.");
      return;
    }
    setError("");
    setLoading(true);
    setTranscription("");
    try {
      const response = await axios.post("http://localhost:8000/transcribe/", {
        audio_url: audioUrl,
      });
      setTranscription(response.data.transcription);
    } catch (err) {
      setError("Error transcribing audio. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          Transcription Service
        </motion.h2>
        <div className="flex flex-col items-center space-y-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter audio URL..."
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={handleTranscription}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300"
          >
            {loading ? "Transcribing..." : "Transcribe Audio"}
          </button>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-500"
            >
              {error}
            </motion.p>
          )}
          {transcription && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-6 border border-gray-200 rounded bg-gray-50 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Transcription Result:
              </h3>
              <p className="text-lg text-gray-600">{transcription}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcription;
