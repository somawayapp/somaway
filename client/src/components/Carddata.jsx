// components/BettingChances.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom"; // Import useParams

const cardData = [
  {
    img: "/shilingibanner.png",
    title: "Win Ksh 1 Million",
    desc: "Join a community-powered luck pool where everyone has a fair shot to win 1 million shillings by stashing only 1 shilling.",
  },
];

export default function BettingChances() {
  const [joining, setJoining] = useState(true);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cycleStatus, setCycleStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Get the 'group' parameter from the URL using useParams
  // Assumes your route is something like "/group/:groupId" or just "/:groupId"
  const { groupId } = useParams(); // 'groupId' will be 'g1', 'g2', etc.

  // New state to manage transaction details from local storage/after submission
  const [transactionDetails, setTransactionDetails] = useState(() => {
    // Initialize from localStorage on mount, using a key specific to the group
    const storedTransaction = localStorage.getItem(`pendingMpesaTransaction_${groupId}`);
    return storedTransaction ? JSON.parse(storedTransaction) : null;
  });

  const statusCheckIntervalRef = useRef(null); // Ref for interval ID

  // --- Initial Fetch for Cycle Status ---
  useEffect(() => {
    // Ensure groupId is available before making API calls
    if (!groupId) return;

    const fetchCycleStatus = async () => {
      try {
        const res = await fetch(`https://somawayapi.vercel.app/mpesa/${groupId}/cycle-status`);
        const data = await res.json();
        if (data.success) {
          setCycleStatus(data);
        } else {
          console.error("Failed to fetch cycle status:", data.error);
        }
      } catch (err) {
        console.error("Error fetching cycle status:", err);
      }
    };
    fetchCycleStatus();

    const intervalId = setInterval(fetchCycleStatus, 1000); // Every 30 seconds
    return () => clearInterval(intervalId);
  }, [groupId]); // Re-run when groupId changes

  // --- Effect to Check Transaction Status from DB (Simplified Polling) ---
  useEffect(() => {
    // Only proceed if there's a transactionDetails and its status isn't final
    if (transactionDetails && !["Completed", "Failed", "Cancelled", "Expired", "Query_Failed_Internal"].includes(transactionDetails.status)) {

      // Clear any existing interval to prevent multiple intervals running
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }

      const checkDbStatus = async () => {
        try {
          const res = await fetch(`https://somawayapi.vercel.app/mpesa/${groupId}/get-status`, { // NEW ENDPOINT
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkoutRequestID: transactionDetails.checkoutRequestID }),
          });
          const data = await res.json();

          if (data.success && data.transaction) {
            const { status, failReason } = data.transaction;
            setTransactionDetails(prev => ({ ...prev, status, failReason }));

            if (["Completed", "Failed", "Cancelled", "Expired", "Query_Failed_Internal"].includes(status)) {
              // Transaction is final, stop polling and remove from local storage
              clearInterval(statusCheckIntervalRef.current);
              localStorage.removeItem(`pendingMpesaTransaction_${groupId}`); // Use group-specific key
            }
          } else {
            // If backend says not found or an error, assume it might have expired or failed
            // Still keep polling for a bit, or you can decide to set a "pending-unknown" state
            // For now, let's keep polling and let the backend definitively update.
            console.log("DB transaction status not yet final or not found:", data.error || "No transaction data");
          }
        } catch (error) {
          console.error("Error checking DB transaction status:", error);
          // Network error on client side, keep current state and retry
        }
      };

      // Start polling for status
      statusCheckIntervalRef.current = setInterval(checkDbStatus, 5000); // Poll every 5 seconds

      // Initial check immediately
      checkDbStatus();

      // Cleanup function
      return () => {
        if (statusCheckIntervalRef.current) {
          clearInterval(statusCheckIntervalRef.current);
        }
      };
    } else {
      // If transactionDetails is null or status is final, clear any interval
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    }
  }, [transactionDetails, groupId]); // Re-run when transactionDetails or groupId changes


  const handleShareToWhatsApp = () => {
    const message = `
One shilling gives you a chance to win one million shillings!

Join a community-powered luck pool where everyone has a fair shot to win 1 million shillings by stashing only 1 shilling.

A million people take part, each contributing a single shilling
Where everyone gets only one chance — equal to everyone else.

Once the community stash reaches 1 million shillings,
a random lucky winner is publicly selected to take it all home.

One shilling.
One million.
One lucky winner.

Join now for just one bob —
👉\n\n Shilingi yaweza kupa mamili. Visit:\nhttps://shilingi.co.ke ✨`;

    const url = `https://wa.me/?text=${encodeURIComponent(message + " ")}`;

    window.open(url, "_blank");
    localStorage.setItem("lastShared", Date.now().toString());
  };

  const handleJoinClick = () => {
    // Removed the capacity check
    setJoining(true);
    setTransactionDetails(null); // Clear any previous transaction details
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setTransactionDetails(null); // Reset details on new submission

    // Name validation: only letters, max 30 characters
    if (!/^[a-zA-Z\s]{1,30}$/.test(name)) {
      setErrorMessage("Please enter a valid name (letters and spaces only, max 30 characters).");
      return;
    }
    if (!phone || !name) {
      setErrorMessage("Name and phone number are required.");
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage("Please accept the terms and conditions to continue.");
      return;
    }
    if (!/^07\d{8}$/.test(phone)) {
      setErrorMessage("Please enter a valid M-Pesa phone number starting with 07...");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://somawayapi.vercel.app/mpesa/${groupId}/stk-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setJoining(false); // Hide form
        setPhone(""); // Clear input
        setName(""); // Clear input
        setAcceptedTerms(false); // Reset terms

        // Store transaction details (including initial pending status)
        const newTransaction = {
          checkoutRequestID: data.data.CheckoutRequestID,
          status: "Pending M-Pesa Confirmation...", // Initial client-side status
          failReason: ""
        };
        setTransactionDetails(newTransaction);
        localStorage.setItem(`pendingMpesaTransaction_${groupId}`, JSON.stringify(newTransaction)); // Use group-specific key

      } else {
        setErrorMessage(data.error || "Failed to send payment prompt. Try again.");
        // If STK push initiation failed, set status to failed immediately
        setTransactionDetails({
          status: "Failed",
          failReason: data.error || "Failed to initiate STK push."
        });
        localStorage.removeItem(`pendingMpesaTransaction_${groupId}`); // Clear if initiation failed, use group-specific key
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error initiating payment. Please check your network connection.");
      setTransactionDetails({
        status: "Failed",
        failReason: "Network error during payment initiation."
      });
      localStorage.removeItem(`pendingMpesaTransaction_${groupId}`); // Clear if initiation failed, use group-specific key
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 pb-8 pt-4 bg-[var(--bg)]">
      {cardData.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border-2 border-[#1b1f1c] text-white flex flex-col"
        >
          <div className="p-5 flex flex-col flex-grow">

             <div className="flex items-center">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-16 h-16 md:h-24 md:w-24 lg:h-30 lg:w-30 rounded-xl object-cover object-center"
                />
                <h2 className="text-md md:text-lg pl-2 md:pl-4  pt-3 md:pt-6 font-bold">{item.title}</h2>
              </div>

            <p className="text-sm text-gray-300 mb-4">{item.desc}</p>

            {/* Cycle Status Display */}
            {cycleStatus && (
              <div className="text-sm text-gray-400 mb-4">
                <p>
                  Participants:{" "}
                  <strong>
                    {cycleStatus.currentParticipants.toLocaleString()} /{" "}
                    {cycleStatus.maxParticipants.toLocaleString()}
                  </strong>
                </p>
                <p>
                  Amount Stashed:{" "}
                  <strong>
                    KES {cycleStatus.currentAmount.toLocaleString()} /{" "}
                    {cycleStatus.maxParticipants.toLocaleString()}
                  </strong>
                </p>
                {cycleStatus.isMaxReached && (
                  <p className="text-red-400 font-semibold mt-2">
                    Maximum participants reached for this cycle! You will be added to the next group cycle.
                  </p>
                )}
              </div>
            )}

            {/* Error Message Display (for form validation/initial errors) */}
            {errorMessage && (
              <div className="bg-red-800 p-3 rounded-xl text-sm mb-4 text-center">
                {errorMessage}
              </div>
            )}

            {/* Transaction Status Display */}
            <AnimatePresence mode="wait">
              {transactionDetails && (
                <motion.div
                  key="transaction-status"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-xl text-sm mb-4 text-center font-semibold
                    ${transactionDetails.status === "Completed" ? "bg-green-700 text-white" : ""}
                    ${["Failed", "Cancelled", "Query_Failed_Internal", "Expired"].includes(transactionDetails.status) ? "bg-red-700 text-white" : ""}
                    ${transactionDetails.status.includes("Pending") || transactionDetails.status.includes("Processing") || transactionDetails.status.includes("Unknown") ? "bg-blue-700 text-white" : ""}
                  `}
                >
                  {transactionDetails.status === "Completed" && "✅ Transaction Completed Successfully! You are now part of the initiative."}
                  {["Failed", "Cancelled", "Query_Failed_Internal", "Expired"].includes(transactionDetails.status) && `❌ Transaction ${transactionDetails.status.replace(/_/g, ' ')}: ${transactionDetails.failReason}`}
                  {transactionDetails.status.includes("Pending") && "⏳ Awaiting M-Pesa confirmation. Please enter your PIN on your phone."}
                  {transactionDetails.status.includes("Processing") && "⌛ Processing your request..."}
                  {transactionDetails.status.includes("Unknown") && "⏳ Transaction status unknown. Please wait or check again later."}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Join Button */}
            {!joining && !transactionDetails && (
              <button
                onClick={handleJoinClick}
                className="mt-auto bg-[#020201] py-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
              >
                Join Now
              </button>
            )}

            <button
              onClick={handleShareToWhatsApp}
              className=" bg-[#020201] py-4 md:py-5 mt-3 md:mt-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
            >
              Invite friends
            </button>

            {/* Input Form */}
            <AnimatePresence>
              {joining && ( // Show form if joining is true
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3 mt-4"
                >
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow p-2 py-3 rounded-md bg-gradient-to-br from-[#070707ff] to-[#111] border border-[#1b1f1c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f36dff]"
                    maxLength={30} // Max length for name
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Enter M-Pesa number (e.g. 07XX...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-grow p-2 py-3 rounded-md bg-gradient-to-br from-[#070707ff] to-[#111] border border-[#1b1f1c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f36dff]"
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
          </div>
        </motion.div>
      ))}
    </div>
  );
}