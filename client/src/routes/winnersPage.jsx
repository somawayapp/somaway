import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Helmet } from "react-helmet";
import axios from "axios"; // Import axios for fetching data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const CURRENT_DISPLAY_CYCLE = 1; // The cycle number you want to display

const Winners = () => {
  const [winnerData, setWinnerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/winner/${CURRENT_DISPLAY_CYCLE}`);
        if (response.data.success) {
          setWinnerData(response.data.winner);
        } else {
          setError(response.data.error || "Failed to fetch winner data.");
        }
      } catch (err) {
        console.error("Error fetching winner:", err);
        setError("Could not connect to the server or fetch winner details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWinner();

    // Optional: Poll for winner if not immediately available (e.g., cycle just completed)
    // You might want to poll more frequently if a winner is expected soon, then less often.
    // Be mindful of server load with polling.
    // const pollInterval = setInterval(fetchWinner, 30000); // Poll every 30 seconds
    // return () => clearInterval(pollInterval); // Cleanup on unmount
  }, [CURRENT_DISPLAY_CYCLE]);

  return (
    <div>
      <Helmet>
        <title>Shilingi: Winners - See Who Won!</title>
        <meta
          name="description"
          content="Discover the lucky winners of the Shilingi micro-contribution cycles. Transparency, community impact, and life-changing rewards."
        />
        <meta
          name="keywords"
          content="shilingi winners, jackpot, prize, community fund winner, transparent selection, verifiable winner, lucky winner, micro-contribution rewards"
        />
      </Helmet>

      <div
        style={{ zIndex: 100004 }}
        className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs"
      >
        <div className="gap-2 md:gap-6 flex flex-row">
          <Link href="/">
            <p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p>
          </Link>
          <Link href="/terms">
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p>
          </Link>
          <Link href="/about">
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p>
          </Link>
        </div>
        <div className="gap-2 md:gap-6 flex flex-row">
          <Link href="/help">
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Participate</p>
          </Link>
          <Link href="/help">
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
          </Link>
        </div>
      </div>

      <Navbar />

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[50px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--textColor)] text-center">
          Shilingi Winners Circle
        </h1>
        <p className="text-center text-lg">
          Meet the lucky individuals who have won big by contributing small!
        </p>

        <h2 className="text-2xl font-semibold text-[var(--textColor)] pt-8">
          Winner for Cycle {CURRENT_DISPLAY_CYCLE}
        </h2>

        {isLoading && (
          <p className="text-center text-lg">Loading winner details...</p>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-md text-center">
            <p>{error}</p>
            {error.includes("No winner found") && (
              <p className="mt-2">The winner for this cycle might not have been selected yet. Check back soon!</p>
            )}
          </div>
        )}

        {!isLoading && !error && winnerData && (
          <div className="bg-[var(--softBg)] p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold text-[var(--textColor)]">
              Congratulations!
            </p>
            <p className="mt-2 text-xl">
              <span className="font-semibold">Winner Name:</span> {winnerData.name}
            </p>
            <p className="mt-1 text-xl">
              <span className="font-semibold">Phone Number:</span> {winnerData.phonePartial}
            </p>
            <p className="mt-1 text-xl">
              <span className="font-semibold">Amount Won:</span> KES {winnerData.amountWon.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-[var(--softTextColori)]">
              Selected on: {new Date(winnerData.selectionTimestamp).toLocaleString()}
            </p>
            <p className="mt-4 text-sm text-[var(--softTextColori)]">
              Public Random Seed (for audit): <code className="break-all text-[var(--textColor)]">{winnerData.publicRandomSeed}</code>
            </p>
            <p className="mt-2 text-sm">
              <Link href="/audit" className="text-[#f36dff] hover:underline">
                Learn how to verify the winner selection process.
              </Link>
            </p>
          </div>
        )}

        {!isLoading && !error && !winnerData && (
          <div className="bg-[var(--softBg)] p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg">No winner found for Cycle {CURRENT_DISPLAY_CYCLE} yet.</p>
            <p className="mt-2">The selection process will begin once {MAX_PARTICIPANTS.toLocaleString()} participants are reached.</p>
            <p className="mt-2">Check the <Link href="/" className="text-[#f36dff] hover:underline">homepage</Link> for current progress.</p>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Winners;