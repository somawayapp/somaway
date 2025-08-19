
        // components/Sidebar2.jsx (or wherever your Sidebar2 is located)
import React, { useEffect, useState, useRef } from "react"; // Import useRef
import { motion, useAnimation } from "framer-motion";
import { useParams } from "react-router-dom"; // Import useParams


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
  const { groupId } = useParams(); // 'groupId' will be 'g1', 'g2', etc.

  // Existing useEffect for fetching summary

      if (!groupId) return;


   
      
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://somawayapi.vercel.app/summary/${groupId}`);

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      }
    };

    fetchData();
    // Set up an interval to refresh summary every, say, 30 seconds
    const intervalId = setInterval(fetchData, 30000); // Fetch every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
        }, [groupId]); // Re-run when groupId changes






  const FullCircleProgress = ({ percentage }) => {
  const radius = 80; // radius of the circle
  const strokeWidth = 14; // thickness
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 200 200"
    >
      {/* Background circle */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="transparent"
        stroke="#3a3a3a"
        strokeWidth={strokeWidth}
      />

      {/* Progress circle */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="transparent"
        stroke="#ffd700"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 100 100)" // Start from top
      />

   
    </svg>
  );
};







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
  const radius = 70;


  return (
    <div className="w-full md:pr-[25%] px-4 md:px-0 md:pl-[13%] pb-9 md:py-5 overflow-y-auto h-[90vh] text-white flex flex-col items-center gap-4">
      {/* Gauge */}
     {/* Gauge */}
<div className="relative w-40 h-40 flex items-center justify-center">
                <FullCircleProgress percentage={displayedPercentage} />

  <div className="absolute text-center">
    <p className="text-2xl font-bold text-[#f36dff]">
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
        <p className="text-md text-[#ffd700]">{estimatedTime}</p>
      </motion.div>

      {/* --- NEW SEARCH BAR --- */}
         <motion.div
        className="w-full mt-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <h3 className="text-sm font-bold text-[#f36dff] mb-3 text-center">
          Search Your Entry:
        </h3>
   <div class="relative flex-grow min-w-0">
  <input
    type="text"
    placeholder="07XXXXXXXX"
    class="w-full px-3 pr-16 text-sm rounded-md bg-gradient-to-br from-[#070707ff] to-[#111] border-2 border-[#070707ff]
           text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f36dff]
           min-w-0 py-2"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    }}
  />
  <button
    onClick={handleSearch}
    class="absolute inset-y-0 right-0 bg-[#ffd700] px-3 text-sm text-gray-900 rounded-r-md font-semibold hover:bg-[#ffc107] transition-colors
           disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="w-full  text-center h-[fit-content] max-h-[55vh]  min-h-[55vh]  overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ul className="space-y-1 text-sm">
            {searchResults.map((result, idx) => (

               <motion.div
             key={idx}
            className="mt-2 p-3  bg-gradient-to-br from-[#070707ff] to-[#111] border border-[#1b1f1c] rounded-md  text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-md font-bold text-[#ffd700]">Search Results!</h4>
            <p className="text-sm text-gray-300">Name: {result.name}</p>
            <p className="text-sm text-gray-300">Phone: {result.phone}</p>
            <p className={`text-sm ${result.status !== 'Completed' ? 'text-red-500 font-semibold' : 'text-blue-500'}`}>  Transaction: {result.status}</p>   
             <p className="text-sm text-gray-300">Cycle: {result.cycle}</p>
            <p className="text-xs text-gray-400 mt-1">Joined: {new Date(result.createdAt).toLocaleString()}</p>
          </motion.div>


             
            ))}
          </ul>
        </motion.div>
      )}
       


      {/* Players List (Conditionally rendered or below search results) */}
      {/* You might want to hide the full player list if search results are displayed
          or make it clear which list is which.
          For now, I'll put it below the search results and add a check. */}
      {searchResults.length === 0 && ( // Only show the main list if no search results are active

       


          <motion.div
          className="w-full text-center h-[fit-content] max-h-[calc(100vh-600px)] p-3 bg-gradient-to-br from-[#070707ff] to-[#111] border border-[#1b1f1c] overflow-y-auto "
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