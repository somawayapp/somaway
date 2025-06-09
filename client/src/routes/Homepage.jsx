
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import BettingChances from "../components/Carddata";
import Sidebar from "../components/Sidebar";
import Sidebar2 from "../components/Sidebar2";
import HowToJoin from "../components/Howtojoin";
import Spinner from "../components/Spinner";
const HomePage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
    
  }, []);


  
  const location = useLocation(); 

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

       <div className="  overflow-x-none h-screen">
  <Helmet>
    <title>
      {cat && author 
        ? `${cat} Book Summary by ${author} | Unlock Key Insights`
        : cat
        ? `${cat} Book Summaries | Learn from the Best`
        : author
        ? `Book Summary by ${author} | Must-Read Summaries`
        : "Book Summaries"} | Hodi
    </title>
    <meta
      name="description"
      content={`Explore top book summaries in the ${cat || "self-growth"} category. Gain insights from ${
        author || "top authors"
      } in minutes. Elevate your mind—only on Hodi!`}
    />
    <link rel="canonical" href={`${window.location.href}`} />
  </Helmet>

  <div
    style={{ zIndex: 100004 }}
    className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs"
  >
    <div className="gap-2 md:gap-6 flex flex-row">
      <p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p>
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p>
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p>
    </div>
    <div className="gap-2 md:gap-6 flex flex-row">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Responsible playing</p>
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
    </div>
  </div>

  <Navbar />

<div className=""> {/* Remove fixed height here */}
  <div className="flex md:flex-row relative"> {/* Add relative to allow absolute child */}

    {/* Sidebar */}
    <div className="w-full hidden sticky top-[110px] md:block md:w-[23%] h-[calc(100vh-130px)] overflow-y-auto border-r-2 border-[#1b1f1c]">
      <Sidebar />
    </div>

    {/* Spinner in center, over both nav and cards */}
<div className="fixed left-1/2 top-18 transform -translate-x-1/2 z-[100006]">
  <Spinner />
</div>


    {/* Card List */}
    <div className="flex-1 md:px-8">
      <BettingChances />
      <HowToJoin />
      <div className="md:hidden">
        <Sidebar2 />
      </div>
      <Footer />
    </div>

    {/* Right Sidebar */}
    <div className="w-full hidden md:sticky md:top-[110px] md:block md:w-[23%] h-[calc(100vh-130px)] overflow-y-auto border-l-2 border-[#1b1f1c]">
      <Sidebar2 />
    </div>
  </div>
</div>


</div>



  
  </>

  );
};
export default HomePage;


    