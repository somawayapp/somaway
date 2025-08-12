// components/BettingGroups.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import speedometer to avoid SSR issues
const ReactSpeedometer = dynamic(() => import("react-d3-speedometer"), { ssr: false });

const groups = [
  { name: "msh", title: "Win 10 Shillings", img: "/shilingibanner.png", desc: "Stash small, win big!" },
  { name: "msh", title: "Win 100 Shillings", img: "/shilingibanner.png", desc: "Bigger stash, better reward!" },
  { name: "msh", title: "Win 1,000 Shillings", img: "/shilingibanner.png", desc: "Go for a grand!" },
  { name: "msh", title: "Win 10,000 Shillings", img: "/shilingibanner.png", desc: "A big leap to 10k!" },
  { name: "msh", title: "Win 100,000 Shillings", img: "/shilingibanner.png", desc: "High stakes, high rewards!" },
  { name: "msh", title: "Win 1 Million Shillings", img: "/shilingibanner.png", desc: "The ultimate jackpot!" },
];

export default function BettingGroups() {
  const [data, setData] = useState({});

  useEffect(() => {
    groups.forEach(async (group) => {
      try {
        const res = await fetch(`https://shilingiapi.vercel.app/summary`);
        const json = await res.json();
        setData(prev => ({ ...prev, [group.name]: json }));
      } catch (error) {
        console.error(`Error fetching ${group.name}:`, error);
      }
    });
  }, []);

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
            className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-[#1b1f1c] rounded-2xl shadow-lg overflow-hidden text-white flex flex-col"
          >
            <img
              src={group.img}
              alt={group.title}
              className="w-full h-48 object-cover object-center"
            />

          <div className="p-5 flex flex-col flex-grow gap-4">
  {/* Title + Progress Bar Row */}
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-bold">{group.title}</h2>

    {groupData.current !== undefined && (
      <div className="flex flex-col items-center">
        {/* Progress Bar */}
        <div className="relative w-[110px] h-[20px] bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600"
            style={{ width: `${groupData.percentage || 0}%` }}
          ></div>
        </div>
        {/* Percentage */}
        <div className="text-white font-bold text-sm mt-1">
          {groupData.percentage || 0}%
        </div>
      </div>
    )}
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
        Est. Time Remaining:{" "}
        <strong>{groupData.estimatedTime || "Calculating..."}</strong>
      </p>
    </div>
  )}

  {/* Join Button */}
  <a
    href={`/group/${group.name}`}
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
