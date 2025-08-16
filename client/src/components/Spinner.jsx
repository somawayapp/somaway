import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useParams } from "react-router-dom"; // Import useParams


const Spinner = () => {
  const [summary, setSummary] = useState(null);
  // Initialize displayedPercentage to 1
  const [displayedPercentage, setDisplayedPercentage] = useState(1);
  const controls = useAnimation();
  const { groupId } = useParams(); // 'groupId' will be 'g1', 'g2', etc.

  // Moved the early return inside useEffect to ensure useParams has a chance to provide groupId
  // and to avoid issues with hooks being called conditionally at the top level.

  useEffect(() => {
    if (!groupId) {
      console.warn("groupId is not available.");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://somawayapi.vercel.app/summary/${groupId}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        // Optionally, reset summary or handle error state for the UI
        setSummary(null);
      }
    };

    fetchData();
    // Set up an interval to refresh summary every, say, 30 seconds
    const intervalId = setInterval(fetchData, 30000); // Fetch every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [groupId]); // Re-run when groupId changes

  useEffect(() => {
    if (!summary || typeof summary.percentage === 'undefined') {
      // If summary is not available or percentage is undefined, keep displayedPercentage at its default (1)
      return;
    }

    const percentage = summary.percentage;
    controls.start({
      strokeDashoffset: 440 - (440 * percentage) / 100,
      transition: { duration: 2, ease: "easeInOut" },
    });

    let currentPercent = displayedPercentage; // Start animation from current displayed percentage
    const interval = setInterval(() => {
      // Ensure we don't go beyond the target percentage
      if (currentPercent < percentage) {
        currentPercent++;
        setDisplayedPercentage(currentPercent);
      } else {
        clearInterval(interval);
      }
      // If the target percentage is less than the current displayed, immediately set it.
      if (currentPercent >= percentage) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval); // Cleanup previous interval on re-render
  }, [summary, controls]); // Re-run when summary or controls change


  return (
    <div className="w-32 h-32 md:hidden rounded-full bg-[var(--bg)] shadow-lg flex items-center justify-center p-1">
      <svg className="w-full h-full rotate-[135deg]" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#3a3a3a"
          strokeWidth="14"
          strokeDasharray="440"
          strokeDashoffset="0"
        />
        <motion.circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="url(#grad)"
          strokeWidth="14"
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
        <p className="text-xl font-bold text-[#f36dff]">
          {displayedPercentage}%
        </p>
        <p className="text-[8px] text-gray-400 mt-1">PROGRESS</p>
      </div>
    </div>
  );
};

export default Spinner;
