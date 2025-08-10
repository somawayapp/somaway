import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Assuming these paths are correct for your project
import Footer from "../components/Footer"; // Assuming these paths are correct for your project
import Link from "next/link"; // Assuming you are using Next.js
import { Helmet } from "react-helmet"; // Assuming you have react-helmet installed

const Winners = () => {
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Correct API endpoint based on your previous messages
    fetch("https://shilingiapi.vercel.app/winner")
      .then((res) => {
        if (!res.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Log the data to the console for debugging
        console.log("API Response Data:", data);

        // Check if data.success is true AND if data.winners is an array with at least one entry
        if (data.success && Array.isArray(data.winners) && data.winners.length > 0) {
          // Sort the winners by winDate in descending order to get the latest one
          const latestWinner = data.winners.sort((a, b) => new Date(b.winDate) - new Date(a.winDate))[0];
          setWinner(latestWinner);
        } else {
          // If no winners, or the structure isn't as expected
          setError("No winner has been selected yet. Stay tuned for the next cycle!");
        }
      })
      .catch((err) => {
        // Catch network errors or errors thrown from .then block
        console.error("Error fetching winner:", err);
        setError(`Failed to fetch winner information: ${err.message}. Please try again later.`);
      })
      .finally(() => {
        setLoading(false); // Always stop loading, regardless of success or error
      });
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <Helmet>
        <title>Shilingi: Every Shilling Counts - Bringing Back the Value of a Shilling</title>
        <meta
          name="description"
          content="Shilingi is a fun and trusted micro-contribution and reward platform. Toss in your little bit to make a big difference, empower communities, and stand a chance to change lives. Built on transparency and teamwork."
        />
        <meta
          name="keywords"
          content="micro-contribution, community empowerment, reward platform, shilingi, crowdfunding, social giving, collective impact, small contributions, big difference, trust, transparency, teamwork, fun contributions, life-changing, community building, digital giving, peer-to-peer giving, grassroots funding, shared prosperity, collective action, social impact, online community, mutual support, participation, financial inclusion, digital rewards, community fund, easy giving, secure contributions, positive change"
        />
      </Helmet>

      {/* Sticky header/navigation */}
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

      <Navbar />

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[50px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-3xl font-bold mb-4">🎉 Latest Winner Announcement</h1>

        {loading && <p className="text-gray-400">Loading winner information...</p>}

        {/* Display error message if there's an error and not loading */}
        {!loading && error && <p className="text-red-500">{error}</p>}

        {/* Display winner information if 'winner' state is populated */}
        {!loading && !error && winner && (
          <div className="bg-[#141414] border border-gray-700 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-green-400">🏆 Cycle {winner.cycle} Winner</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {winner.name}</p>
              <p><strong>Phone:</strong> {winner.phone}</p>
              <p><strong>Amount Contributed:</strong> {winner.amount} KES</p>
              {/* Using optional chaining for properties that might be missing */}
              <p><strong>MPESA Receipt:</strong> {winner.mpesaReceiptNumber || "N/A"}</p>
              <p><strong>Transaction ID:</strong> {winner.transactionId || "N/A"}</p>
              <p><strong>Date Won:</strong> {new Date(winner.winDate).toLocaleString()}</p>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p><strong>🔐 Public Random Seed:</strong></p>
              <code className="block break-words text-xs text-pink-400 mt-1">{winner.publicRandomSeed}</code>
            </div>
          </div>
        )}

        {/* How the Winner is Selected section */}
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
      <Footer />
    </div>
  );
};

export default Winners;