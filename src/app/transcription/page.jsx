"use client";
import Navbar from "../Navbar"; 
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedVerses, setDetectedVerses] = useState([]);
  const [versesContent, setVersesContent] = useState({});
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState('kjv');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [status, setStatus] = useState('idle');
  
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Load available translations on component mount
  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/translations');
      const data = await response.json();
      
      // Combine and deduplicate translations
      const allTranslations = [...new Set([
        ...data.local_translations,
        ...data.api_translations.map(code => data.translation_map[code])
      ])];
      
      setTranslations(allTranslations);
      
      // If the API has a default translation, use it
      if (data.default_translation) {
        setSelectedTranslation(data.default_translation in data.translation_map ? 
          Object.keys(data.translation_map).find(key => data.translation_map[key] === data.default_translation) : 
          'kjv'
        );
      }
    } catch (err) {
      console.error('Error fetching translations:', err);
      setError('Failed to load Bible translations. Using King James Version by default.');
      setTranslations(['King James Bible']);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setStatus('connecting');
      
      // Reset the state
      setTranscript('');
      setDetectedVerses([]);
      setVersesContent({});
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up WebSocket connection
      const socket = new WebSocket(
        `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//localhost:5005/ws/transcribe`
      );
      
      socket.onopen = () => {
        setStatus('recording');
        setIsRecording(true);
        
        // Set up MediaRecorder with appropriate settings
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
          audioBitsPerSecond: 16000
        });
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };
        
        recorder.start(500); // Send chunks every 500ms
        mediaRecorderRef.current = recorder;
        socketRef.current = socket;
      };
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.error) {
          setError(data.error);
          stopRecording();
          return;
        }
        
        setTranscript(data.transcript);
        setDetectedVerses(data.detected_verses || []);
        setVersesContent(data.verses_content || {});
      };
      
      socket.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error. Please try again.');
        stopRecording();
      };
      
      socket.onclose = () => {
        if (isRecording) {
          stopRecording();
        }
      };
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(`Microphone access error: ${err.message}`);
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    // Stop the media recorder if it exists
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    // Close the WebSocket connection
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    setIsRecording(false);
    setStatus('idle');
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5005/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          translation: selectedTranslation
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDetectedVerses(data.detected_verses || []);
      setVersesContent(data.verses_content || {});
    } catch (err) {
      console.error('Error submitting text:', err);
      setError(`Failed to analyze text: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) return;
    
    setIsLoading(true);
    setError(null);
    
    // Reset previous results
    setTranscript('');
    setDetectedVerses([]);
    setVersesContent({});
    
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('translation', selectedTranslation);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTranscript(data.transcript);
      setDetectedVerses(data.detected_verses || []);
      setVersesContent(data.verses_content || {});
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Failed to process audio file: ${err.message}`);
    } finally {
      setIsLoading(false);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Head>
        <title>Bible Verse Detector</title>
        <meta name="description" content="Detect Bible verses in real-time from speech or text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-center text-[#6A8D73] mb-2">Bible Verse Detector</h1>
        <p className="text-center text-gray-600 mb-6">
          Speak, upload, or enter text to detect Bible verses
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 012 0v6a1 1 0 01-2 0V5zm0 9a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Methods</h2>
              
              {/* Translation selector */}
              <div className="mb-4">
                <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mb-1">
                  Bible Translation
                </label>
                <select
                  id="translation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6A8D73] focus:border-[#6A8D73]"
                  value={selectedTranslation}
                  onChange={(e) => setSelectedTranslation(e.target.value)}
                >
                  {translations.map((translation) => (
                    <option key={translation} value={translation}>
                      {translation}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Recording controls */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Voice Detection</h3>
                <div className="flex items-center justify-center">
                  <button
                    className={`relative inline-flex items-center justify-center px-6 py-3 rounded-full ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#6A8D73] hover:bg-[#6A8D73] text-white'
                    } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A8D73]`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={status === 'connecting'}
                  >
                    {status === 'connecting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : isRecording ? (
                      <>
                        <StopIcon className="h-5 w-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <MicrophoneIcon className="h-5 w-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </button>
                </div>
                {isRecording && (
                  <div className="flex justify-center mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <span className="w-2 h-2 mr-1 bg-red-500 rounded-full animate-pulse"></span>
                      Recording
                    </span>
                  </div>
                )}
              </div>
              
              {/* File upload */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Audio</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".wav,.mp3,.m4a,.ogg"
                    className="flex-grow text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#dceadf] file:text-[#6A8D73] hover:file:bg-indigo-100"
                  />
                  <button
                    onClick={handleFileUpload}
                    disabled={!uploadedFile || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6A8D73] hover:bg-[#6A8D73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A8D73] disabled:bg-[#add1b6]"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: .wav, .mp3, .m4a, .ogg
                </p>
              </div>
              
              {/* Text input */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Text Analysis</h3>
                <form onSubmit={handleTextSubmit}>
                  <div className="mb-2">
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6A8D73] focus:border-[#6A8D73]"
                      placeholder="Type or paste text to analyze for Bible verses..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={!transcript.trim() || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6A8D73] hover:bg-[#6A8D73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A8D73] disabled:bg-[#add1b6]"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Analyze Text
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detected Verses</h2>
              
              {transcript && (
                <div className="mb-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Transcript</h3>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-700">
                    {transcript}
                  </div>
                </div>
              )}
              
              {detectedVerses.length > 0 ? (
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">
                    {detectedVerses.length} {detectedVerses.length === 1 ? 'Verse' : 'Verses'} Detected
                  </h3>
                  <div className="space-y-4">
                    {detectedVerses.map((verse) => (
                      <div key={verse} className="border-l-4 border-[#6A8D73] pl-4 py-1">
                        <p className="font-semibold text-gray-800">{verse}</p>
                        <p className="text-gray-600 mt-1">{versesContent[verse]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : transcript ? (
                <div className="text-center py-6 text-gray-500">
                  <p>No Bible verses detected</p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Speak, upload audio, or enter text to detect Bible verses</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto p-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Bible Verse Detector</p>
      </footer>
    </div>
  );
}