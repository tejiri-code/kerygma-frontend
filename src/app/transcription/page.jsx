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
  const [verseContext, setVerseContext] = useState({}); // New state for context verses
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

  const VerseProjection = ({ detectedVerses, versesContent, verseContext, isProjecting, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [theme, setTheme] = useState('default');
    const [fontSize, setFontSize] = useState('medium');
    const [showControls, setShowControls] = useState(true);
    const [showContext, setShowContext] = useState(false); // Toggle for showing context
    
    // Add this function to handle direct verse navigation
    const goToVerse = (index) => {
      if (index >= 0 && index < detectedVerses.length) {
        setCurrentIndex(index);
        setShowContext(false); // Reset context view when changing verses
      }
    };
  
    // Control handlers - updated to handle context properly
    const nextVerse = () => {
      // If showing context, first return to current verse
      if (showContext) {
        setShowContext(false);
      } 
      // Otherwise move to next main verse if available
      else if (currentIndex < detectedVerses.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };
    
    const previousVerse = () => {
      // If showing context, first return to current verse
      if (showContext) {
        setShowContext(false);
      } 
      // Otherwise move to previous main verse if available
      else if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };
    
    
    // Modified context navigation functions
    const showNextVerse = () => {
      const currentVerse = detectedVerses[currentIndex];
      
      // Check if next verse exists in context and fetch if needed
      if (!verseContext[currentVerse]?.next) {
        fetchVerseContext(currentVerse, 'next');
      }
      
      setShowContext('next');
    };
    
    const showPreviousVerse = () => {
      const currentVerse = detectedVerses[currentIndex];
      
      // Check if previous verse exists in context and fetch if needed
      if (!verseContext[currentVerse]?.previous) {
        fetchVerseContext(currentVerse, 'previous');
      }
      
      setShowContext('previous');
    };
    
    const fetchVerseContext = async (verseRef, direction) => {
      try {
        const response = await fetch('http://localhost:5005/api/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: verseRef, // Just send the verse reference
            translation: 'kjv', // You might want to pass the current translation as a prop
            include_context: true,
            context_size: 1,
            context_direction: direction // Specify which context to fetch
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching context: ${response.statusText}`);
        }
        
        console.log('Context fetched:', verseRef, direction);
        const data = await response.json();
        
        // Update context state with new data
        if (data.context_verses && data.context_verses[verseRef]) {
          setVerseContext(prev => ({
            ...prev,
            [verseRef]: {
              ...prev[verseRef],
              ...data.context_verses[verseRef]
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching verse context:', err);
      }
    };
    
    const resetContextView = () => {
      setShowContext(false);
    };
   
    
    // Setup keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          nextVerse();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          previousVerse();
        } else if (e.key === 'ArrowDown') {
          showNextVerse();
        } else if (e.key === 'ArrowUp') {
          showPreviousVerse();
        } else if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'h') {
          // Toggle controls visibility
          setShowControls(prev => !prev);
        } else if (e.key === 'c') {
          // Reset to current verse
          resetContextView();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, detectedVerses.length, onClose, showContext]);
    
    if (!isProjecting) return null;
    
    const currentVerse = detectedVerses[currentIndex];
    
    // Determine which verse to display based on context state
    let displayedVerse = currentVerse;
    let displayedContent = versesContent[currentVerse];
    
    if (showContext && verseContext[currentVerse]) {
      if (showContext === 'previous' && verseContext[currentVerse].previous) {
        displayedVerse = verseContext[currentVerse].previous.reference;
        displayedContent = verseContext[currentVerse].previous.text;
      } else if (showContext === 'next' && verseContext[currentVerse].next) {
        displayedVerse = verseContext[currentVerse].next.reference;
        displayedContent = verseContext[currentVerse].next.text;
      }
    }
    
    // Theme styles
    const themeStyles = {
      default: {
        bg: "bg-black",
        heading: "text-yellow-300",
        text: "text-white",
        controlsBg: "bg-gray-800"
      },
      dark: {
        bg: "bg-gray-900",
        heading: "text-blue-300",
        text: "text-gray-100",
        controlsBg: "bg-gray-800"
      },
      light: {
        bg: "bg-white",
        heading: "text-indigo-600",
        text: "text-gray-800",
        controlsBg: "bg-gray-100"
      },
      gradient: {
        bg: "bg-gradient-to-b from-indigo-900 to-black",
        heading: "text-yellow-200",
        text: "text-white",
        controlsBg: "bg-indigo-800 bg-opacity-50"
      },
      worship: {
        bg: "bg-gradient-to-b from-blue-900 to-black",
        heading: "text-amber-300",
        text: "text-white",
        controlsBg: "bg-gray-800 bg-opacity-70"
      }
    };
    
    // Font size classes
    const fontSizes = {
      small: "text-2xl",
      medium: "text-3xl",
      large: "text-4xl",
      xlarge: "text-5xl"
    };
    
    const currentTheme = themeStyles[theme];
    
    return (
      <div className={`fixed inset-0  ${currentTheme.bg} z-50 flex justify-center items-center`}>
        {/* Main content */}
        <div className="flex-1 h-fit flex flex-col">
          {/* Presentation area */}
          <div className="flex-1 flex flex-col justify-center items-center px-8 py-16 text-center">
            <h1 className={`${fontSizes.medium} font-bold mb-8 ${currentTheme.heading}`}>
              {displayedVerse}
              {showContext && <span className="ml-2 text-sm opacity-70">
                {showContext === 'previous' ? '(Previous Verse)' : '(Next Verse)'}
              </span>}
            </h1>
            <p className={`${fontSizes[fontSize]} leading-relaxed font-medium max-w-4xl ${currentTheme.text}`}>
              {displayedContent}
            </p>
            
            {/* Context navigation indicators */}
            <div className="flex justify-between w-full max-w-4xl mt-16">
              {verseContext[currentVerse]?.previous && (
             <button 
             onClick={showPreviousVerse}
             className={`${showContext === 'previous' ? 'text-blue-400' : 'text-gray-500'} flex items-center`}
             aria-label="Show previous verse"
             aria-pressed={showContext === 'previous'}
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
               <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
             </svg>
             Previous Verse
           </button>
              )}
              
              {showContext && (
                <button 
                  onClick={resetContextView}
                  className="text-yellow-400 flex items-center"
                >
                  Return to {currentVerse}
                </button>
              )}
              
              {verseContext[currentVerse]?.next && (
                <button 
                  onClick={showNextVerse}
                  className={`${showContext === 'next' ? 'text-blue-400' : 'text-gray-500'} flex items-center ml-auto`}
                >
                  Next Verse
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Page indicator */}
            <div className={`absolute bottom-8 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <div className="text-xl font-medium text-gray-400">
                {currentIndex + 1} / {detectedVerses.length}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar with verse list - visible only when controls are shown */}
        <div 
          className={`w-80 border-l border-gray-700 h-fit ${currentTheme.controlsBg} 
            ${showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
            transition-all duration-300`}
        >
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Verses</h3>
            <button 
              onClick={onClose}
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              aria-label="Close projection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Verse list */}
          <div className="overflow-y-auto h-[calc(100%-13rem)]">
            {detectedVerses.map((verse, index) => (
              <div 
                key={verse} 
                onClick={() => goToVerse(index)}
                className={`p-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                  index === currentIndex ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                }`}
              >
                <p className="text-sm font-medium text-white">{verse}</p>
                <p className="text-xs text-gray-400 truncate">{versesContent[verse]?.substring(0, 50)}...</p>
              </div>
            ))}
          </div>
          
          {/* Controls */}
          <div className="p-4 border-t border-gray-700">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Theme</label>
              <div className="grid grid-cols-5 gap-2">
                {Object.keys(themeStyles).map(themeName => (
                  <button
                    key={themeName}
                    onClick={() => setTheme(themeName)}
                    className={`w-full h-8 rounded ${
                      theme === themeName ? 'ring-2 ring-blue-500' : ''
                    } ${themeStyles[themeName].bg}`}
                    aria-label={`${themeName} theme`}
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Font Size</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(fontSizes).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2 py-1 text-xs rounded ${
                      fontSize === size ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between gap-2 mt-4">
            <button
                onClick={previousVerse}
                disabled={currentIndex === 0}
                className={`flex-1 p-2 rounded ${currentIndex === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Previous
              </button>
              <button
                onClick={nextVerse}
                disabled={currentIndex === detectedVerses.length - 1}
                className={`flex-1 p-2 rounded ${currentIndex === detectedVerses.length - 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Next
              </button>
            </div>
            
            <div className="mt-3 text-xs text-center text-gray-500">
              Press H to hide/show controls • ESC to close • ←/→ to navigate
            </div>
          </div>
        </div>
        
      </div>
    );
  };
  
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
        translation: selectedTranslation,
        include_context: true,
        context_size: 2  // Increased to get more context verses
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    setDetectedVerses(data.detected_verses || []);
    setVersesContent(data.verses_content || {});
    
    // Store context verses if available
    if (data.context_verses) {
      setVerseContext(data.context_verses);
    }
  } catch (err) {
    console.error('Error submitting text:', err);
    setError(`Failed to analyze text: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
};


  // Add this function to the Home component


  const handleTranscriptInput = async (inputText) => {
    if (!inputText.trim()) return;
    
    setTranscript(inputText);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5005/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: inputText,
          translation: selectedTranslation,
          include_context: true,
          context_size: 1  // Get 1 verse before and after each detected verse
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDetectedVerses(data.detected_verses || []);
      setVersesContent(data.verses_content || {});
      
      // Store context verses if available
      if (data.context_verses) {
        setVerseContext(data.context_verses);
      }
      
      setActiveTab('text'); // Switch to text tab to show results
      
      // Auto start projection if there are verses
      if (data.detected_verses?.length > 0) {
        setIsProjecting(true);
      }
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
 // Replace the existing startProjection function with this enhanced version

const startProjection = () => {
  // Check if there's a second screen available
  const hasExternalDisplay = window.screen.width < window.screen.availWidth;
  
  // For in-app projection (default)
  setIsProjecting(true);
  
  // For external window projection
  if (false) { // Change to true or add a UI toggle to enable this feature
    const width = hasExternalDisplay ? window.screen.availWidth - window.screen.width : 1024;
    const height = hasExternalDisplay ? window.screen.availHeight : 768;
    const left = hasExternalDisplay ? window.screen.width : window.screen.width / 2 - width / 2;
    const top = hasExternalDisplay ? 0 : window.screen.height / 2 - height / 2;
    
    const newWindow = window.open(
      '', 
      'Bible Verse Projection',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,scrollbars=no,status=no,fullscreen=yes`
    );
    
    if (newWindow) {
      setProjectionWindow(newWindow);
      
      // Create a minimal HTML document for the projection
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bible Verse Projection</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                height: 100vh;
                width: 100vw;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: black;
                color: white;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .container {
                max-width: 90%;
                text-align: center;
              }
              .verse-reference {
                color: #FBBF24;
                font-size: 2.5rem;
                margin-bottom: 1.5rem;
                font-weight: bold;
              }
              .verse-content {
                font-size: 3rem;
                line-height: 1.4;
                font-weight: 500;
              }
              .controls {
                position: fixed;
                bottom: 20px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                gap: 20px;
                opacity: 0.3;
                transition: opacity 0.3s;
              }
              .controls:hover {
                opacity: 1;
              }
              .nav-button {
                background-color: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
              }
              .nav-button:hover {
                background-color: rgba(255,255,255,0.3);
              }
              .nav-button:disabled {
                background-color: rgba(100,100,100,0.2);
                cursor: not-allowed;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div id="verse-reference" class="verse-reference"></div>
              <div id="verse-content" class="verse-content"></div>
            </div>
            <div class="controls">
              <button id="prev" class="nav-button">Previous</button>
              <span id="counter" class="text-white px-4 py-2"></span>
              <button id="next" class="nav-button">Next</button>
            </div>
            <script>
              let currentIndex = 0;
              const verses = ${JSON.stringify(detectedVerses)};
              const contents = ${JSON.stringify(versesContent)};
              
              function updateDisplay() {
                document.getElementById('verse-reference').textContent = verses[currentIndex] || '';
                document.getElementById('verse-content').textContent = contents[verses[currentIndex]] || '';
                document.getElementById('counter').textContent = \`\${currentIndex + 1}/\${verses.length}\`;
                
                // Update button states
                document.getElementById('prev').disabled = currentIndex === 0;
                document.getElementById('next').disabled = currentIndex === verses.length - 1;
              }
              
              document.getElementById('prev').addEventListener('click', () => {
                if (currentIndex > 0) {
                  currentIndex--;
                  updateDisplay();
                }
              });
              
              document.getElementById('next').addEventListener('click', () => {
                if (currentIndex < verses.length - 1) {
                  currentIndex++;
                  updateDisplay();
                }
              });
              
              window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
                  if (currentIndex < verses.length - 1) {
                    currentIndex++;
                    updateDisplay();
                  }
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
                  if (currentIndex > 0) {
                    currentIndex--;
                    updateDisplay();
                  }
                } else if (e.key === 'Escape') {
                  window.close();
                } else if (e.key === 'Home') {
                  currentIndex = 0;
                  updateDisplay();
                } else if (e.key === 'End') {
                  currentIndex = verses.length - 1;
                  updateDisplay();
                }
              });
              
              // Auto-hide controls after 3 seconds
              let timeout;
              function hideControls() {
                document.querySelector('.controls').style.opacity = '0';
              }
              
              document.body.addEventListener('mousemove', () => {
                document.querySelector('.controls').style.opacity = '1';
                clearTimeout(timeout);
                timeout = setTimeout(hideControls, 3000);
              });
              
              // Initialize
              updateDisplay();
              timeout = setTimeout(hideControls, 3000);
            </script>
          </body>
        </html>
      `);
      
      newWindow.document.close();
      
      // Handle window close
      newWindow.addEventListener('beforeunload', () => {
        setProjectionWindow(null);
        setIsProjecting(false);
      });
    }
  }
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
      verseContext={verseContext}
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

<div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
  <div className="bg-[#6A8D73] px-6 py-4">
    <h2 className="text-xl font-semibold text-white">Quick Input</h2>
  </div>
  <div className="p-4">
    <form onSubmit={(e) => {
      e.preventDefault();
      const input = e.target.quickInput.value;
      if (input) {
        handleTranscriptInput(input);
        e.target.quickInput.value = '';
      }
    }}>
      <div className="flex">
        <input
          name="quickInput"
          type="text"
          placeholder="Type verse reference or quote (e.g., 'Genesis 1:1' or 'In the beginning...')"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-[#6A8D73] focus:border-[#6A8D73]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#6A8D73] text-white rounded-r-md hover:bg-[#6A8D73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A8D73]"
        >
          Detect
        </button>
      </div>
    </form>
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