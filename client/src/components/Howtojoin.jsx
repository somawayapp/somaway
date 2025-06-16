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
      <a href="/terms" className="text-[#ffd700] mr-1 font-medium">
      Terms and Conditions
      </a>
        To participate, click the <strong>Join</strong> button above and enter your
        <strong> M-Pesa phone number starting with 07... </strong> and your <strong> full legal name</strong>. You’ll receive a prompt to send
        <strong> 1 KES</strong> to <strong>Shilingi Ltd</strong>. After confirming
        and entering your M-Pesa PIN, 1 shilling will be deducted and stashed
        into the pool .
      </p>

   <p className="text-gray-300 text-sm leading-relaxed">
  <strong>Participation Rules:</strong> Each phone number can only contribute once with <strong>1 KES</strong> to ensure fairness 
  and equal opportunity for all participants. To promote transparency and community trust, your name and a partial phone number will
   be publicly displayed. If you are selected as the winner, your identity will be announced with sensitive details partially hidden.
</p>

<p className="text-gray-300 text-sm leading-relaxed mt-4">
  <strong>Winner Selection:</strong> Once the total stash reaches <span className="text-[#ffd700] font-semibold">1,000,000 KES</span>,
   an automated, transparent hash-based draw will randomly select a winner. The selected individual will receive <strong>80%</strong>
    of the total amount directly via mobile money or in person. The remaining <strong>20%</strong> will be allocated to cover community 
    and operational costs.
</p>

<p className="text-gray-300 text-sm leading-relaxed mt-4">
  <strong>Real-Time Updates:</strong> All contributions are immediately reflected in the public stash count upon confirmation,
   ensuring visibility and community engagement throughout the process.
</p>


 
    </div>
  );
};

export default HowToJoin;
