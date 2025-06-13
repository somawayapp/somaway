import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import HowToJoin from "../components/Howtojoin";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BettingChances from "../components/Carddata";
import Sidebar from "../components/Sidebar";
import Sidebar2 from "../components/Sidebar2";
import Spinner from "../components/Spinner";


const HomePage = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(true); // Control Spinner

  useEffect(() => {
    window.scrollTo(0, 0);

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  const params = new URLSearchParams(location.search);
  const sort = params.get("sort");
  const author = params.get("author");
  const search = params.get("search");
  const cat = params.get("cat");

  const displayText = [
    search ? `Search: ${search}` : "",
    sort ? `Sort: ${sort}` : "",
    author ? `Author: ${author}` : "",
    cat ? `Category: ${cat}` : "",
  ]
    .filter(Boolean)
    .join(" | ") || "All summaries";

  return (
    <>
      <Helmet>
        <title>
          {cat && author
            ? `${cat} Book Summary by ${author} | Unlock Key Insights`
            : cat
            ? `${cat} Book Summaries | Learn from the Best`
            : author
            ? `Book Summary by ${author} | Must-Read Summaries`
            : "Book Summaries"}{" "}
          | Hodi
        </title>
        <meta
          name="description"
          content={`Explore top book summaries in the ${cat || "self-growth"} category. Gain insights from ${
            author || "top authors"
          } in minutes. Elevate your mind—only on Hodi!`}
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="bg-[var(--bg)] min-h-screen overflow-x-hidden">
        {/* Top Links Bar */}
        <div className="md:px-[5%] px-4 sticky top-0 z-[100004] bg-[var(--bg)] flex justify-between py-4 text-xs">
          <div className="flex gap-2 md:gap-6">
            <p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p>
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p>
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p>
          </div>
          <div className="flex gap-2 md:gap-6">
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Responsible playing</p>
            <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
          </div>
        </div>

     
      </div>
    </>
  );
};

export default HomePage;
