
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/CategoriesScroll";
import Discover from "../components/Discover";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PopularPosts from "../components/PopularPosts";
import LatestPosts from "../components/LatestPosts";
import TrendingPosts from "../components/TrendingPosts";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

const LandingPage = () => {
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
    .join(" | ") || "Popular summaries  "; // Default to "All Books" if no filters are applied

  return (
    <div  className=" bg-[var(--navBg)] mb-[80px]  ">
        <Helmet>
        <title>The #1 Free App to Unlock the Best Ideas from Top Books! - Somaway Best Book Summaries</title>

<meta name="description" content="Somaway is the #1 award-winning book summary app and website, trusted by 40M+ users worldwide and 100K+ daily readers. Get smarter in just 15 minutes with our free, concise summaries of best-selling books. Join us today—learn and grow, one book summary at a time! " />

<meta name="keywords" content="book summaries, knowledge empowerment, bestselling books, transformative ideas, thought leadership, business books, self-help summaries, industry insights, personal growth, productivity hacks, motivation, innovation strategies, creative thinking, mind mastery, leadership skills, financial wisdom, success mindset, breakthrough thinking, wisdom for life, practical knowledge, free book summary, best book summaries, number one summary app, best app, best summary, learning shortcuts, brain boost, rapid reading, book digest, quick reads, success stories, entrepreneurial mindset, modern wisdom, elite knowledge, mastery techniques, global perspectives, future readiness, book analysis, idea extraction, in-depth reviews, concise knowledge, summary breakdowns, book wisdom, mental expansion, critical thinking, intellectual growth, top books, influential reads, advanced thinking, ultimate book digest, life hacks, professional growth, career mastery, mindset shift, paradigm transformation, unconventional wisdom, practical insights, top nonfiction books, skill enhancement, brain optimization, cognitive skills, mind enhancement, top book reviews, wisdom harvesting, fast knowledge, core ideas, rapid insights, strategic intelligence, innovation fuel, personal development, growth mindset, self-mastery, breakthrough books, smart reading, fast tracking wisdom, peak performance, visionary thinking, knowledge domination, unbeatable learning" />

 
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
       <h3 className="text-4xl md:text-6xl ml-1 mb-1  font-bold text-[var(--textColor)]">
         Book Summaries Library
        </h3>
        <div className="max-w-[700px] mb-5 md:mb-9">
        <h3 className="text-sm md:text-lg ml-1 mb-5 md:mb-9 text-[var(--textColor)]">
         Dive into 15-minute nonfiction book summaries crafted for the curious mind. Insights in minutes, wisdom for a lifetime.
         Are you ready to make Somaway? Get started!
        </h3>
        </div>
      
        <div className="mb-4 md:mb-9">
        <CategoriesScroll/>

        </div>

       </div>

       
  

      <div className="flex  flex-row   text-[var(--textColor)] justify-between">
      <div className="w-full  bg-[var(--bd3)] border-none  md:border md:border-[var(--softBg4)] shadow-sm p-3 md:p-9  text-[var(--bg)] ">
     
      <div className="flex hidden md:flex mb-[30px] justify-between ">

<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-[30px] text-xl ml-2 text-[var(--textColor)] font-bold">
        {`Book liblary - ${displayText}`}
      </h1>
      <Search />

</div>


<div className="flex flex-col md:hidden block  items-center justify-center mb-5 pl-1  pr-1 ">

  
<h1 style={{  zIndex: "10000"}} className=" lg:text-[30px] mb-4 mt-2  md:mb-[30px] text-xl ml-2 text-[var(--textColor)] font-bold">
        {`Book Library - ${displayText}`}
      </h1>
      <Search />

</div>   
   <PopularPosts/>

    </div>

</div>

<div className=" mt-2 md:mt-4  p-3 md:p-8">

   

  
<div >
      <h3 className="text-xl md:text-3xl font-semibold text-[var(--textColor)]">
     Trending summaries    </h3>
    </div>
    <TrendingPosts/>
</div>









    <div className=" bg-[var(--bodyBg)]   p-3 mt-4 md:mt-8 md:p-9 ">
    <h3 className="text-xl md:text-3xl  mt-5 mb-5 md:mb-9 md:mt-9   font-semibold text-[var(--bg)]">
     Featured summaries      </h3>
      <FeaturedPosts />
    
    </div>


 




 


      {/* Recent Posts */}
      <div>
    

    <div className=" px-3 md:px-9">
    <h3 className="text-2xl md:text-4xl ml-2 mt-8 mb-6 md:mb-9 md:mt-9 font-semibold text-[var(--textColor)]">
          All  summaries     </h3>
      <PostList />
    </div>


    <div className="flex justify-between mb-10 md:mb-[75px] pt-5 overflow-x-hidden  bg-[var(--textLogo)] 
        items-center gap-5 flex-col md:flex-row">
      <div>
      <h1 className="my-8 lg:text-6xl text-3xl ml-2 pl-2 md:pl-0 mb-2 mt-4 lg:mb-5 lg:mt-8 text-[var(--textColore2)] font-bold"> Book summaries library</h1>
      <p className="text-[var(--textColore2)] pl-2 md:pl-0 ml-2 text-md mb-5 md:mb-7 md:text-xl">Enjoy summarized nonfiction bestsellers</p>
      <Link
            to="/"
            className="w-full ml-4 md:ml-2 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3 bg-[#0062e3]   text-white font-semibold 
            rounded-md hover:bg-[#0053bf]   "
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



export default LandingPage;
