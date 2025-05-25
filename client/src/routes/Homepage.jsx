
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PostList from "../components/PostList";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";

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

        <div className="no-scrollbar">
<Helmet>
<title>
  {cat && author 
    ? `${cat} Book Summary by ${author} | Unlock Key Insights`   : cat  ? `${cat} Book Summaries | Learn from the Best` 
      : author  ? `Book Summary by ${author} | Must-Read Summaries`  : 'Book Summaries'} | Hodi
</title>

<meta name="description"   content={` Explore top book summaries in the ${cat || 'self-growth'} category. Gain insights 
from ${author || 'top authors'}in minutes. Elevate your mind—only on Hodi!`} />
  
  <link rel="canonical" href={`${window.location.href}`} />
  
</Helmet>
       <div style={{ zIndex: 100004, }} className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs ">
       <div className="gap-2 md:gap-6 flex flex-row">
           <p className=" text-[#f2f2f2] hover:text-[#1ff8b0] transition cursor-pointer "> Sports</p>              
            <p className="text-[var(--softTextColori)] hover:text-[#1ff8b0] transition cursor-pointer"> Fantasy</p>              
             <p className="text-[var(--softTextColori)] hover:text-[#1ff8b0] transition cursor-pointer" > Casinos</p>              

       </div>
       <div className="gap-2 md:gap-6 flex flex-row">
            <p className="text-[var(--softTextColori)] hover:text-[#1ff8b0] transition cursor-pointer"> Responsible gambling</p>              
             <p className="text-[var(--softTextColori)] hover:text-[#1ff8b0] transition cursor-pointer" > Help</p>              

       </div>
       </div>
       <Navbar/>
   

      

       <div className="md:px-[5%] px-4">
       

  
  
<div className="flex flex-col md:flex-row h-[70vh]">
  <Sidebar />
  <div className="flex-1 ml-0 md:ml-[16%] h-[70vh] overflow-y-auto px-4 md:px-8">
    <PostList />
    <Footer />
  </div>
</div>



       </div>        </div>


  
  </>

  );
};
export default HomePage;



 

 
