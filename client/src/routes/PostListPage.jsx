
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/CategoriesScroll";
import Discover from "../components/Discover";
import Footer from "../components/Footer";
import Navbar from "../components/navbar2";
import PopularPosts from "../components/PopularPosts";
import LatestPosts from "../components/LatestPosts";
import TrendingPosts from "../components/TrendingPosts";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { Helmet } from "react-helmet";
import { useEffect } from "react";


const PostListPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);
  
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
    .join(" | ") || "All summaries"; // Default to "All Books" if no filters are applied

  return (
    <div  className=" bg-[var(--navBg)] mb-[80px]  ">
<Helmet>
<title>
  {cat && author 
    ? `${cat} Book Summary by ${author} | Unlock Key Insights` 
    : cat 
      ? `${cat} Book Summaries | Learn from the Best` 
      : author 
        ? `Book Summary by ${author} | Must-Read Summaries` 
        : 'Book Summaries'} | Somaway
</title>

<meta name="description"   content={` Explore top book summaries in the ${cat || 'self-growth'} category. Gain insights from ${author || 'top authors'}in minutes. Elevate your mind—only on Somaway!`} />


 
 
  <meta property="og:title" content="Somaway - Elevate Your Mind" />
  <meta property="og:description" content="Achieve greatness with Somaway. Explore groundbreaking book summaries that transform your life." />
  <meta property="og:image" content="/images/somaway-og.jpg" />
  <meta property="og:url" content={`${window.location.href}`} />
  <meta property="og:type" content="website" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Somaway - Elevate Your Mind" />
  <meta name="twitter:description" content="Revolutionize your thinking with powerful book insights on Somaway." />
  <meta name="twitter:image" content="/images/somaway-twitter.jpg" />
  
  <script type="application/ld+json">
    {`{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Somaway",
      "url": "${window.location.href}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${window.location.href}/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }`}
  </script>
  
  <link rel="canonical" href={`${window.location.href}`} />
  
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
</Helmet>
       <Navbar/>
       
       <div className="px-3 pt-4 md:pt-6 md:px-9 ">
    
      
        <div className="mb-4 md:mb-9">
        <CategoriesScroll/>

        </div>

       </div>

     
  

      <div className="flex  flex-row  justify-between">
      <div className="w-full bg-[var(--bd3)]   p-3 md:p-9   ">
      <div className="md:hidden pt-3 pb-5 block">
       <Search />

       </div>
     
      <div className="flex hidden md:flex mb-[30px] justify-between ">

<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-[30px] text-xl ml-2 text-[var(--textColor)] font-bold">
        {`Book liblary - ${displayText}`}
      </h1>
      <Search />

</div>


<div className="flex flex-col md:hidden block  items-center justify-center mb-5 pl-1  pr-1 ">

  
<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-2  md:mb-[30px] text-xl ml-2 text-[var(--textColor)] font-bold">
        {`Book Library - ${displayText}`}
      </h1>

</div>   
<PostList />

    </div>

</div>

<div className=" mt-2 md:mt-4  p-3 md:p-8">
 
</div>



 

      {/* Recent Posts */}
      <div>
      <div className="flex justify-between mb-10 md:mb-[75px] pt-5 overflow-x-hidden  bg-[var(--textLogo)] 
        items-center gap-5 flex-col md:flex-row">
      <div>
      <h1 className="my-8 lg:text-6xl text-3xl ml-2 pl-2 md:pl-0 mb-2 mt-4 lg:mb-5 lg:mt-8 text-[var(--textColore2)] font-bold"> Book summaries library</h1>
      <p className="text-[var(--textColore2)] pl-2 md:pl-0 ml-2 text-md mb-5 md:mb-7 md:text-xl">Enjoy summarized nonfiction bestsellers</p>
      <Link
            to="/"
            className="w-full ml-4 md:ml-2 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3 bg-[#FF5A5F]   text-white font-semibold 
            rounded-md hover:bg-[#ff4d52]   "
          >
            Discover    
                  </Link>
    </div>

     <img
            src="/summary.svg"
            className="w-100 md:w-180  h-40 md:h-80 mr-0  md:mr-[-100px] object-cover "
          />   
          
          </div>


</div>
<Footer/>

 </div>
  );
};

export default PostListPage;



 
