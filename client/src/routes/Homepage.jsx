
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import BettingChances from "../components/Carddata";
import Sidebar from "../components/Sidebar";
import Sidebar2 from "../components/Sidebar2";
import HowToJoin from "../components/Howtojoin";
import Spinner from "../components/Spinner";
import BettingGroups from "../components/Cards";
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

       <div className="  overflow-x-none ">
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
       <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Participate </p>
     </Link>
    <Link href="/help">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
    </Link>
  </div>
</div>

  <Navbar />


<div className=""> 



  <div className="flex md:flex-row relative"> 

    {/* Sidebar */}

    <div className="w-full hidden sticky top-[110px] md:block md:w-[22%] h-[calc(98vh)] overflow-y-auto border-r-2 border-[#1b1f1c]">
      <Sidebar />
    </div>

    {/* Spinner in center, over both nav and cards */}
<div style={{ zIndex: 100015, }}  className="fixed left-1/2 top-[100px] transform -translate-x-1/2 ">
  <Spinner />
</div>


    {/* Card List */}
    <div className="flex-1 md:px-8">
      <div className="md:pr-[5%]">

     <BettingGroups />

      <HowToJoin />
    
      <div className="md:hidden">
        <Sidebar2 />
      </div>
      <Footer />
            </div>

    </div>

  
  </div>
</div>


</div>



  
  </>

  );
};
export default HomePage;


    