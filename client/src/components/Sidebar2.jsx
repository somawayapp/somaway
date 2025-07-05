import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const Sidebar2 = () => {
  const [summary, setSummary] = useState(null);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const controls = useAnimation();

  // --- NEW: State for Search functionality ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  // --- END NEW State ---

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://somawayapi.vercel.app/summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      }
    };

    fetchData();

    // Optionally, refetch summary data periodically to keep it fresh
    const intervalId = setInterval(fetchData, 60000); // Refetch every 60 seconds (matching backend cache TTL)
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

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
    }, 20); // This animates the number
  }, [summary, controls]);

  // --- NEW: Handle Search ---
  const handleSearch = async () => {
    if (!searchTerm) {
      setSearchError("Please enter a phone number to search.");
      setSearchResult(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null); // Clear previous results

    try {
      // Encode the phone number for the URL
      const encodedPhone = encodeURIComponent(searchTerm);
      const res = await fetch(`https://somawayapi.vercel.app/search?phone=${encodedPhone}`);
      const data = await res.json();

      if (data.success) {
        setSearchResult(data.data); // Store the found entry
      } else {
        setSearchError(data.message || "No entry found.");
      }
    } catch (err) {
      console.error("Search API error:", err);
      setSearchError("Failed to perform search. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };
  // --- END NEW Search Handlers ---

  const current = summary?.current ?? 0;
  const total = summary?.total ?? 0;
  const percentage = summary?.percentage ?? 0;
  const estimatedTime = summary?.estimatedTime ?? "-";
  const players = summary?.players ?? [];

  return (
    <div className="w-full md:px-[5%] pb-9 md:py-5 overflow-y-auto h-[calc(100vh-130px)] text-white flex flex-col items-center gap-6">
      {/* Gauge */}
      <div className="relative w-40 hidden md:flex h-40 justify-center items-center">
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
          transition={{ delay: 0.5, duration: 0.5 }} {/* Adjusted delay */}
        >
          {current.toLocaleString()} / {total.toLocaleString()}
        </motion.p>
      </div>

      {/* Estimated Time */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }} {/* Adjusted delay */}
      >
        <p className="text-sm text-gray-300">Estimated Time to Full</p>
        <p className="text-lg font-medium text-[#f36dff]">{estimatedTime}</p>
      </motion.div>

      {/* --- NEW: Search Bar --- */}
      <motion.div
        className="w-full px-4 mt-6"
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
            placeholder="Enter your phone number (e.g., 07XXXXXXXX)"
            className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f36dff]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {searchResult && (
          <motion.div
            className="mt-4 p-3 bg-gray-800 rounded-md border border-gray-700 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-md font-bold text-[#ffd700]">Your Entry Found!</h4>
            <p className="text-sm text-gray-300">Name: {searchResult.name}</p>
            <p className="text-sm text-gray-300">Phone: {searchResult.phone}</p>
            <p className="text-sm text-gray-300">Status: {searchResult.status}</p>
            <p className="text-sm text-gray-300">Cycle: {searchResult.cycle}</p>
            <p className="text-xs text-gray-400 mt-1">Joined: {new Date(searchResult.createdAt).toLocaleString()}</p>
          </motion.div>
        )}
      </motion.div>
      {/* --- END NEW Search Bar --- */}


      {/* Players List */}
      <motion.div
        className="w-full mt-6 text-center h-[80%] md:h-[40%] overflow-y-auto" {/* Changed to overflow-y-auto */}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }} {/* Adjusted delay */}
      >
        <h3 className="text-sm font-bold text-[#f36dff] mb-2">Participants:</h3>
        <ul className="space-y-1 text-sm">
          {players.length > 0 ? (
            players.map((player, idx) => (
              <motion.li
                key={player._id || idx} {/* Use _id for better keying */}
                className="text-[#f2f2f2] hover:text-[#ffd700] transition"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + idx * 0.05 }} {/* Adjusted delay */}
              >
                {player.name} — {player.phone}
              </motion.li>
            ))
          ) : (
            <p className="text-gray-400">No participants yet.</p>
          )}
        </ul>
      </motion.div>
    </div>
  );
};

export default Sidebar2;