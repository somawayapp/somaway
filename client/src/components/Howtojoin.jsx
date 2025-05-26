import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HowToJoin = () => {
  const [joining, setJoining] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleJoinClick = () => {
    setJoining(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-[#121212] text-white rounded-2xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-[#f36dff] text-center">
        How to Join and Play
      </h2>

      <p className="text-gray-300 text-sm leading-relaxed">
        By joining the game, you agree to all our{" "}
        <span className="text-[#ffd700] font-medium">Terms and Conditions</span>.
        To participate, click the <strong>Join</strong> button below and enter your
        <strong> M-Pesa phone number</strong>. You’ll receive a prompt to send
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
        <motion.button
          onClick={handleJoinClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#f36dff] text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:bg-[#d855e3] transition"
        >
          Join Now
        </motion.button>
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
            className="flex flex-col sm:flex-row gap-3 items-center"
          >
            <input
              type="tel"
              placeholder="Enter M-Pesa number (e.g. 07XX...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-2 rounded-lg w-full sm:w-auto flex-grow text-black focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#ffd700] text-black font-bold px-5 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
              Submit
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
            on the leaderboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HowToJoin;
