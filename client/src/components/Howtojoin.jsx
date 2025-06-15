import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


const HowToJoin = () => {





  return (
    <div className="w-full mx-auto p-6 bg-[#121212] text-white rounded-2xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-[#f36dff] text-center">
        How to Join and Play
      </h2>

      {/* Descriptions and instructions */}
      <p className="text-gray-300 text-sm leading-relaxed">
        By joining the initiative, you agree to all our{" "}
      <a href="/terms" className="text-[#ffd700] font-medium">
      Terms and Conditions
      </a>
        To participate, click the <strong>Join</strong> button above and enter your
        <strong> M-Pesa phone number starting with 07... </strong> and your <strong> full legal name</strong>. You’ll receive a prompt to send
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

 
    </div>
  );
};

export default HowToJoin;
