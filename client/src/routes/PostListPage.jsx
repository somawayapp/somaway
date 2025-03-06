
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/CategoriesScroll";
import Discover from "../components/Discover";
import Footer from "../components/Footer";
import Navbar from "../components/navbar2";
import PopularPosts from "../components/PopularPosts";

const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation(); // Get the current location object

  // Use URLSearchParams to extract query parameters from the URL
  const params = new URLSearchParams(location.search);

  // Extract the 'category', 'sort', 'author', 'search', and 'cat' parameters (if available)
  const sort = params.get("sort");
  const author = params.get("author");
  const search = params.get("search");
  const cat = params.get("cat"); // Extract 'cat' parameter

  // Build the display string based on available parameters
  const displayText = [
    search ? `Search: ${search}` : "",
    sort ? `Sort: ${sort}` : "",
    author ? `Author: ${author}` : "",
    cat ? `Category: ${cat}` : "", // Display 'cat' if present
  ]
    .filter(Boolean) // Remove empty strings
    .join(" | ") || "Most popular summaries"; // Default to "All Books" if no filters are applied

  return (
    <div  className=" bg-[var(--navBg)] mb-[80px]  ">
       <Navbar/>
       
       <div className="px-3 pt-4 md:pt-6 md:px-9 ">
       <h3 className="text-4xl md:text-6xl ml-1 mb-1  font-bold text-[var(--textColor)]">
         Book Summaries Library
        </h3>
        <div className="max-w-[700px] mb-5 md:mb-9">
        <h3 className="text-md md:text-xl ml-1 mb-5 md:mb-9 text-[var(--textColor)]">
         Dive into 15-minute nonfiction book summaries crafted for the curious mind. Insights in minutes, wisdom for a lifetime.
         Are you ready to make Somaway? Get started!
        </h3>
        </div>
      
        <div className="mb-2 md:mb-4">
        <CategoriesScroll/>

        </div>

       </div>

       
  

      <div className="flex  flex-row   px-3 md:px-8 text-[var(--textColor)] justify-between">
      <div className="w-full  pr-0 bg-[var(--bodyBg)]  p-2 md:p-8  rounded-3xl text-[var(--bg)] ">
     
      <div className="flex hidden md:flex mb-[30px] justify-between ">

<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-[30px] text-xl ml-2 text-[var(--bg)] font-bold">
        {`Book liblary - ${displayText}`}
      </h1>
      <Search />

</div>


<div className="flex flex-col md:hidden block  items-center justify-center mb-5 pl-1  pr-1 ">

  
<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-2  md:mb-[30px] text-xl ml-2 text-[var(--bg)] font-bold">
        {`Book  Library - ${displayText}`}
      </h1>
      <Search />

</div>
<PopularPosts />


    </div>

</div>

<div className=" mt-4 mt-8 p-3 md:p-8">
<h3 className="text-3xl md:text-5xl ml-2 mb-5 md:mb-9  font-bold text-[var(--textColor)]">
All new releases
</h3>
<Discover />

</div>

 </div>
  );
};

export default PostListPage;
