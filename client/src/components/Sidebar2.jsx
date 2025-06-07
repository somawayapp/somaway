import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";

const Sidebar2 = () => {
  const controls = useAnimation();
  const [data, setData] = useState(null);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://somawayapi.vercel.app/summary");
        setData(res.data);

        await controls.start({
          strokeDashoffset: 440 - (440 * res.data.percentage) / 100,
          transition: { duration: 2, ease: "easeInOut" },
        });

        let currentPercent = 0;
        const interval = setInterval(() => {
          currentPercent++;
          setDisplayedPercentage(currentPercent);
          if (currentPercent >= res.data.percentage) clearInterval(interval);
        }, 20);
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    };

    fetchData();
  }, [controls]);

  if (!data) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="w-full px-[5%] py-5 overflowy-none h-[calc(100vh-130px)] text-white flex flex-col items-center gap-6">
      {/* Gauge */}
      <div className="relative w-40 h-40 flex justify-center items-center">
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
          <p className="text-3xl font-bold text-[#f36dff]">{displayedPercentage}%</p>
          <p className="text-xs text-gray-400 mt-1">PROGRESS</p>
        </div>
      </div>

      {/* Total Amount */}
      <div className="text-center hover:scale-[1.02] transition-transform duration-300">
        <p className="text-sm text-gray-300">Total Amount</p>
        <motion.p
          className="text-xl font-bold text-[#ffd700]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {data.current.toLocaleString()} / {data.total.toLocaleString()}
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
        <p className="text-lg font-medium text-[#f36dff]">{data.estimatedTime}</p>
      </motion.div>

      {/* Players List */}
      <motion.div
        className="w-full mt-6 text-center h-[40%] overflow-y-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <h3 className="text-sm font-bold text-[#f36dff] mb-2">Players:</h3>
        <ul className="space-y-1 text-sm">
          {data.players.map((player, idx) => (
            <motion.li
              key={idx}
              className="text-[#f2f2f2] hover:text-[#ffd700] transition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.1 + idx * 0.1 }}
            >
              {player.name} - {player.phone}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Sidebar2;