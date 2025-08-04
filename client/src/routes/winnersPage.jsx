import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Assuming this is your primary Navbar
import Footer from "../components/Footer";
import Link from "next/link";
import { Helmet } from "react-helmet";
import axios from "axios"; // For making API requests

const Winners = () => {
  const [latestWinner, setLatestWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestWinner = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/mpesa/winners/latest"); // Adjust API route if needed
        if (response.data.success) {
          setLatestWinner(response.data.winner);
        } else {
          setError(response.data.message || "Failed to fetch latest winner.");
        }
      } catch (err) {
        console.error("Error fetching latest winner:", err);
        setError("Could not connect to the server to fetch winner information.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestWinner();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Shilingi: Winners - See Our Lucky Participants</title>
        <meta
          name="description"
          content="Discover the latest winners on Shilingi. Our transparent and verifiable random selection ensures fairness. See who won the current cycle!"
        />
        <meta
          name="keywords"
          content="shilingi winners, lottery winners, draw results, transparent winner, verifiable winner, prize payout, community rewards, lucky winner, past winners, shilingi cycle, random selection"
        />
      </Helmet>

      {/* This seems to be a custom top bar, consider consolidating with Navbar */}
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
          <Link href="/participate"> {/* Renamed from /help for clarity */}
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Participate</p>
          </Link>
          <Link href="/help">
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
          </Link>
        </div>
      </div>

      <Navbar /> {/* Your main Navbar component */}

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[50px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--textColor)] mb-8 text-center">
          Our Lucky Winners!
        </h1>

        {loading && (
          <p className="text-center text-lg">Loading latest winner information...</p>
        )}

        {error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

        {!loading && !error && !latestWinner && (
          <p className="text-center text-lg">No winner has been selected yet for the current cycle. Stay tuned!</p>
        )}

        {!loading && !error && latestWinner && (
          <div className="bg-[var(--softBg)] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--textColor)]">Latest Winner - Cycle {latestWinner.cycle}</h2>
            <p className="text-lg">
              **Name:** {latestWinner.name} (Partial view for privacy: {latestWinner.name.slice(0, 3)}...{latestWinner.name.slice(-2)})
            </p>
            <p className="text-lg">
              **Phone:** {latestWinner.phone.slice(0, 6)}XXXX (Partial view for privacy)
            </p>
            <p className="text-lg">
              **Amount Won:** KES {latestWinner.amountWon}
            </p>
            <p className="text-sm text-[var(--softTextColori)] mt-2">
              Draw Date: {new Date(latestWinner.timestamp).toLocaleString()}
            </p>

            <div className="mt-6 border-t border-[var(--borderColor)] pt-4">
              <h3 className="text-xl font-semibold mb-3 text-[var(--textColor)]">Transparency & Auditability</h3>
              <p className="text-base">
                The winner for this cycle was selected using a verifiable random process. You can audit the selection by providing the Cycle ID below to see the exact public randomness (Bitcoin Block Hash) used and the anonymized participant data snapshot.
              </p>
              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <p className="bg-[var(--softBg)] p-3 rounded-md text-base break-words flex-1">
                  <span className="font-semibold text-[var(--textColor)]">Public Seed (Bitcoin Block Hash):</span> <br/>
                  <code className="text-[var(--softTextColori)]">{latestWinner.publicRandomSeed || "N/A"}</code> {/* Public seed from winner object, though not explicitly returned in /latest yet. Add it in API */}
                </p>
                {/* Link to a dedicated audit page or a modal that fetches audit data */}
                <Link href={`/audit/${latestWinner.cycle}`} passHref>
                  <button className="bg-[#f36dff] text-white px-6 py-3 rounded-lg hover:bg-[#d045e0] transition-colors self-start md:self-center">
                    Verify this Draw
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* You can add a section for "Past Winners" here by fetching all winners */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--textColor)] text-center">Past Winners (Coming Soon!)</h2>
          <p className="text-center text-[var(--softTextColor)]">
            We'll list all previous cycle winners here soon. Each draw is fully auditable for transparency!
          </p>
        </div>


        <Footer />
      </div>
    </div>
  );
};

export default Winners;