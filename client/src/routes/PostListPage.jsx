
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoriesScroll from "../components/CategoriesScroll";
import Discover from "../components/Discover";

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
    .join(" | ") || "All books"; // Default to "All Books" if no filters are applied

  return (
    <div  className="  ">
       <Navbar/>
       <div className="mt-2 md:mt-5">
       <CategoriesScroll/>

       </div>

       
   {/*

<div  style={{ zIndex: 100004 }} className="mb-[22px] md:mb-[25px] mt-[15px] md:mt-[20px] sticky top-0.5 md:top-2 ">
 <MainCategories/>
</div>
     */}
<div   className="mb-[22px] md:mb-[25px] mt-[15px] md:mt-[20px] sticky top-0.5 md:top-2 "></div>

      <div className="flex flex-row  text-[var(--textColor)] justify-between">
      <div className="w-full  pr-0  text-[var(--textColor)] ">
     
<div className="flex justify-between mb-5  md:mb-[30px] flex-row " >
<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-5  md:mb-[30px] text-xl ml-2 text-[var(--textColor)] font-bold">
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
