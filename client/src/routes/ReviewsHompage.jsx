
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/ReviewsCategoriesScroll";
import Footer from "../components/Footer";
import SpinnerMini from "../components/Loader";
import PostList from "../components/PostList";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import ReviewPostList from "../components/ReviewPostLists";
import Navbar from "../components/ReviewsNavbar";
import { Plus } from "lucide-react"; // Importing the icon


const ReviewsHomePage = () => {

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

        <div>
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
       <Navbar/>
       <div className="px-3 pt-4 md:pt-6 md:px-[80px] ">
        <CategoriesScroll/>

     
  
<div className="flex flex-col justify-between items-center relative min-h-[75vh]">
  <ReviewPostList />
  <Link
    style={{ zIndex: 100004 }}
    to="/addlistingreview"
    className="p-4 md:px-8 md:py-3 bg-[var(--softTextColori)] text-[12px] md:text-[16px]
    fixed md:sticky bottom-[60px] md:bottom-[30px] md:left-1/2 md:-translate-x-1/2 
    right-2 md:right-auto rounded-full text-[var(--softBg)]
    shadow-md font-semibold flex items-center gap-2 hover:bg-[var(--textColor)]"
  >
    <Plus className="w-4 h-4 md:w-5 md:h-5" />
    <p className="hidden md:block">Review</p>
  </Link>
</div>
      
      </div>

       <Footer/>
       </div>

  
  </>

  );
};
export default ReviewsHomePage;



 
