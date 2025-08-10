import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Helmet } from "react-helmet";

const Winners = () => {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://shilingiapi.vercel.app/winner")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Just set the entire data object to state
        setApiData(data);
      })
      .catch((err) => {
        console.error("Error fetching winner:", err);
        setError(`Failed to fetch winner information: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
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
        <h1 className="text-3xl font-bold mb-4">🎉 Raw API Response</h1>

        {loading && <p className="text-gray-400">Loading API data...</p>}
        
        {/* Display error if present */}
        {!loading && error && <p className="text-red-500">{error}</p>}

        {/* Display the entire JSON object if it exists */}
        {!loading && !error && apiData && (
          <pre className="bg-[#141414] border border-gray-700 p-6 rounded-xl text-sm overflow-x-auto text-green-400">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Winners;