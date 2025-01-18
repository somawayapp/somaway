import { useEffect, useState, useRef } from "react";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { Link } from "react-router-dom";
import Search from "../components/Search";
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
      <div className="flex flex-col mt-0 md:mt-4">
      <div className="flex flex-col lg:flex-row lg:h-[60vh] gap-[100px] mt-4">
        {/* Left Section */}
        <div className="lg:w-1/2 flex flex-col mt-0 md:mt-9 items-start gap-1 md:gap-4 rounded-md">
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
            #1 most
          </h1>
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
            downloaded <span className="text-blue-600">book </span>
          </h1>
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
            <span className="text-blue-600">summary</span> app
          </h1>
          <p className="text-md md:text-xl text-[var(--textColor)]">
            Achieve your goals with Headway by listening and reading the world’s best ideas
          </p>
          <Link
            to="/login"
            className="w-full text-center mt-3 md:mt-0 sm:w-auto px-4 py-3 md:py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 flex mt-[-53px] md:mt-0 flex-col">
          {/* First Featured Post */}
          <div className="flex mb-8 md:mb-0 top-0">
              <img
                src="/desktop.webp"
                alt="Newsletter illustration"
                className="hidden sm:block w-full object-cover rounded-lg"
              />
              <img
                src="/mobile.webp"
                alt="Newsletter illustration"
                className="block sm:hidden w-full object-cover rounded-lg"
              />
          </div>
        </div>
      </div>


    </div>
        <Hero />

   <CategoriesScroll />

   <FeaturedPosts />
    {/* Featured Section Title */}
    <div>
      <h3 className="text-xl md:text-2xl mt-5 md:mt-10 font-bold text-[var(--textColor)]">
     Trending Book summaries    </h3>
    </div>
    <TrendingPosts/>


    <div className=" bg-[var(--textColore)] rounded-2xl p-3 mt-4 md:mt-8 md:p-6 ">
    <h3 className="text-xl md:text-2xl  font-bold text-[var(--textColor)]">
     Most popular Books      </h3>
    <PopularPosts/>
    </div>


   <div>
      <h3 className="text-xl md:text-2xl mt-2 md:mt-3 font-bold text-[var(--textColor)]">
     Latest Books      </h3>
    </div>
   <LatestPosts />





      {/* Recent Posts */}
      <div>
      <h1 className="my-8 lg:text-[50px] text-3xl ml-2 mb-10 mt-10 lg:mb-20 lg:mt-20  text-[#1da1f2] font-bold">Recent Posts</h1>
    
      
      <PostList />




    
      </div>
    </div>
    </div>

  );
};

export default Homepage;
