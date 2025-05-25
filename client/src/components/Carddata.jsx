import { motion } from "framer-motion";
import { Button } from "@mui/material";

const cardData = [
  {
    image: "/win1.jpg",
    title: "Win Ksh 1 Million",
    desc: "Bet only 1 shilling and stand a chance to win 1 million shillings instantly.",
  },
  {
    image: "/win2.jpg",
    title: "Win Ksh 100,000",
    desc: "Turn 1 shilling into 100,000 shillings with one lucky bet.",
  },
  {
    image: "/win3.jpg",
    title: "Win Ksh 10,000",
    desc: "One shilling could be your ticket to 10,000 shillings today.",
  },
  {
    image: "/win4.jpg",
    title: "Win Ksh 1,000",
    desc: "Bet 1 shilling and you could walk away with 1,000 shillings.",
  },
  {
    image: "/win5.jpg",
    title: "Win Ksh 100",
    desc: "Your single shilling could win you 100 shillings!",
  },
  {
    image: "/win6.jpg",
    title: "Win Ksh 10",
    desc: "Even 1 shilling can win you 10 shillings. Start small, win big!",
  },
];

export default function BettingChances() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  py-8 border-1 border-black bg-[var(--bg)]">
      {cardData.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a1a] text-white flex flex-col"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover object-center hover:scale-105 transition-transform duration-300"
          />
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-300 mb-4">{item.desc}</p>
            <Button className="mt-auto bg-[#1ff8b0] text-black font-semibold w-full hover:scale-105 transition-transform duration-200">
              Play Now
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
