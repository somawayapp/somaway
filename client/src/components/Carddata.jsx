import { motion } from "framer-motion";
import { Button } from "@mui/material";

const cardData = [
  {
    image: "/spin.webp",
    title: "Win Ksh 1 Million",
    desc: "Bet only 1 shilling and stand a chance to win 1 million shillings instantly.",
  },
 
];

export default function BettingChances() {
  return (
    <div className="grid grid-cols-1 gap-6  py-8  bg-[var(--bg)]">
      {cardData.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border-2 border-[#1b1f1c] text-white flex flex-col"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full  object-cover object-center hover:scale-102 transition-transform duration-300"
          />
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-300 mb-4">{item.desc}</p>
            <button className="mt-auto bg-[#11110d] py-4 hover:bg-[#161610] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200">
              Play Now
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
