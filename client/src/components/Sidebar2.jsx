// components/Sidebar2.jsx (or wherever your Sidebar2 is located)
import React, { useEffect, useState, useRef } from "react"; // Import useRef
import { motion, useAnimation } from "framer-motion";

const Sidebar2 = () => {
  const [summary, setSummary] = useState(null);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const controls = useAnimation();

  // --- NEW STATE FOR SEARCH ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchInputRef = useRef(null); // Ref for input focus

  // Existing useEffect for fetching summary
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://somawayapi.vercel.app/summary/g1");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      }
    };

    fetchData();
    // Set up an interval to refresh summary every, say, 30 seconds
    const intervalId = setInterval(fetchData, 1000); // Fetch every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // Existing useEffect for gauge animation
  useEffect(() => {
    if (!summary) return;

    const percentage = summary.percentage;
    controls.start({
      strokeDashoffset: 440 - (440 * percentage) / 100,
      transition: { duration: 2, ease: "easeInOut" },
    });

    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent++;
      setDisplayedPercentage(currentPercent);
      if (currentPercent >= percentage) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval); // Cleanup interval
  }, [summary, controls]);

  // --- NEW SEARCH FUNCTIONALITY ---
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]); // Clear previous results

    if (!searchQuery.trim()) {
      setSearchError("Please enter a phone number to search.");
      setSearchLoading(false);
      return;
    }

    try {
      // Use your API endpoint for search
      const res = await fetch(`https://somawayapi.vercel.app/search?phone=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (data.success) {
        if (data.results && data.results.length > 0) {
          setSearchResults(data.results);
        } else {
          setSearchError(data.message || "No results found.");
        }
      } else {
        setSearchError(data.message || "An error occurred during search.");
      }
    } catch (err) {
      console.error("Failed to search:", err);
      setSearchError("Failed to connect to search server.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Focus on search input when component mounts (optional)
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);


  const current = summary?.current ?? 0;
  const total = summary?.total ?? 0;
  const percentage = summary?.percentage ?? 0;
  const estimatedTime = summary?.estimatedTime ?? "-";
  const players = summary?.players ?? []; // The list of all participants from summary

  return (
    <div className="w-full md:pr-[26%] pl-[13%] pb-9 md:py-5 overflow-y-auto h-[calc(100vh-130px)] text-white flex flex-col items-center gap-6">
      {/* Gauge */}
      <div className="relative w-40 hidden md:flex h-40 flex justify-center items-center">
        <svg className="w-full h-full rotate-[135deg]" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#3a3a3a"
            strokeWidth="20"
            strokeDasharray="440"
            strokeDashoffset="0"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="440"
            strokeDashoffset="440"
            animate={controls}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f36dff" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <p className="text-3xl font-bold text-[#f36dff]">
            {displayedPercentage}%
          </p>
          <p className="text-xs text-gray-400 mt-1">PROGRESS</p>
        </div>
      </div>

      {/* Total Amount */}
      <div className="text-center mt-9 md:mt-0 hover:scale-[1.02] transition-transform duration-300">
        <p className="text-sm text-gray-300">Total Amount</p>
        <motion.p
          className="text-xl font-bold text-[#ffd700]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {current.toLocaleString()} / {total.toLocaleString()}
        </motion.p>
      </div>

      {/* Estimated Time */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <p className="text-sm text-gray-300">Estimated Time to Full</p>
        <p className="text-lg font-medium text-[#f36dff]">{estimatedTime}</p>
      </motion.div>

      {/* --- NEW SEARCH BAR --- */}
         <motion.div
        className="w-full px-4 mt-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <h3 className="text-sm font-bold text-[#f36dff] mb-2 text-center">
          Search Your Entry:
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <input
            type="text"
            placeholder="Enter phone  (e.g., 07XXX)"
            className="flex-shrink p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f36dff]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => { // Allow pressing Enter to search
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#ffd700] text-gray-900 rounded-md font-semibold hover:bg-[#ffc107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={searchLoading}
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {searchLoading && <p className="text-center text-sm text-gray-400 mt-2">Loading...</p>}
        {searchError && <p className="text-center text-sm text-red-400 mt-2">{searchError}</p>}

  
      </motion.div>
    

      {/* --- SEARCH RESULTS DISPLAY --- */}
      {searchResults.length > 0 && (
        <motion.div
          className="w-full mt-2 text-center h-[fit-content] max-h-[calc(100vh-600px)] overflow-y-auto border-t border-gray-700 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ul className="space-y-1 text-sm">
            {searchResults.map((result, idx) => (

               <motion.div
             key={idx}
            className="mt-2 p-3 bg-gray-800 rounded-md border border-gray-700 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-md font-bold text-[#ffd700]">Search Results!</h4>
            <p className="text-sm text-gray-300">Name: {result.name}</p>
            <p className="text-sm text-gray-300">Phone: {result.phone}</p>
            <p className="text-sm text-gray-300">Status: {result.status}</p>
            <p className="text-sm text-gray-300">Cycle: {result.cycle}</p>
            <p className="text-xs text-gray-400 mt-1">Joined: {new Date(result.createdAt).toLocaleString()}</p>
          </motion.div>


             
            ))}
          </ul>
        </motion.div>
      )}
       

     <hr className="border-t border-gray-700 mt-2" />

      {/* Players List (Conditionally rendered or below search results) */}
      {/* You might want to hide the full player list if search results are displayed
          or make it clear which list is which.
          For now, I'll put it below the search results and add a check. */}
      {searchResults.length === 0 && ( // Only show the main list if no search results are active

       


          <motion.div
          className="w-full mt-2 text-center h-[fit-content] max-h-[calc(100vh-600px)] p-3 bg-gray-800 overflow-y-auto "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ul className="space-y-1 text-sm">
          <h4 className="text-md font-bold text-[#ffd700]">  Participants </h4>

           

          {players.map((player, idx) => (
              <motion.li
                key={idx}
                className="text-[#f2f2f2] hover:text-[#ffd700] transition"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.1 + idx * 0.05 }}
              >
                {player.name} — {player.phone}
              </motion.li>
            ))}
             
          </ul>
        </motion.div>



    
      )}
    </div>
  );
};

export default Sidebar2;