// components/BettingGroups.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import speedometer to avoid SSR issues
const ReactSpeedometer = dynamic(() => import("react-d3-speedometer"), { ssr: false });

const groups = [
  { name: "g1", title: "Win KSH 10 ", img: "/shilingibanner.png", desc: "Stash small, win big!" },
  { name: "g2", title: "Win KSH 100 ", img: "/shilingibanner.png", desc: "Bigger stash, better reward!" },
  { name: "g3", title: "Win KSH 1,000 ", img: "/shilingibanner.png", desc: "Go for a grand!" },
  { name: "g4", title: "Win KSH 10,000 ", img: "/shilingibanner.png", desc: "A big leap to 10k!" },
  { name: "g5", title: "Win KSH 100,000 ", img: "/shilingibanner.png", desc: "High stakes, high rewards!" },
  { name: "g6", title: "Win KSH 1 Million ", img: "/shilingibanner.png", desc: "The ultimate jackpot!" },
];

export default function BettingGroups() {
  const [data, setData] = useState({});

  // Define the polling interval (e.g., every 10 seconds)
  const POLLING_INTERVAL = 1000; // 10 seconds in milliseconds

  const HalfCircleProgress = ({ percentage }) => {
    const radius = 40; // radius of the arc
    const strokeWidth = 8; // thickness of the arc
    const circumference = Math.PI * radius; // half circle circumference
    const offset = circumference - (1 + (percentage / 100) * circumference);


    return (
      <svg
        width="100"
        height="60"
        viewBox="0 0 100 60"
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="transparent"
          stroke="#6B7280" // gray background
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="transparent"
          stroke="#9333EA" // purple fill
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />

        {/* Percentage text */}
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="white"
        >
          {percentage ? percentage.toFixed(0) : 1}%
        </text>
      </svg>
    );
  };

  const fetchData = async () => {
    groups.forEach(async (group) => {
      try {
        const res = await fetch(`https://somawayapi.vercel.app/summary/${group.name}`);
        const json = await res.json();
        setData(prev => ({ ...prev, [group.name]: json }));
      } catch (error) {
        console.error(`Error fetching ${group.name}:`, error);
      }
    });
  };

  useEffect(() => {
    // Initial fetch when the component mounts
    fetchData();

    // Set up interval for polling
    const intervalId = setInterval(fetchData, POLLING_INTERVAL);

    // Cleanup function: clear interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {groups.map((group, i) => {
        const groupData = data[group.name] || {};
        return (
          <motion.div
            key={group.name}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-gradient-to-br from-[#070707ff] to-[#111] border border-[#1b1f1c] rounded-2xl shadow-lg overflow-hidden text-white flex flex-col"
          >
            <div className="p-5 flex flex-col flex-grow gap-4">
              {/* Title + Progress Bar Row */}
              <div className="flex items-center justify-between">
                <img
                  src={group.img}
                  alt={group.title}
                  className="w-16 h-16 md:h-20 md:w-20 rounded-xl object-cover object-center"
                />
                <h2 className="text-md md:text-lg px-1 font-bold">{group.title}</h2>
                <HalfCircleProgress percentage={groupData.percentage} />
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300">{group.desc}</p>

              {/* Stash Info */}
              {groupData.current !== undefined && (
                <div>
                  <p className="text-sm text-gray-400">
                    Stashed:{" "}
                    <strong>
                      KES {groupData.current.toLocaleString()} /{" "}
                      {groupData.total?.toLocaleString()}
                    </strong>
                  </p>
                     <p className="text-sm text-gray-400">
                    Cycle:{" "}
                    <strong>
                    <strong>{groupData.cycleNumber || "Calculating..."}</strong>
                    </strong>
                  </p>
                  <p className="text-sm text-gray-400">
                    Est. Time Remaining:{" "}
                    <strong>{groupData.estimatedTime || "Calculating..."}</strong>
                  </p>
                </div>
              )}

              {/* Join Button */}
              <a
                href={`/${group.name}`}
                className="mt-auto bg-[#020201] py-3 text-[#EBD402] rounded-xl font-semibold w-full text-center hover:bg-[#0e0e06] hover:scale-102 transition-transform duration-200"
              >
                Join Now
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}