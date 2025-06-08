import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HowToJoin = () => {
  const [joining, setJoining] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
const [loading, setLoading] = useState(false);


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
    <div className="w-full mx-auto p-6 bg-[#121212] text-white rounded-2xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-[#f36dff] text-center">
        How to Join and Play
      </h2>

      {/* Descriptions and instructions */}
      <p className="text-gray-300 text-sm leading-relaxed">
        By joining the game, you agree to all our{" "}
        <span className="text-[#ffd700] font-medium">Terms and Conditions</span>.
        To participate, click the <strong>Join</strong> button below and enter your
        <strong> M-Pesa phone number</strong> and your <strong>name</strong>. You’ll receive a prompt to send
        <strong> 1 KES</strong> to <strong>Shilingi Ltd</strong>. After confirming
        and entering your M-Pesa PIN, 1 shilling will be deducted and stashed
        into the honey pot.
      </p>

      <p className="text-gray-300 text-sm leading-relaxed">
        <strong>Note:</strong> Only one phone number can stash once (1 KES only)
        to maintain fairness and equality. Your name and half your phone number
        will be displayed publicly to build community trust. If you win, you'll
        be publicly announced with parts of your phone number hidden.
      </p>

      <p className="text-gray-300 text-sm leading-relaxed">
        <strong>Winner Selection:</strong> When the honey pot reaches{" "}
        <span className="text-[#ffd700]">1,000,000 KES</span>, an automated and
        publicly visible hash draw will select a winner at random. The selected
        user will receive <strong>80%</strong> of the stash directly to their
        phone or physically. The remaining <strong>20%</strong> will go towards
        community and builder expenses.
      </p>

      <p className="text-gray-300 text-sm leading-relaxed">
        Once a user joins, their contribution will be publicly reflected in the
        stash count in real-time.
      </p>

      {/* Join Button */}
      {!joining && !submitted && (
        <button
          onClick={handleJoinClick}
          className="mt-auto bg-[#020201] py-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
        >
          Play Now
        </button>
      )}

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
  );
};

export default HowToJoin;
