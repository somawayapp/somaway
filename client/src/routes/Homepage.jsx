
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/CategoriesScroll";
import Footer from "../components/Footer";
import Navbar from "../components/navbar2";
import SpinnerMini from "../components/Loader";
import PostList from "../components/PostList";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import ReviewPostList from "../components/ReviewPostLists";


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

     
  

      <div className="flex  flex-col justify-between">
       <ReviewPostList />
      </div>
      </div>

       <Footer/>
       </div>

  
  </>

  );
};
export default HomePage;



 
