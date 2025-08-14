// Winners.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Adjust path if necessary
import Footer from "../components/Footer"; // Adjust path if necessary
import Link from "next/link"; // Required if you are using Next.js for routing
import { Helmet } from "react-helmet"; // Required if you are using react-helmet for SEO

const Winners = () => {
  const [latestWinner, setLatestWinner] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        setLoading(true); // Ensure loading is true at the start of fetch
        setError(null); // Clear any previous errors

        const res = await fetch("https://somawayapi.vercel.app/winner");

        if (!res.ok) {
          // If the HTTP response is not ok (e.g., 404, 500)
          const errorText = await res.text(); // Get response body for more detail
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
        }

        const data = await res.json();

        // Check the 'success' flag and if 'winners' array exists and is not empty
        if (data.success && Array.isArray(data.winners) && data.winners.length > 0) {
          // Sort the winners by winDate to find the latest one
          // Dates like "2025-08-10T18:27:09.254Z" are ISO strings and can be directly compared
          const sortedWinners = data.winners.sort((a, b) => {
            return new Date(b.winDate).getTime() - new Date(a.winDate).getTime();
          });
          setLatestWinner(sortedWinners[0]); // Set the first element (latest)
        } else if (data.success === false && data.message) {
          // Handle the specific API response for no winners yet
          setLatestWinner(null); // Ensure no previous winner is displayed
          setError(data.message);
        } else {
          // Fallback for unexpected but successful API responses (e.g., empty 'winners' array but success: true)
          setLatestWinner(null);
          setError("No winner has been selected yet. Stay tuned!");
        }
      } catch (err) {
        console.error("Failed to fetch winner data:", err);
        // Display a user-friendly error message
        setError(`Failed to retrieve winner information: ${err.message}. Please try again later.`);
      } finally {
        setLoading(false); // Always set loading to false after the fetch attempt
      }
    };

    fetchWinner();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div>
      <Helmet>
        <title>Shilingi: Latest Winner Announcement</title>
        <meta
          name="description"
          content="Shilingi's latest winner announcement. Find out how winners are selected on our transparent micro-contribution and reward platform."
        />
        <meta
          name="keywords"
          content="shilingi winner, latest winner, micro-contribution winner, reward platform, transparent winner selection, community empowerment, crowdfunding, social giving"
        />
      </Helmet>

      {/* Sticky top navigation/info bar */}
      <div
        style={{ zIndex: 100004 }}
        className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs"
      >
        <div className="gap-2 md:gap-6 flex flex-row">
          <Link href="/"><p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p></Link>
          <Link href="/terms"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p></Link>
          <Link href="/about"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p></Link>
        </div>
        <div className="gap-2 md:gap-6 flex flex-row">
          <Link href="/help"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Participate</p></Link>
          <Link href="/help"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p></Link>
        </div>
      </div>

      <Navbar /> {/* Your main navigation component */}

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[50px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-3xl font-bold mb-4">🎉 Latest Winner Announcement</h1>

        {loading && <p className="text-gray-400">Loading winner information...</p>}

        {/* Display error message if there's an error */}
        {!loading && error && (
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        )}

        {/* Display winner information if we have a winner and no active error */}
        {!loading && !error && latestWinner && (
          <div className="bg-[#141414] border border-gray-700 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-green-400">
              🏆 Cycle {latestWinner.cycle} Winner
            </h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {latestWinner.name}</p>
              <p><strong>Phone:</strong> {latestWinner.phone}</p>
              <p><strong>Amount Contributed:</strong> {latestWinner.amount} KES</p>
              <p><strong>MPESA Receipt:</strong> {latestWinner.mpesaReceiptNumber || "N/A"}</p>
              <p><strong>Transaction ID:</strong> {latestWinner.transactionId || "N/A"}</p>
              <p>
                <strong>Date Won:</strong>{" "}
                {new Date(latestWinner.winDate).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p><strong>🔐 Public Random Seed:</strong></p>
              <code className="block break-words text-xs text-pink-400 mt-1">
                {latestWinner.publicRandomSeed}
              </code>
            </div>
          </div>
        )}

        {/* Section explaining how the winner is selected */}
        <div className="mt-10 space-y-4 text-sm text-gray-300">
          <h3 className="text-lg font-semibold text-white">🔍 How the Winner is Selected?</h3>

          <p>
            Once exactly **1,000,000 KES** has been received from participants, the system automatically
            selects a winner using a fair and transparent process that anyone can verify.
          </p>

          <p>
            Here's how it works:
            Each person’s phone number is turned into a secret code using a method called `SHA-256`. This keeps your
            number private, but still lets it be used in the draw.
          </p>

          <p>
            Those secret codes are then combined with details from your transaction — like the exact time you joined and the M-Pesa
            transaction ID, from all participants — and used to create a single **public fingerprint** (called a "seed"). This fingerprint is
            unique and impossible to predict ahead of time.
          </p>

          <p>
            This fingerprint is then used to give each participant a random score. The person with the **lowest score** is
            selected as the winner.
          </p>

          <p>
            This process is **100% fair and automatic**. No human decides the winner. And because
            everything is based on real data from the entries, anyone with access to that data can repeat the same
            process and verify the winner.
          </p>

          <p className="text-green-400">
            🔐 This means the draw is completely transparent, tamper-proof, and provable by anyone — even you.
          </p>
        </div>
      </div>
      <Footer /> {/* Your footer component */}
    </div>
  );
};

export default Winners;