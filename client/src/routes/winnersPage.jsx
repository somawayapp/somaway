import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Helmet } from "react-helmet";

const Winners = () => {
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://somawayapi.vercel.app/mpesa/cycle-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setWinner(data.winner);
        else setError("No winner has been selected yet.");
      })
      .catch(() => setError("Failed to fetch winner. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-3xl font-bold mb-4">🎉 Winner Announcement</h1>

        {loading && <p>Loading winner information...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {winner && (
          <div className="bg-[#141414] border border-gray-700 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-green-400">🏆 Cycle {winner.cycle} Winner</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {winner.name}</p>
              <p><strong>Phone (Encrypted):</strong> {winner.phone}</p>
              <p><strong>Amount Sent:</strong> {winner.amount} KES</p>
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

        <div className="mt-10 space-y-4 text-sm text-gray-300">
          <h3 className="text-lg font-semibold text-white">🔍 How Was the Winner Selected?</h3>
          <p>
            Once we received <strong>exactly 1,000,000 KES</strong> in contributions from participants, we triggered a verifiable winner selection process.
          </p>
          <p>
            Each participant's phone number was hashed using <code>SHA-256</code>. Then, each hash was combined with a fixed public randomness seed sourced from a verifiable and publicly visible source (e.g. Bitcoin block hash).
          </p>
          <p>
            From the resulting combined hashes, we converted each to a number and picked the entry with the <strong>lowest number</strong>. This process is fully deterministic, meaning anyone with the data can reproduce and verify the winner selection independently.
          </p>
          <p className="text-green-400">
            🔐 This ensures fairness, transparency, and zero manipulation.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Winners;
