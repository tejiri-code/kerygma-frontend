"use client";
import { useState, useEffect,useRef } from 'react';
import Navbar from '../Navbar';
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

const BibleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// New Projection Component

const VerseProjection = ({ detectedVerses, versesContent, isProjecting, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Control handlers
  const nextVerse = () => {
    if (currentIndex < detectedVerses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const previousVerse = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextVerse();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        previousVerse();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, detectedVerses.length, onClose]);
  
  if (!isProjecting) return null;
  
  const currentVerse = detectedVerses[currentIndex];
  const currentContent = versesContent[currentVerse];
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center text-white p-8">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button 
          onClick={onClose}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
          aria-label="Close projection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-6 text-yellow-300">{currentVerse}</h1>
        <p className="text-3xl leading-relaxed font-medium">{currentContent}</p>
      </div>
      
      <div className="mt-12 flex items-center justify-center space-x-6">
        <button
          onClick={previousVerse}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full ${currentIndex === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          aria-label="Previous verse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-xl font-medium">
          {currentIndex + 1} / {detectedVerses.length}
        </div>
        
        <button
          onClick={nextVerse}
          disabled={currentIndex === detectedVerses.length - 1}
          className={`p-3 rounded-full ${currentIndex === detectedVerses.length - 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          aria-label="Next verse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// New ProjectionIcon component
const ProjectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 10v1a1 1 0 001 1h12a1 1 0 001-1v-1H3z" clipRule="evenodd" />
    <path d="M7 14v4h6v-4H7z" />
  </svg>
);

// Update the main Home component to include projection functionality
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
  const [activeTab, setActiveTab] = useState('voice'); // 'voice', 'upload', 'text'
  const [isProjecting, setIsProjecting] = useState(false); // New state for projection
  const [projectionWindow, setProjectionWindow] = useState(null); // New state for projection window
  
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Load available translations on component mount
  useEffect(() => {
    fetchTranslations();
  }, []);

  // Close projection window when component unmounts
  useEffect(() => {
    return () => {
      if (projectionWindow && !projectionWindow.closed) {
        projectionWindow.close();
      }
    };
  }, [projectionWindow]);

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
  // New function for projecting verses
  const startProjection = () => {
    // For single window display
    setIsProjecting(true);
    
    // Alternative: For separate window projection (uncomment to use)
    /*
    const width = 1024;
    const height = 768;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const newWindow = window.open(
      '', 
      'Bible Verse Projection',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (newWindow) {
      setProjectionWindow(newWindow);
      
      // Create a minimal HTML document for the projection
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bible Verse Projection</title>
            <style>
              body {
                background-color: black;
                color: white;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 40px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
              }
              h1 {
                color: #FFD700;
                font-size: 42px;
                margin-bottom: 30px;
              }
              p {
                font-size: 36px;
                line-height: 1.5;
                text-align: center;
                max-width: 80%;
              }
              .controls {
                position: fixed;
                bottom: 20px;
                display: flex;
                gap: 20px;
              }
              button {
                background-color: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
              }
              button:hover {
                background-color: rgba(255,255,255,0.3);
              }
            </style>
          </head>
          <body>
            <div id="content">
              <h1>${detectedVerses[0] || ''}</h1>
              <p>${versesContent[detectedVerses[0]] || ''}</p>
            </div>
            <div class="controls">
              <button id="prev">Previous</button>
              <span id="counter">1/${detectedVerses.length}</span>
              <button id="next">Next</button>
            </div>
            <script>
              let currentIndex = 0;
              const verses = ${JSON.stringify(detectedVerses)};
              const contents = ${JSON.stringify(versesContent)};
              
              document.getElementById('next').addEventListener('click', () => {
                if (currentIndex < verses.length - 1) {
                  currentIndex++;
                  updateDisplay();
                }
              });
              
              document.getElementById('prev').addEventListener('click', () => {
                if (currentIndex > 0) {
                  currentIndex--;
                  updateDisplay();
                }
              });
              
              function updateDisplay() {
                const h1 = document.querySelector('h1');
                const p = document.querySelector('p');
                const counter = document.getElementById('counter');
                
                h1.textContent = verses[currentIndex] || '';
                p.textContent = contents[verses[currentIndex]] || '';
                counter.textContent = \`\${currentIndex + 1}/\${verses.length}\`;
              }
              
              window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  document.getElementById('next').click();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  document.getElementById('prev').click();
                } else if (e.key === 'Escape') {
                  window.close();
                }
              });
            </script>
          </body>
        </html>
      `);
      
      newWindow.document.close();
      
      // Handle window close
      newWindow.addEventListener('beforeunload', () => {
        setProjectionWindow(null);
      });
    }
    */
  };

  const stopProjection = () => {
    setIsProjecting(false);
    
    if (projectionWindow && !projectionWindow.closed) {
      projectionWindow.close();
      setProjectionWindow(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e9f3ec] to-white">
      <Navbar />
      <Head>
        <title>Bible Verse Detector</title>
        <meta name="description" content="Detect Bible verses in real-time from speech or text" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VerseProjection 
        detectedVerses={detectedVerses}
        versesContent={versesContent}
        isProjecting={isProjecting}
        onClose={stopProjection}
      />

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Hero Section */}
        <div className="text-center py-10 px-4">
          <div className="inline-flex items-center justify-center p-3 bg-[#6A8D73] bg-opacity-20 rounded-full mb-3">
            <BibleIcon className="h-8 w-8 text-[#6A8D73]" />
          </div>
          <h1 className="text-4xl font-bold text-[#6A8D73] mb-2">Bible Verse Detector</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Instantly identify Bible verses from speech, audio files, or text
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
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

        <div className="bg-white shadow-md rounded-xl overflow-hidden p-1 mb-6">
          {/* Translation selector */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mr-3">
                Bible Translation:
              </label>
              <select
                id="translation"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6A8D73] focus:border-[#6A8D73] text-sm"
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
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${activeTab === 'voice' ? 'text-[#6A8D73] border-b-2 border-[#6A8D73]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('voice')}
            >
              <div className="flex items-center justify-center">
                <MicrophoneIcon className="h-4 w-4 mr-2" />
                Voice Detection
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${activeTab === 'upload' ? 'text-[#6A8D73] border-b-2 border-[#6A8D73]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('upload')}
            >
              <div className="flex items-center justify-center">
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload Audio
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${activeTab === 'text' ? 'text-[#6A8D73] border-b-2 border-[#6A8D73]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('text')}
            >
              <div className="flex items-center justify-center">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Text Analysis
              </div>
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'voice' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className={`relative w-32 h-32 flex items-center justify-center rounded-full mb-6 ${isRecording ? 'bg-red-100' : 'bg-[#dceadf]'}`}>
                  <button
                    className={`relative w-24 h-24 flex items-center justify-center rounded-full focus:outline-none ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#6A8D73] hover:bg-[#5a7c62] text-white'
                    }`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={status === 'connecting'}
                  >
                    {status === 'connecting' ? (
                      <LoadingSpinner />
                    ) : isRecording ? (
                      <StopIcon className="h-10 w-10" />
                    ) : (
                      <MicrophoneIcon className="h-10 w-10" />
                    )}
                  </button>
                  {isRecording && (
                    <div className="absolute -bottom-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-2 h-2 mr-1 bg-red-500 rounded-full animate-pulse"></span>
                        Recording
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {isRecording ? 'Speak clearly...' : 'Press to start recording'}
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  Speak naturally and the detector will automatically identify any Bible verses in your speech.
                </p>
              </div>
            )}
            
            {activeTab === 'upload' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center">
                  <UploadIcon className="h-12 w-12 text-[#6A8D73] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Audio File</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Supported formats: .wav, .mp3, .m4a, .ogg
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".wav,.mp3,.m4a,.ogg"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#dceadf] file:text-[#6A8D73] hover:file:bg-[#c9e0cf]"
                  />
                  <button
                    onClick={handleFileUpload}
                    disabled={!uploadedFile || isLoading}
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#6A8D73] hover:bg-[#5a7c62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A8D73] disabled:bg-[#add1b6] w-full justify-center"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="h-5 w-5 mr-2" />
                        Upload and Analyze
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'text' && (
              <div className="py-6">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Text Analysis</h3>
                  <form onSubmit={handleTextSubmit}>
                    <div className="mb-4">
                      <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#6A8D73] focus:border-[#6A8D73]"
                        placeholder="Type or paste text to analyze for Bible verses..."
                      ></textarea>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={!transcript.trim() || isLoading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#6A8D73] hover:bg-[#5a7c62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A8D73] disabled:bg-[#add1b6]"
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner className="mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Analyze Text
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
          <div className="bg-[#6A8D73] px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Detected Verses</h2>
            
            {/* Projection Button - only show when verses are detected */}
            {detectedVerses.length > 0 && (
              <button
                onClick={isProjecting ? stopProjection : startProjection}
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${
                  isProjecting 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-white text-[#6A8D73] hover:bg-gray-100'
                }`}
              >
                {isProjecting ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Stop Projecting
                  </>
                ) : (
                  <>
                    <ProjectionIcon className="h-4 w-4 mr-1" />
                    Project Verses
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="p-6">
            {transcript && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Transcript</h3>
                <div className="p-4 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                  {transcript}
                </div>
              </div>
            )}
            
            {detectedVerses.length > 0 ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-[#6A8D73] bg-opacity-20 rounded-full p-1 mr-2">
                    <BibleIcon className="h-5 w-5 text-[#6A8D73]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">
                    {detectedVerses.length} {detectedVerses.length === 1 ? 'Verse' : 'Verses'} Detected
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {detectedVerses.map((verse) => (
                    <div key={verse} className="bg-[#f3f8f5] rounded-lg p-4 border-l-4 border-[#6A8D73]">
                      <p className="font-semibold text-[#6A8D73] text-lg mb-2">{verse}</p>
                      <p className="text-gray-700">{versesContent[verse]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : transcript ? (
              <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Bible Verses Detected</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try speaking or typing content that includes Bible verses or references.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center p-3 bg-[#6A8D73] bg-opacity-10 rounded-full mb-4">
                  <BibleIcon className="h-8 w-8 text-[#6A8D73]" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Ready to Detect Bible Verses</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Use one of the input methods above to begin detecting Bible verses in your content.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Bible Verse Detector | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}