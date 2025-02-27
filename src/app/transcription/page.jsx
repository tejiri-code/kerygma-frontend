"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { motion } from "framer-motion";
import axios from "axios";

const AutoRecorder = () => {
  const [transcript, setTranscript] = useState("");
  const [editedTranscript, setEditedTranscript] = useState("");
  const [detectedVerses, setDetectedVerses] = useState([]);
  const [versesContent, setVersesContent] = useState({});
  const [error, setError] = useState("");
  const [ws, setWs] = useState(null);
  const [translation, setTranslation] = useState("kjv");
  const [updating, setUpdating] = useState(false);

  // Establish WebSocket connection for real-time transcription updates.
  useEffect(() => {
    const socket = new WebSocket("wss://kerygma-backend-1.onrender.com/ws/transcribe");
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        setTranscript(data.transcript);
        // Also update the editable transcript so you can modify it
        setEditedTranscript(data.transcript);
        setDetectedVerses(data.detected_verses);
        setVersesContent(data.verses_content);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };
    socket.onerror = (err) => {
      console.error("WebSocket error", err);
      setError("WebSocket error");
    };
    socket.onclose = () => {
      console.log("WebSocket closed");
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  // Automatically record and stream audio chunks.
  useEffect(() => {
    if (!ws) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            event.data.arrayBuffer().then((buffer) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(buffer);
              }
            });
          }
        };
        recorder.onerror = (e) => {
          console.error("MediaRecorder error:", e.error);
          setError("Recording error: " + e.error.message);
        };
        recorder.start(250); // send audio chunks every 250ms
        console.log("Automatic recording started.");
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setError("Microphone access denied.");
      });
  }, [ws]);

  // Debounce the update of detected verses when transcript or translation changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      updateVerses();
    }, 1000); // update 1 second after changes stop
    return () => clearTimeout(timer);
  }, [editedTranscript, translation]);

  // Function to update detected verses from the edited transcript and selected translation.
  const updateVerses = async () => {
    try {
      setUpdating(true);
      console.log("Updating verses for transcript:", editedTranscript, "with translation:", translation);
      const response = await axios.post("https://kerygma-backend-1.onrender.com/api/detect", {
        transcript: editedTranscript,
        translation: translation,
      });
      console.log("Update verses response:", response.data);
      setDetectedVerses(response.data.detected_verses);
      setVersesContent(response.data.verses_content);
      // Optionally update transcript state if the backend modifies it.
      setTranscript(response.data.transcript);
      setUpdating(false);
    } catch (err) {
      console.error("Error updating verses:", err);
      setError("Error updating verses.");
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 text-center mb-8"
        >
          Real-Time Bible Verse Detection
        </motion.h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Transcript:</h3>
          <textarea
            value={editedTranscript}
            onChange={(e) => {
              console.log("Edited transcript:", e.target.value);
              setEditedTranscript(e.target.value);
            }}
            className="w-full p-3 border border-gray-300 rounded text-lg text-gray-700"
            rows={4}
          />
        </div>
        <div className="mt-4 flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <label className="block text-gray-800 font-medium">
            Bible Translation:
          </label>
          <select
            value={translation}
            onChange={(e) => {
              console.log("Selected translation:", e.target.value);
              setTranslation(e.target.value);
            }}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="kjv">King James Version (KJV)</option>
            <option value="web">World English Bible (WEB)</option>
            <option value="asv">American Standard Version (ASV)</option>
          </select>
        </div>
        <div className="mt-4">
          <button
            onClick={updateVerses}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            Update Verses
          </button>
        </div>
        {updating && (
          <div className="mt-4 text-center">
            <p className="text-lg text-red-600">Processing verses...</p>
          </div>
        )}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Detected Bible Verses:</h3>
          {detectedVerses.length > 0 ? (
            <ul className="list-disc ml-6">
              {detectedVerses.map((verse, index) => (
                <li key={index} className="text-lg text-gray-600">
                  <div>{verse}</div>
                  {versesContent[verse] && (
                    <div className="text-sm text-gray-500">{versesContent[verse]}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-600">No verses detected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoRecorder;
