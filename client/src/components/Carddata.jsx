import { Button } from "@mui/material";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cardData = [
  {
    image: "/spin.jpg",
    title: "Win Ksh 1 Million",
    desc: "Bet only 1 shilling and stand a chance to win 1 million shillings instantly.",
  },
 
];





export default function BettingChances() {

  const [joining, setJoining] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
const [loading, setLoading] = useState(false);



  const handleShareToWhatsApp = () => {
    const message = `No matter what you’ve heard, size does matter —
But these days, it’s not about how big something is.
It’s about the small things. The forgotten ones. The quiet chances.

Ever walked out of a supermarket with a single shilling in your hand,
and no idea what to do with it?

There was a time one shilling could get you salt. Sugar. Even bread.
You could walk in with a coin and leave with food — and change.
But not anymore.

Now it just sits in your pocket.
On the floor of a matatu.
Lost.
Meaningless.

But someone built a space for that shilling.
A place where all the small things come together.
Where everyone gets a shot.
An equal chance — to take part, with just one shilling.
One. No more.

And when that space fills —
One million members.
Each contributing just 1 shilling —

Someone gets lifted.
A random member, chosen publicly, will walk away with 1 million KES.
Not because they had more.
But because they showed up.
It could be you. Or me.
All it takes is a shilling.

I put mine in.
Thought maybe you’d want to too.
👉 [yourlink.com]\n\nStart your journey today:\nhttps://makesomaway.com 🚪✨`;
  
    const url = `https://wa.me/?text=${encodeURIComponent(message + " ")}`;
  
    window.open(url, '_blank');
    localStorage.setItem('lastShared', Date.now().toString());
  };

  const handleJoinClick = () => {
    setJoining(true);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!phone || !name) {
    alert("name and phone number are required.");
    return;
  }
  if (!acceptedTerms) {
    alert("Please accept the terms and conditions to continue.");
    return;
  }
  
  if (!/^07\d{8}$/.test(phone)) {
  alert("Please enter a valid M-Pesa phone number starting with 07...");
  return;
}


  setLoading(true);
  try {
    const res = await fetch("https://somawayapi.vercel.app/mpesa/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name }),
    });

    const data = await res.json();

    if (data.success) {
      setSubmitted(true);
    } else {
      alert("Failed to send payment prompt. Try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Error initiating payment.");
  } finally {
    setLoading(false);
  }
};


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
            className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-300"
          />
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-300 mb-4">{item.desc}</p>
           
           
     {/* Join Button */}
      {!joining && !submitted && (
        <button
          onClick={handleJoinClick}
          className="mt-auto bg-[#020201] py-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
        >
          Join Now
        </button>
      )}

        <button
      onClick={handleShareToWhatsApp}
          className="mt-auto bg-[#020201] py-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
        >
          Join Now
        </button>

      {/* Input Form */}
     
      <AnimatePresence>
        {joining && !submitted && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded-lg text-black focus:outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Enter M-Pesa number (e.g. 07XX...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-2 rounded-lg text-black focus:outline-none"
              required
            />

           <label className="text-sm flex items-center gap-2 text-gray-200">
  <input
    type="checkbox"
    checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
    className="accent-[#ffd700]"
  />
  I accept the{" "}
  <a
    href="/terms" // Update with your actual terms URL
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#ffd700] underline hover:text-yellow-400 transition-colors duration-200"
  >
    terms and conditions
  </a>
</label>


            <button
              type="submit"
              disabled={loading}
              className={`font-bold px-5 py-2 rounded-lg transition-all duration-200 ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#ffd700] text-black hover:bg-yellow-400 hover:scale-102"
              }`}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Confirmation Message */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-green-800 p-4 rounded-xl text-sm"
          >
            ✅ A prompt has been sent to <strong>{phone}</strong>. Please confirm
            the payment of <strong>1 KES</strong> to{" "}
            <strong>Shilingi Ltd</strong> via M-Pesa and enter your PIN to
            complete the transaction.
            <br />
            Your contribution will now be added to the stash and you’ll appear
            on the leaderboard as <strong>{name}</strong>!
          </motion.div>
        )}
      </AnimatePresence>

        

          </div>

           
        </motion.div>
      ))}
    </div>
  );
}