// components/BettingGroups.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import speedometer to avoid SSR issues
const ReactSpeedometer = dynamic(() => import("react-d3-speedometer"), { ssr: false });

const groups = [
  { name: "1osh", title: "Win 10 Shillings", img: "/images/1osh.png", desc: "Stash small, win big!" },
  { name: "1oosh", title: "Win 100 Shillings", img: "/images/1oosh.png", desc: "Bigger stash, better reward!" },
  { name: "1ksh", title: "Win 1,000 Shillings", img: "/images/1ksh.png", desc: "Go for a grand!" },
  { name: "1oksh", title: "Win 10,000 Shillings", img: "/images/1oksh.png", desc: "A big leap to 10k!" },
  { name: "1ooksh", title: "Win 100,000 Shillings", img: "/images/1ooksh.png", desc: "High stakes, high rewards!" },
  { name: "msh", title: "Win 1 Million Shillings", img: "/shilingibanner.png", desc: "The ultimate jackpot!" },
];

export default function BettingGroups() {
  const [data, setData] = useState({});

  useEffect(() => {
    groups.forEach(async (group) => {
      try {
        const res = await fetch(`https://shilingiapi.vercel.app/summary/${group.name}`);
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

            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-lg font-bold mb-2">{group.title}</h2>
              <p className="text-sm text-gray-300 mb-4">{group.desc}</p>

              {groupData.current !== undefined && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400">
                    Stashed: <strong>KES {groupData.current.toLocaleString()} / {groupData.total?.toLocaleString()}</strong>
                  </p>
                  <p className="text-sm text-gray-400">
                    Est. Time Remaining: <strong>{groupData.estimatedTime || "Calculating..."}</strong>
                  </p>
                  <div className="mt-3">
                    <ReactSpeedometer
                      value={groupData.percentage || 0}
                      maxValue={100}
                      needleColor="gold"
                      startColor="red"
                      endColor="green"
                      height={140}
                      width={220}
                      segments={10}
                      currentValueText={`${groupData.percentage || 0}% to full`}
                    />
                  </div>
                </div>
              )}

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
