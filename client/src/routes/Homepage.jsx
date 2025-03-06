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
import MobileControls from "../components/MobileControls";

const Homepage = () => {
 

  return (
      <div>
            <Navbar/>

    <div className="mb-9  px-3 md:px-9  flex flex-col gap-0">

         

      {/* Floating Section 
      
      <div
  className={` flex items-center hidden sm:block  mx-auto justify-between px-5 py-3 transition-opacity 
    duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} sm:opacity-100 sm:pointer-events-auto  `}
 
>


        <Link to="/" className="flex items-center mt-[10px] gap-1 text-lg font-bold md:text-2xl">
        <img src="/x.png"  className="w-50 h-20 lg:w-50 lg:h-20" />

<span className="text-[var(--textLogo)] text-[30px] lg:text-[90px]"></span>

</Link>  

      

 
      </div>
      */}

   {/*

      <div  style={{ zIndex: 100004 }} className="mb-[45px] md:mb-[30px] mt-[15px] md:mt-[20px] sticky top-0.5 md:top-2 ">
  <Maincategories />
</div>
     */}
     
        <Hero />

   <CategoriesScroll />


   <div className=" bg-[var(--bodyBg)]  rounded-2xl p-3  md:p-6 mt-0 md:mt-4">
     



      <StoryLine />

      <Footer />


    
      </div>
    </div>
    </div>

  );
};

export default Homepage;
