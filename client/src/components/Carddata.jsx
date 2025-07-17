// components/BettingChances.jsx
import React, { useState, useEffect, useRef } from "react"; // Import useRef
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
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(""); // New state for transaction status
  const [failReason, setFailReason] = useState(""); // New state for fail reason
  const [currentCheckoutRequestID, setCurrentCheckoutRequestID] = useState(null); // Store CheckoutRequestID
  const statusCheckIntervalRef = useRef(null); // Ref for interval ID


  useEffect(() => {
    // Fetch cycle status on component mount
    const fetchCycleStatus = async () => {
      try {
        const res = await fetch("https://somaway.onrender.com/mpesa/cycle-status");
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

    // Optionally, refetch status periodically if you want real-time updates without page refresh
    const intervalId = setInterval(fetchCycleStatus, 30000); // Every 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Effect to continuously check transaction status if currentCheckoutRequestID is set
  useEffect(() => {
    if (currentCheckoutRequestID && transactionStatus !== "Completed" && transactionStatus !== "Failed") {
      // Clear any existing interval to prevent multiple intervals running
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }

      const checkStatus = async () => {
        try {
          const res = await fetch("https://somaway.onrender.com/mpesa/query-stk-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkoutRequestID: currentCheckoutRequestID }),
          });
          const data = await res.json();

         if (data.success) {
           setTransactionStatus(data.dbStatus);

               if (["Failed", "Cancelled", "Query_Failed"].includes(data.dbStatus)) {
          setFailReason(data.data?.ResultDesc || data.error || "Unknown error occurred.");
           clearInterval(statusCheckIntervalRef.current);
               } else if (data.dbStatus === "Completed") {
             clearInterval(statusCheckIntervalRef.current);
             }
          } else if (data.pending) {
          setTransactionStatus("Still processing..."); // Optional status
         // Don't clear the interval — allow it to keep checking
         } else {
            setTransactionStatus("Failed");
            setFailReason(data.error || "Failed to retrieve transaction status from server.");
              clearInterval(statusCheckIntervalRef.current);
             }

        } catch (error) {
          console.error("Error checking STK status:", error);
          setTransactionStatus("Failed");
          setFailReason("Network error during status check. Please check your connection.");
          clearInterval(statusCheckIntervalRef.current);
        }
      };

      // Start polling for status
      statusCheckIntervalRef.current = setInterval(checkStatus, 5000); // Poll every 5 seconds

      // Initial check immediately
      checkStatus();

      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => {
        if (statusCheckIntervalRef.current) {
          clearInterval(statusCheckIntervalRef.current);
        }
      };
    } else {
      // Clear interval if no longer needed (e.g., currentCheckoutRequestID becomes null, or status is final)
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    }
  }, [currentCheckoutRequestID, transactionStatus]); // Re-run when these change

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
    setErrorMessage("");
    setTransactionStatus(""); // Clear previous transaction status
    setFailReason(""); // Clear previous fail reason
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setTransactionStatus(""); // Reset status on new submission
    setFailReason(""); // Reset fail reason on new submission

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
    setTransactionStatus("Processing..."); // Set initial status to processing
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
        setPhone(""); // Clear input
        setName(""); // Clear input
        setAcceptedTerms(false); // Reset terms
        setCurrentCheckoutRequestID(data.data.CheckoutRequestID); // Store this for status checking
        setTransactionStatus("Pending M-Pesa Confirmation..."); // Update status to pending
      } else {
        setErrorMessage(data.error || "Failed to send payment prompt. Try again.");
        setTransactionStatus("Failed");
        setFailReason(data.error || "Failed to initiate STK push.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error initiating payment. Please check your network connection.");
      setTransactionStatus("Failed");
      setFailReason("Network error during payment initiation.");
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

            {/* Error Message Display (for form validation/initial errors) */}
            {errorMessage && (
              <div className="bg-red-800 p-3 rounded-xl text-sm mb-4 text-center">
                {errorMessage}
              </div>
            )}

            {/* Transaction Status Display */}
            <AnimatePresence mode="wait">
              {transactionStatus && (
                <motion.div
                  key="transaction-status"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-xl text-sm mb-4 text-center font-semibold
                    ${transactionStatus === "Completed" ? "bg-green-700 text-white" : ""}
                    ${transactionStatus === "Failed" || transactionStatus === "Cancelled" || transactionStatus === "Query_Failed" ? "bg-red-700 text-white" : ""}
                    ${transactionStatus === "Processing..." || transactionStatus === "Pending M-Pesa Confirmation..." ? "bg-blue-700 text-white" : ""}
                  `}
                >
                  {transactionStatus === "Completed" && "✅ Transaction Completed Successfully!"}
                  {transactionStatus === "Failed" && `❌ Transaction Failed: ${failReason}`}
                  {transactionStatus === "Cancelled" && `❌ Transaction Cancelled: ${failReason}`}
                  {transactionStatus === "Query_Failed" && `⚠️ Status Query Failed: ${failReason}`}
                  {transactionStatus === "Processing..." && "⌛ Processing your request..."}
                  {transactionStatus === "Pending M-Pesa Confirmation..." &&
                    "⏳ Awaiting M-Pesa confirmation. Please enter your PIN on your phone."}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Join Button */}
            {!joining && !submitted && cycleStatus && !cycleStatus.isMaxReached && (
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
              className=" bg-[#020201] py-4 md:py-5 mt-3 md:mt-4 hover:bg-[#0e0e06] text-[#EBD402] rounded-2xl font-semibold w-full hover:scale-102 transition-transform duration-200"
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

            {/* Confirmation Message (Replaced by transaction status display) */}
            {/* Keeping this here commented out in case you prefer the old way for completed, but the new status display handles it */}
            {/* <AnimatePresence>
              {submitted && transactionStatus === "Pending M-Pesa Confirmation..." && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-800 p-4 rounded-xl text-sm mt-4"
                >
                  ✅ A prompt has been sent to <strong>{phone}</strong>. Please confirm
                  the payment of <strong>1 KES</strong> to{" "}
                  <strong>Shilingi</strong> via M-Pesa and enter your PIN to
                  complete the transaction.
                  <br />
                  Your contribution will now be added to the stash and you’ll appear
                  on the leaderboard as <strong>{name}</strong>!
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </motion.div>
      ))}
    </div>
  );
}