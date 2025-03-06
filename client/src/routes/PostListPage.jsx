
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/CategoriesScroll";
import Discover from "../components/Discover";
import Footer from "../components/Footer";
import Navbar from "../components/navbar2";

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
    .join(" | ") || "All book summaries"; // Default to "All Books" if no filters are applied

  return (
    <div  className=" bg-[var(--navBg)] mb-[80px]  ">
       <Navbar/>
       <div className="px-3 py-2 md:py-5 md:px-9 ">
       <CategoriesScroll/>

       </div>

       
  

      <div className="flex  flex-row  text-[var(--textColor)] justify-between">
      <div className="w-full  pr-0 bg-[var(--bg2)]  border border-[var(--softBg4)]  p-2 md:p-8  rounded-3xl text-[var(--textColor)] ">
     
      <div className="flex hidden md:flex mb-[30px] justify-between ">

<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-[30px] text-xl ml-2 text-[var(--textColor)] font-bold">
        {`Book liblary - ${displayText}`}
      </h1>
      <Search />

</div>


<div className="flex flex-col md:hidden block  items-center justify-center mb-5 pl-1  pr-1 ">

  
<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-2  md:mb-[30px] text-xl ml-2 text-[var(--textColor)] font-bold">
        {`Book liblary - ${displayText}`}
      </h1>
      <Search />

</div>
   

      <Discover />
    </div>

</div>
 </div>
  );
};

export default PostListPage;
