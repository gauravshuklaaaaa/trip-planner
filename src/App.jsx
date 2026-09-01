import { useState, useEffect, useRef } from 'react';
import { Printer, Download } from 'lucide-react';
import { 
  generateId, 
  DEFAULT_TOKYO_ITINERARY, 
  sanitizeItinerary 
} from './utils';

// Import child components
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import PromptForm from './components/PromptForm';
import LoadingBox from './components/LoadingBox';
import ErrorBox from './components/ErrorBox';
import EmptyState from './components/EmptyState';
import DaysSidebar from './components/DaysSidebar';
import DayContentPanel from './components/DayContentPanel';
import Footer from './components/Footer';

// Pack-and-go travel tips shown while waiting for model responses
const LOADING_TIPS = [
  "Packing tip: Roll your clothes instead of folding them. It saves space and reduces wrinkles!",
  "Local secret: Search for dining spots 1-2 blocks away from main tourist sights for more authentic and cheaper eats.",
  "Travel hack: Take a photo of your passport and email it to yourself. It's a lifesaver if your copy gets lost.",
  "Budget tip: Look up free walking tours on your first day to get oriented and find local recommendations.",
  "Transit hint: Download offline Google Maps of the city before you arrive to navigate without cellular data."
];

// Quick suggestion prompts
const SUGGESTIONS = [
  { label: "🌸 3 Days in Tokyo", text: "A 3-day trip to Tokyo focusing on anime culture, historic temples, and delicious street food on a moderate budget." },
  { label: "🏰 5 Days in Paris", text: "A 5-day romantic getaway in Paris covering the classic sights, art museums, cozy bakeries, and a day trip to Versailles." },
  { label: "🥾 4 Days in Iceland", text: "A 4-day active nature road trip in Iceland along the Golden Circle, focusing on waterfalls, black sand beaches, and hot springs." }
];

function App() {
  // Application states hoisted to App.jsx
  const [prompt, setPrompt] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Trip history states
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('trip_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentTripId, setCurrentTripId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stale request counter tracking
  const requestIdRef = useRef(0);

  // Sync theme configurations
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle travel tips rotation interval during loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Helper to save current trip states to localStorage and state history
  const saveToHistory = (id, promptText, itineraryData, dayIdx) => {
    if (!id || !itineraryData) return;
    setHistory(prev => {
      const existingIdx = prev.findIndex(item => item.id === id);
      let updated;
      if (existingIdx !== -1) {
        // Update existing trip in history and move to the top
        const updatedItem = {
          ...prev[existingIdx],
          prompt: promptText,
          itinerary: itineraryData,
          activeDayIndex: dayIdx,
          updatedAt: new Date().toISOString()
        };
        updated = [
          updatedItem,
          ...prev.filter((_, idx) => idx !== existingIdx)
        ];
      } else {
        // Add new trip to history
        const newItem = {
          id,
          prompt: promptText,
          itinerary: itineraryData,
          activeDayIndex: dayIdx,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updated = [newItem, ...prev];
      }
      localStorage.setItem('trip_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Submit prompts to the Express backend proxy
  const generateItinerary = async (promptText) => {
    if (!promptText || promptText.trim() === '') return;

    setLoading(true);
    setError(null);
    setActiveDayIndex(0);
    
    // Capture the active trip ID at the time of submission to update in-place if editing
    const activeTripIdAtSubmit = currentTripId;

    // Assign unique sequence tracker to ignore stale in-flight responses
    const currentRequestId = ++requestIdRef.current;

    // Set up AbortController for a 45-second timeout (handles "slow" models/requests)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 45000);

    try {
      const requestBody = { prompt: promptText };
      if (activeTripIdAtSubmit && itinerary) {
        requestBody.existingItinerary = itinerary;
      }

      const API_URL = 'https://atul-trip-planner-backend.onrender.com';

      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if a newer submit event occurred while this was fetching
      if (currentRequestId !== requestIdRef.current) {
        console.warn("Discarded stale response for request ID:", currentRequestId);
        return;
      }

      // Safe content-type check to prevent "Unexpected end of JSON input" on proxy errors/HTML pages
      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          throw {
            error: 'Server Error',
            message: 'Received empty or malformed JSON from the backend server.'
          };
        }
      } else {
        const responseText = await response.text().catch(() => '');
        throw {
          error: 'Connection Failed',
          message: responseText.includes('Gateway') || responseText.includes('Proxy') || !responseText
            ? 'Could not connect to the backend server. Please verify that the backend is running (run npm start).'
            : responseText.slice(0, 200)
        };
      }

      if (!response.ok) {
        throw {
          error: data?.error || 'Server Error',
          message: data?.message || 'An error occurred while fetching the itinerary.'
        };
      }

      // Sanitize structures against missing keys or malformations
      const validatedItinerary = sanitizeItinerary(data.itinerary);
      setItinerary(validatedItinerary);

      // Reuse existing active trip ID to update in-place, or generate a new one if starting fresh
      const tripIdToUse = activeTripIdAtSubmit || generateId();
      setCurrentTripId(tripIdToUse);
      saveToHistory(tripIdToUse, promptText, validatedItinerary, 0);

    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Error in generateItinerary:", err);
      
      if (currentRequestId === requestIdRef.current) {
        let errorType = err.error || 'Request Failed';
        let errorMessage = err.message || 'An unexpected error occurred.';
        
        if (err.name === 'AbortError') {
          errorType = 'Timeout';
          errorMessage = 'The request timed out. The planner service took too long to respond. Please try again.';
        } else if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
          errorType = 'Connection Failed';
          errorMessage = 'Could not reach the backend server. Please check your internet connection and ensure the backend is running.';
        } else if (err instanceof Error) {
          errorType = 'Invalid Shape';
          errorMessage = err.message;
        }

        setError({
          type: errorType,
          message: errorMessage
        });
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleSuggestionClick = (text) => {
    setPrompt(text);
    generateItinerary(text);
  };

  // Action methods passed to child components

  const updateDayHeader = (dayIdx, field, value) => {
    setItinerary(prev => {
      const updated = [...prev];
      updated[dayIdx] = { ...updated[dayIdx], [field]: value };
      saveToHistory(currentTripId, prompt, updated, activeDayIndex);
      return updated;
    });
  };

  const handleAddDay = () => {
    setItinerary(prev => {
      const currentLength = prev ? prev.length : 0;
      const newDay = {
        id: generateId(),
        dayNumber: currentLength + 1,
        title: `Day ${currentLength + 1}: New Destination`,
        theme: "General Sightseeing",
        stops: []
      };
      
      const updated = prev ? [...prev, newDay] : [newDay];
      const newActiveIdx = updated.length - 1;
      setActiveDayIndex(newActiveIdx);
      saveToHistory(currentTripId, prompt, updated, newActiveIdx);
      return updated;
    });
  };

  const handleRemoveDay = (dayIdxToRemove) => {
    if (!itinerary) return;

    if (itinerary.length > 1 && !window.confirm("Are you sure you want to delete this entire day?")) {
      return;
    }

    setItinerary(prev => {
      const filtered = prev.filter((_, idx) => idx !== dayIdxToRemove);
      
      // Reset sequential day values (Day 1, Day 2, etc.)
      const repaired = filtered.map((day, idx) => ({
        ...day,
        dayNumber: idx + 1
      }));

      // Prevent selecting out of bounds day indices
      let newActiveIdx = activeDayIndex;
      if (activeDayIndex >= repaired.length) {
        newActiveIdx = Math.max(0, repaired.length - 1);
      } else if (activeDayIndex === dayIdxToRemove && dayIdxToRemove > 0) {
        newActiveIdx = dayIdxToRemove - 1;
      }
      
      setActiveDayIndex(newActiveIdx);
      saveToHistory(currentTripId, prompt, repaired.length > 0 ? repaired : null, newActiveIdx);
      return repaired.length > 0 ? repaired : null;
    });
  };

  const updateStopField = (dayIdx, stopIdx, field, value) => {
    setItinerary(prev => {
      const updated = [...prev];
      const stops = [...updated[dayIdx].stops];
      stops[stopIdx] = { ...stops[stopIdx], [field]: value };
      updated[dayIdx] = { ...updated[dayIdx], stops };
      saveToHistory(currentTripId, prompt, updated, activeDayIndex);
      return updated;
    });
  };

  const handleAddStop = (dayIdx) => {
    setItinerary(prev => {
      const updated = [...prev];
      const stops = [...updated[dayIdx].stops];
      
      const newStop = {
        id: generateId(),
        time: "Morning",
        activity: "New Activity",
        description: "Click to write notes or details about this activity.",
        location: "Location / Address",
        duration: "1 hour",
        cost: "Free"
      };

      updated[dayIdx] = { ...updated[dayIdx], stops: [...stops, newStop] };
      saveToHistory(currentTripId, prompt, updated, activeDayIndex);
      return updated;
    });
  };

  const handleRemoveStop = (dayIdx, stopIdxToRemove) => {
    setItinerary(prev => {
      const updated = [...prev];
      const stops = updated[dayIdx].stops.filter((_, idx) => idx !== stopIdxToRemove);
      updated[dayIdx] = { ...updated[dayIdx], stops };
      saveToHistory(currentTripId, prompt, updated, activeDayIndex);
      return updated;
    });
  };

  const handleMoveStop = (dayIdx, stopIdx, direction) => {
    setItinerary(prev => {
      const updated = [...prev];
      const stops = [...updated[dayIdx].stops];
      const targetIdx = direction === 'up' ? stopIdx - 1 : stopIdx + 1;
      
      if (targetIdx < 0 || targetIdx >= stops.length) return prev;

      const temp = stops[stopIdx];
      stops[stopIdx] = stops[targetIdx];
      stops[targetIdx] = temp;

      updated[dayIdx] = { ...updated[dayIdx], stops };
      saveToHistory(currentTripId, prompt, updated, activeDayIndex);
      return updated;
    });
  };

  const handleLoadDemo = () => {
    const demoId = 'demo-tokyo';
    setCurrentTripId(demoId);
    setPrompt('Tokyo Trip Demo');
    setItinerary(DEFAULT_TOKYO_ITINERARY);
    setError(null);
    setActiveDayIndex(0);
    saveToHistory(demoId, 'Tokyo Trip Demo', DEFAULT_TOKYO_ITINERARY, 0);
  };

  const handleStartFromScratch = () => {
    const scratchId = generateId();
    setCurrentTripId(scratchId);
    setPrompt('Custom Trip Plan');
    const emptyDay = {
      id: generateId(),
      dayNumber: 1,
      title: "Day 1: My Adventure Begins",
      theme: "Exploring",
      stops: [
        {
          id: generateId(),
          time: "Morning",
          activity: "First Landmark",
          description: "Click here to edit this activity detail.",
          location: "Destination address",
          duration: "2 hours",
          cost: "Free"
        }
      ]
    };
    const initialItinerary = [emptyDay];
    setItinerary(initialItinerary);
    setError(null);
    setActiveDayIndex(0);
    saveToHistory(scratchId, 'Custom Trip Plan', initialItinerary, 0);
  };

  const handleExportJSON = () => {
    if (!itinerary) return;
    const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `itinerary-${prompt.slice(0, 15).replace(/\s+/g, '-').toLowerCase() || 'trip'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectTrip = (trip) => {
    setCurrentTripId(trip.id);
    setPrompt(trip.prompt);
    setItinerary(trip.itinerary);
    setActiveDayIndex(trip.activeDayIndex || 0);
    setError(null);
  };

  const handleDeleteTrip = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this trip from history?")) {
      return;
    }
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('trip_history', JSON.stringify(updated));
      return updated;
    });
    if (currentTripId === id) {
      handleNewTrip();
    }
  };

  const handleNewTrip = () => {
    setCurrentTripId(null);
    setPrompt('');
    setItinerary(null);
    setError(null);
    setActiveDayIndex(0);
  };

  return (
    <div className="app-layout">
      {/* 1. Brand Sidebar History (ChatGPT style) */}
      <HistorySidebar
        history={history}
        currentTripId={currentTripId}
        onSelectTrip={handleSelectTrip}
        onDeleteTrip={handleDeleteTrip}
        onNewTrip={handleNewTrip}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <Header 
          onMenuToggle={() => setSidebarOpen(true)}
          onNewTrip={handleNewTrip}
        />

        {/* Content Container */}
        <div className="content-container">
          {/* Text Input Section */}
          <PromptForm 
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={generateItinerary}
            loading={loading}
            suggestions={SUGGESTIONS}
            onSuggestionClick={handleSuggestionClick}
          />

          {/* Loading Block */}
          {loading && (
            <LoadingBox currentTip={LOADING_TIPS[currentTipIndex]} />
          )}

          {/* Error Display */}
          {error && !loading && (
            <ErrorBox 
              error={error}
              onRetry={() => generateItinerary(prompt)}
              onLoadDemo={handleLoadDemo}
              onStartFromScratch={handleStartFromScratch}
            />
          )}

          {/* Main Interactive Planner Dashboard */}
          {!loading && !error && (
            <>
              {itinerary ? (
                <main className="itinerary-board">
                  {/* Day Tab Sidebar Navigation */}
                  <DaysSidebar 
                    itinerary={itinerary}
                    activeDayIndex={activeDayIndex}
                    setActiveDayIndex={(idx) => {
                      setActiveDayIndex(idx);
                      saveToHistory(currentTripId, prompt, itinerary, idx);
                    }}
                    onAddDay={handleAddDay}
                    onRemoveDay={handleRemoveDay}
                  />

                  {/* Day Content Timeline Panel */}
                  {itinerary[activeDayIndex] && (
                    <DayContentPanel 
                      day={itinerary[activeDayIndex]}
                      dayIdx={activeDayIndex}
                      onUpdateHeader={updateDayHeader}
                      onUpdateStopField={updateStopField}
                      onRemoveStop={handleRemoveStop}
                      onMoveStop={handleMoveStop}
                      onAddStop={handleAddStop}
                    />
                  )}
                </main>
              ) : (
                /* Empty Canvas Fallback Board */
                <EmptyState 
                  onLoadDemo={handleLoadDemo}
                  onStartFromScratch={handleStartFromScratch}
                />
              )}
              
              {/* Action trigger links */}
              {itinerary && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }} className="no-print">
                  <button onClick={handlePrint} className="btn btn-secondary">
                    <Printer size={16} /> Print Itinerary
                  </button>
                  <button onClick={handleExportJSON} className="btn btn-secondary">
                    <Download size={16} /> Export JSON
                  </button>
                </div>
              )}
            </>
          )}

          {/* Footer Area */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
