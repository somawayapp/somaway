import { useEffect, useState, useRef } from "react";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { Link } from "react-router-dom";
import Search from "../components/Search2";
import Maincategories from "../components/MainCategories";
import SideMenu from "../components/SideMenu";
import ThemeToggler from "../components/Theme";
import Sidebar from "../components/Sidebar2";
import { ThemeProvider } from "../../themecontext";
import Navbar from "../components/Navbar";
import CategoriesScroll from "../components/CategoriesScroll";
import Hero from "../components/Hero";
import LatestPosts from "../components/LatestPosts";
import PopularPosts from "../components/PopularPosts";
import TrendingPosts from "../components/TrendingPosts";
import StoryLine from "../components/StoryLine";
import Footer from "../components/Footer";

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const searchRef = useRef(null);
  const shareRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY <=600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        showSearch
      ) {
        setShowSearch(false);
      }
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target) &&
        showShare
      ) {
        setShowShare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch, showShare]);

  return (
      <div>
            <Navbar/>

    <div className="mb-9   flex flex-col gap-0">

         

      {/* Floating Section */}
      
      <div
  className={` flex items-center hidden sm:block  mx-auto justify-between px-5 py-3 transition-opacity 
    duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} sm:opacity-100 sm:pointer-events-auto  `}
 
>

        {/* 

        <Link to="/" className="flex items-center mt-[10px] gap-1 text-lg font-bold md:text-2xl">
        <img src="/x.png" alt="Logo" className="w-50 h-20 lg:w-50 lg:h-20" />

<span className="text-[var(--textLogo)] text-[30px] lg:text-[90px]"></span>

</Link>  */}

      

 
      </div>


   {/*

      <div  style={{ zIndex: 100004 }} className="mb-[45px] md:mb-[30px] mt-[15px] md:mt-[20px] sticky top-0.5 md:top-2 ">
  <Maincategories />
</div>
     */}
     
        <Hero />

   <CategoriesScroll />


   <div className=" bg-[var(--textColore)] rounded-2xl p-3  md:p-6 mt-0 md:mt-4">
     

     {/* Featured Section Title */}
   <div className="flex justify-between mb-3 md:mb-6 items-center gap-2 flex-col md:flex-row">
     <h3 className="text-xl md:text-2xl font-extrabold text-[var(--textColor)]">
       Featured book summaries
     </h3>
     <div className="mb-3">
     <Search />

     </div>
   </div>
   <FeaturedPosts />

   </div>

<div className="mb-0 md:mb-[50px] ">
  
<div >
      <h3 className="text-xl md:text-2xl mt-7  md:mt-10 font-extrabold text-[var(--textColor)]">
     Trending Book summaries    </h3>
    </div>
    <TrendingPosts/>
</div>



    <div className="mt-0 mb:mt-[45px] ">
      <div className="flex justify-between  mt-4 mb-15  md:mb-[40px] pt-5 pl-0  md:pl-5 overflow-x-hidden  rounded-2xl bg-[#7a00da] 
        items-center gap-5 flex-col md:flex-row">
      <div>
      <h1 className="my-8 text-center lg:text-5xl text-2xl ml-2 pl-2 md:pl-0 mb-2 mt-4 lg:mb-5 lg:mt-8 text-white font-bold">
      Get smarter in just 5 minutes</h1>
      <p className="text-white pl-2 md:pl-0 text-center md:text-left pr-4 ml-2 text-md mb-5 md:mb-7 md:text-xl">Grasp the book’s key ideas in less than 15 minutes

</p>
<div className="flex justify-center md:justify-start">
<Link
            to="/login"
            className="w-full items-center ml-4 md:ml-2 mr-4 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3 bg-white text-black font-semibold 
            rounded-md hover:bg-blue-700"
          >
            Get Started    
          </Link>
</div>
    
    </div>

     <img
            src="/group.svg"
            alt="Newsletter illustration"
            className="w-100 md:w-180  h-40 md:h-80  md:mr-[40px] mr-0 object-cover "
          />   
          
          </div>
      </div>



    <div className=" bg-[var(--textColore)] rounded-2xl p-3 mt-10 md:mt-4 md:mt-8 md:p-6 ">
    <h3 className="text-xl md:text-2xl  font-extrabold text-[var(--textColor)]">
     Most popular Books      </h3>
    <PopularPosts/>
    </div>


<div className="mb-0 md:mb-[20px] ">
<div>
      <h3 className="text-xl md:text-2xl ml-2 mt-7 mb-3 md:mb-6 md:mt-10 font-extrabold text-[var(--textColor)]">
     Latest Book summaries     </h3>
    </div>
   <LatestPosts />
</div>
   





      {/* Recent Posts */}
      <div>
      <div className="flex justify-between  mt-10 mb-10 md:mt[60px] md:mb-[75px] pt-5 pl-0  md:pl-5 overflow-x-hidden  rounded-2xl bg-[var(--textLogo)] 
        items-center gap-5 flex-col md:flex-row">
      <div>
      <h1 className="my-8 lg:text-6xl text-3xl ml-2 pl-2 md:pl-0 mb-2 mt-4 lg:mb-5 lg:mt-8 text-[var(--textColore2)] font-bold"> Book summaries library</h1>
      <p className="text-[var(--textColore2)] pl-2 md:pl-0 ml-2 text-md mb-5 md:mb-7 md:text-xl">Enjoy summarized nonfiction bestsellers</p>
      <Link
            to="/login"
            className="w-full ml-4 md:ml-2 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3 bg-blue-600 text-white font-semibold 
            rounded-md hover:bg-blue-700"
          >
            Discover    
                  </Link>
    </div>

     <img
            src="/summary.svg"
            alt="Newsletter illustration"
            className="w-100 md:w-180  h-40 md:h-80 mr-0  md:mr-[-100px] object-cover "
          />   
          
          </div>

    
      
      <PostList />

      <StoryLine />

      <Footer />


    
      </div>
    </div>
    </div>

  );
};

export default Homepage;
