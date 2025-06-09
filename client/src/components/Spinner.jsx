import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const Spinner = () => {
  const [summary, setSummary] = useState(null);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const controls = useAnimation();

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
    }, 20);
  }, [summary, controls]);

  const current = summary?.current ?? 0;
  const total = summary?.total ?? 0;
  const percentage = summary?.percentage ?? 0;
  const estimatedTime = summary?.estimatedTime ?? "-";
  const players = summary?.players ?? [];

  return (
          <div  style={{ zIndex: 100005, }} className=" rounded-full bg-[var(--bg)]  ">

      <div className="fixed w-40 h-40 flex p-2  rounded-full justify-center items-center">
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
      </div>

  
  );
};

export default Spinner;
