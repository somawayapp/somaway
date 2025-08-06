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
    fetch("https://somawayapi.vercel.app/winner")
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
              <p><strong>Phone:</strong> {winner.phone}</p>
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
  <h3 className="text-lg font-semibold text-white">🔍 How the Winner is Selected?</h3>

  <p>
    Once exactly <strong>1,000,000 KES</strong> had been received from participants, the system automatically 
    selects a winner using a fair and transparent process that anyone can verify.
  </p>

  <p>
    Here's how it works:
    Each person’s phone number is turned into a secret code using a method called <code>SHA-256</code>. This keeps your
     number private, but still lets it be used in the draw.
  </p>

  <p>
    Those secret codes are then combined with details from your transaction — like the exact time you joined and the M-Pesa
     transaction ID, from all participants — and used to create a single <strong>public fingerprint</strong> (called a "seed"). This fingerprint is
      unique and impossible to predict ahead of time.
  </p>

  <p>
    This fingerprint is then used to give each participant a random score. The person with the <strong>lowest score</strong> is 
    selected as the winner.
  </p>

  <p>
    This process is <strong>100% fair and automatic</strong>. No human decides the winner. And because 
    everything is based on real data from the entries, anyone with access to that data can repeat the same 
    procces and verify the winner.
  </p>

  <p className="text-green-400">
    🔐 This means the draw is completely transparent, tamper-proof, and provable by anyone — even you.
  </p>
</div>
      <Footer />


      </div>

    </div>
  );
};

export default Winners;
