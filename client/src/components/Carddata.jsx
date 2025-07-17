import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cardData = [
  {
    imageSmall: "/shilingibanner.png",
    imageLarge: "/shilingibanner2.png",
    title: "Win Ksh 1 Million",
    desc: "Join a community-powered luck pool where everyone has a fair shot to win 1 million shillings by stashing only 1 shilling.",
  },
];

export default function BettingChances() {
  const [joining, setJoining] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cycleStatus, setCycleStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // General error message for user
  // transactionStatus can be null, 'Completed', 'Failed', 'Cancelled', 'Expired/NotFound'
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    const fetchCycleStatus = async () => {
      try {
        const res = await fetch("https://somaway.onrender.com/mpesa/cycle-status");
        const data = await res.json();
        if (data.success) {
          setCycleStatus(data);
        } else {
          console.error("Failed to fetch cycle status:", data.error);
          setErrorMessage("Failed to load cycle status. Please refresh.");
        }
      } catch (err) {
        console.error("Error fetching cycle status:", err);
        setErrorMessage("Network error fetching cycle status.");
      }
    };
    fetchCycleStatus();

    const intervalId = setInterval(fetchCycleStatus, 30000); // Every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Effect for polling the STK push status
  useEffect(() => {
    // Only poll if there's a checkoutRequestID and we haven't reached a final status
    if (checkoutRequestID && transactionStatus === null) {
      // Clear any existing interval to prevent multiple polls
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch("https://somaway.onrender.com/mpesa/query-stk-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkoutRequestID }),
          });
          const data = await res.json();

          if (data.success) {
            // Check if it's a final status (Completed, Failed, Cancelled, Expired/NotFound)
            // The backend should return 'Pending' if still processing, or a final status.
            if (data.dbStatus && data.dbStatus !== "Pending") {
              setTransactionStatus(data.dbStatus); // Update with 'Completed', 'Failed', 'Cancelled', etc.
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
              console.log("Polling stopped. Transaction is no longer pending:", data.dbStatus);

              if (data.dbStatus === "Completed") {
                setErrorMessage(""); // Clear error on success
              } else {
                // Set specific error for failed/cancelled states if available
                setErrorMessage(data.data?.ResultDesc || data.error || "Transaction failed or was cancelled.");
              }
            }
            // If data.dbStatus is 'Pending', do nothing, just keep polling.
          } else {
            console.warn("Polling query returned non-success:", data);
            // This catches immediate backend errors from `queryStkStatus`
            setTransactionStatus("Failed"); // Indicate a query failure or transaction failure
            setErrorMessage(data.error || "Failed to get transaction status. Please try again.");
            clearInterval(pollIntervalRef.current); // Stop polling on query failure
            pollIntervalRef.current = null;
          }
        } catch (err) {
          console.error("Error during STK status polling:", err);
          setErrorMessage("Network error while checking transaction status. Please check your connection.");
          setTransactionStatus("Failed"); // Indicate a network-related failure during polling
          clearInterval(pollIntervalRef.current); // Stop polling on critical network error
          pollIntervalRef.current = null;
        }
      }, 5000); // Poll every 5 seconds (adjust as needed)
    } else if (pollIntervalRef.current && transactionStatus !== null) {
      // If status is no longer null (i.e., it's a final status) or checkoutRequestID is cleared, stop polling
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    // Cleanup interval on component unmount or when checkoutRequestID/transactionStatus changes
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [checkoutRequestID, transactionStatus]); // Rerun when these states change

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
👉\n\n Shilingi yaweza kupa mamili. Visit:\nhttps://makesomaway.com ✨`;

    const url = `https://wa.me/?text=${encodeURIComponent(message + " ")}`;

    window.open(url, "_blank");
    localStorage.setItem("lastShared", Date.now().toString());
  };

  const handleJoinClick = () => {
    if (cycleStatus && cycleStatus.isMaxReached) {
      setErrorMessage("The maximum number of participants for this cycle has been reached.");
      return;
    }
    setJoining(true);
    setSubmitted(false); // Reset submitted state when showing form again
    setTransactionStatus(null); // Reset transaction status
    setCheckoutRequestID(null); // Reset CheckoutRequestID
    setErrorMessage(""); // Clear any previous errors before showing the form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setTransactionStatus(null); // Clear previous transaction status

    if (!phone || !name) {
      setErrorMessage("Name and phone number are required.");
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage("Please accept the terms and conditions to continue.");
      return;
    }

    // Validate phone number format
    if (!/^07\d{8}$/.test(phone)) {
      setErrorMessage("Please enter a valid M-Pesa phone number starting with 07...");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://somaway.onrender.com/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setJoining(false); // Hide form
        // setPhone(""); // Keep phone/name for potential retry if needed or clear them after final success
        // setName("");
        setAcceptedTerms(false); // Reset terms
        setCheckoutRequestID(data.data.CheckoutRequestID); // Store the CheckoutRequestID
        setErrorMessage(""); // Clear error if STK push was successfully initiated
        // Do NOT set transactionStatus to 'Pending' here. Keep it null,
        // so the polling useEffect starts and waits for a final status.
        // The UI will just show the form disappear.
      } else {
        // STK push initiation failed (e.g., duplicate entry, M-Pesa error)
        setErrorMessage(data.error || "Failed to send payment prompt. Try again.");
        setTransactionStatus("Failed"); // Indicate immediate failure to show the error message
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error initiating payment. Please check your network connection.");
      setTransactionStatus("Failed"); // Indicate network error failure
    } finally {
      setLoading(false);
    }
  };

  // Determine if the join button should be visible
  const showJoinButton = !joining && !submitted && cycleStatus && !cycleStatus.isMaxReached && transactionStatus === null;

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
          <img
            src={item.imageSmall}
            alt={item.title}
            className="w-full h-full md:hidden object-cover object-center hover:scale-102 transition-transform duration-300"
          />

          <img
            src={item.imageLarge}
            alt={item.title}
            className="w-full h-full hidden lg:block object-cover object-center hover:scale-102 transition-transform duration-300"
          />

          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
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
                    Maximum participants reached for this cycle!
                  </p>
                )}
              </div>
            )}

            {/* General Error Message Display (only if no transaction status is showing) */}
            {errorMessage && transactionStatus === null && !joining && (
                 <div className="bg-red-800 p-3 rounded-xl text-sm mb-4 text-center">
                    {errorMessage}
                 </div>
            )}


            {/* Transaction Status Messages - ONLY show final outcomes */}
            <AnimatePresence mode="wait">
              {transactionStatus === "Completed" && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-800 p-4 rounded-xl text-sm mt-4 text-center"
                >
                  🎉 **Congratulations!** Your payment of 1 KES to Shilingi was successful.
                  <br />
                  Your entry has been added to the cycle. Good luck!
                </motion.div>
              )}

              {(transactionStatus === "Failed" ||
                transactionStatus === "Cancelled" ||
                transactionStatus === "Expired/NotFound") && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-800 p-4 rounded-xl text-sm mt-4 text-center"
                >
                  ❌ **Payment Failed.**
                  <br />
                  {errorMessage || "There was an issue processing your payment. Please try again."}
                  {/* You can add a button to retry here */}
                  <button
                    onClick={() => {
                        setSubmitted(false);
                        setJoining(true); // Bring back the form
                        setTransactionStatus(null);
                        setErrorMessage("");
                        setCheckoutRequestID(null);
                    }}
                    className="mt-2 text-white bg-red-600 hover:bg-red-700 py-1 px-3 rounded"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Join Button - Only show if conditions are met and no final transaction status is displayed */}
            {showJoinButton && (
              <button
                onClick={handleJoinClick}
                className="mt-auto bg-[#020201] py-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
              >
                Join Now
              </button>
            )}

            {/* Message when max is reached and not joining */}
            {!joining && !submitted && cycleStatus && cycleStatus.isMaxReached && (
              <p className="text-center text-red-400 font-semibold mt-auto p-4 border border-red-500 rounded-xl">
                The maximum number of participants for this cycle has been reached. Please check back for the next cycle!
              </p>
            )}

            <button
              onClick={handleShareToWhatsApp}
              className="bg-[#020201] py-4 md:py-5 mt-3 md:mt-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
            >
              Invite friends
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
                  className="flex flex-col gap-3 mt-4"
                >
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f36dff]"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Enter M-Pesa number (e.g. 07XX...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f36dff]"
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