import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Helmet } from "react-helmet";

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://shilingiapi.vercel.app/winner")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.winners)) {
            setWinners(data.winners);
          } else if (data.winner) {
            setWinners([data.winner]);
          }
        }
      })
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

        {!loading && winners.length > 0 && winners.map(w => (
          <li key={w._id}>
            <div className="bg-[#141414] border border-gray-700 p-6 rounded-xl shadow-md space-y-4">
              <h2 className="text-xl font-semibold text-green-400">
                🏆 Cycle {w.cycle} Winner
              </h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {w.name}</p>
                <p><strong>Phone:</strong> {w.phone}</p>
                <p><strong>Amount Sent:</strong> {w.amount} KES</p>
                <p><strong>MPESA Receipt:</strong> {w.mpesaReceiptNumber || "N/A"}</p>
                <p><strong>Transaction ID:</strong> {w.transactionId || "N/A"}</p>
                <p><strong>Date Won:</strong> {new Date(w.winDate).toLocaleString()}</p>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <p><strong>🔐 Public Random Seed:</strong></p>
                <code className="block break-words text-xs text-pink-400 mt-1">
                  {w.publicRandomSeed}
                </code>
              </div>
            </div>
          </li>
        ))}

        {!loading && winners.length === 0 && (
          <p className="text-red-500">No winners yet.</p>
        )}

        <div className="mt-10 space-y-4 text-sm text-gray-300">
          <h3 className="text-lg font-semibold text-white">🔍 How the Winner is Selected?</h3>
          <p>
            Once exactly <strong>1,000,000 KES</strong> has been received from participants, the system automatically 
            selects a winner using a fair and transparent process that anyone can verify.
          </p>
          <p>
            Here's how it works:
            Each person’s phone number is turned into a secret code using <code>SHA-256</code>.
          </p>
          <p>
            Those codes are combined with transaction details to create a unique <strong>public fingerprint</strong>.
          </p>
          <p>
            That fingerprint assigns each participant a random score. The lowest score wins.
          </p>
          <p>
            This process is <strong>100% fair and automatic</strong>.
          </p>
          <p className="text-green-400">
            🔐 This means the draw is completely transparent, tamper-proof, and provable by anyone.
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Winners;
